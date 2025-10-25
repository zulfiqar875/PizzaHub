<?php
// public/orders.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$ROOT = dirname(__DIR__); // parent of /public
require_once($ROOT . "/config/session.php");
require_once($ROOT . "/config/db.php");
require_once($ROOT . "/lib/auth.php");

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Helper: get cart id for user
 */
function get_cart_id(mysqli $mysqli, int $uid) {
  $stmt = $mysqli->prepare("SELECT id FROM carts WHERE user_id = ? LIMIT 1");
  $stmt->bind_param("i", $uid);
  $stmt->execute();
  $res = $stmt->get_result()->fetch_assoc();
  return $res ? (int)$res['id'] : 0;
}

/**
 * Helper: fetch cart items (joined with products)
 */
function get_cart_items(mysqli $mysqli, int $cart_id) {
  $stmt = $mysqli->prepare("
    SELECT p.id AS pid, p.name, p.price, ci.quantity
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
  ");
  $stmt->bind_param("i", $cart_id);
  $stmt->execute();
  return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

if ($method === 'POST') {
  // -------- Place order --------
  require_login();
  $uid = (int)$_SESSION['user']['id'];

  $in = json_decode(file_get_contents("php://input"), true) ?: [];
  $delivery_address = isset($in['delivery_address']) ? trim($in['delivery_address']) : '';
  if ($delivery_address === '') {
    http_response_code(400);
    echo json_encode(["error" => "Delivery address required"]); exit;
  }

  $cid = get_cart_id($mysqli, $uid);
  if (!$cid) { http_response_code(400); echo json_encode(["error" => "empty cart"]); exit; }

  $items = get_cart_items($mysqli, $cid);
  if (!$items || count($items) === 0) {
    http_response_code(400);
    echo json_encode(["error" => "empty cart"]); exit;
  }

  // totals
  $subtotal = 0.0;
  foreach ($items as $it) { $subtotal += ((float)$it['price']) * ((int)$it['quantity']); }
  $tax = round($subtotal * 0.10, 2);
  $delivery_fee = 150.00;
  $total = $subtotal + $tax + $delivery_fee;

  $status  = 'PENDING';
  $tracker = strtoupper(substr(md5(uniqid('', true)), 0, 8));

  // Use transaction to keep order & items consistent
  $mysqli->begin_transaction();
  try {
    // Insert order
    $stmt = $mysqli->prepare("
      INSERT INTO orders (user_id, status, subtotal, tax, delivery_fee, total, delivery_address, tracker_code)
      VALUES (?,?,?,?,?,?,?,?)
    ");
    // types: i s d d d d s s
    $stmt->bind_param("isddddss", $uid, $status, $subtotal, $tax, $delivery_fee, $total, $delivery_address, $tracker);
    if (!$stmt->execute()) { throw new Exception("Order insert failed: ".$mysqli->error); }
    $oid = $stmt->insert_id;

    // Insert order items
    $stmtItem = $mysqli->prepare("
      INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, quantity)
      VALUES (?,?,?,?,?)
    ");
    if (!$stmtItem) { throw new Exception("Order item prepare failed: ".$mysqli->error); }
    foreach ($items as $it) {
      $pid   = (int)$it['pid'];
      $pname = (string)$it['name'];
      $pprice= (float)$it['price'];
      $qty   = (int)$it['quantity'];
      // types: i i s d i
      $stmtItem->bind_param("iisdi", $oid, $pid, $pname, $pprice, $qty);
      if (!$stmtItem->execute()) { throw new Exception("Order item insert failed: ".$mysqli->error); }
    }

    // Status history
    $stmtHist = $mysqli->prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?,?,?)");
    $note = 'Order placed';
    $stmtHist->bind_param("iss", $oid, $status, $note);
    if (!$stmtHist->execute()) { throw new Exception("History insert failed: ".$mysqli->error); }

    // Clear cart items
    $stmtClr = $mysqli->prepare("DELETE FROM cart_items WHERE cart_id = ?");
    $stmtClr->bind_param("i", $cid);
    if (!$stmtClr->execute()) { throw new Exception("Cart clear failed: ".$mysqli->error); }

    // Create invoice (optional unpaid by default)
    $invNo = "INV-".date("Ymd")."-".$oid;
    $stmtInv = $mysqli->prepare("INSERT INTO invoices (order_id, invoice_number, paid) VALUES (?,?,0)");
    $stmtInv->bind_param("is", $oid, $invNo);
    if (!$stmtInv->execute()) { throw new Exception("Invoice insert failed: ".$mysqli->error); }

    $mysqli->commit();

    echo json_encode([
      "ok" => true,
      "order_id" => $oid,
      "tracker_code" => $tracker,
      "total" => $total
    ]);
    exit;

  } catch (Throwable $e) {
    $mysqli->rollback();
    http_response_code(500);
    echo json_encode(["error" => "Order failed", "detail" => $e->getMessage()]);
    exit;
  }
}

if ($method === 'GET') {
  // Two modes:
  // 1) ?order_id=...  -> return items for that order (admin or owner)
  // 2) no param       -> list orders (admin: all, user: own)
  require_login();

  if (isset($_GET['order_id'])) {
    $oid = (int)$_GET['order_id'];

    // if not admin, ensure the order belongs to the user
    if ($_SESSION['user']['role'] !== 'admin') {
      $uid = (int)$_SESSION['user']['id'];
      $check = $mysqli->prepare("SELECT id FROM orders WHERE id=? AND user_id=?");
      $check->bind_param("ii", $oid, $uid);
      $check->execute();
      if (!$check->get_result()->fetch_assoc()) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]); exit;
      }
    }

    $stmt = $mysqli->prepare("
      SELECT name_snapshot, price_snapshot, quantity
      FROM order_items WHERE order_id = ?
    ");
    $stmt->bind_param("i", $oid);
    $stmt->execute();
    $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["items" => $items]); exit;
  }

  if ($_SESSION['user']['role'] === 'admin') {
    $rs = $mysqli->query("SELECT * FROM orders ORDER BY placed_at DESC");
  } else {
    $uid = (int)$_SESSION['user']['id'];
    $rs = $mysqli->query("SELECT * FROM orders WHERE user_id=$uid ORDER BY placed_at DESC");
  }
  echo json_encode($rs->fetch_all(MYSQLI_ASSOC)); exit;
}

// If we reach here:
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
