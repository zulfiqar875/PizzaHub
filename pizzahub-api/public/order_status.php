<?php
// public/order_status.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$ROOT = dirname(__DIR__);
require_once($ROOT . "/config/session.php");
require_once($ROOT . "/config/db.php");
require_once($ROOT . "/lib/auth.php");

$method = $_SERVER['REQUEST_METHOD'];

/**
 * GET: ?code=TRACKERCODE  -> returns { order, history }
 * POST (admin): {order_id, status, note?} -> updates order, inserts history
 */

if ($method === 'GET') {
  if (!isset($_GET['code'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing tracker code"]); exit;
  }
  $code = trim($_GET['code']);

  $stmt = $mysqli->prepare("SELECT * FROM orders WHERE tracker_code = ? LIMIT 1");
  $stmt->bind_param("s", $code);
  $stmt->execute();
  $order = $stmt->get_result()->fetch_assoc();
  if (!$order) { http_response_code(404); echo json_encode(["error"=>"Not found"]); exit; }

  // anyone logged-in can poll their own order; admin can poll any
  require_login();
  if ($_SESSION['user']['role'] !== 'admin' && (int)$order['user_id'] !== (int)$_SESSION['user']['id']) {
    http_response_code(403); echo json_encode(["error"=>"Forbidden"]); exit;
  }

  $stmtH = $mysqli->prepare("SELECT status, note, changed_at FROM order_status_history WHERE order_id=? ORDER BY changed_at DESC");
  $oid = (int)$order['id'];
  $stmtH->bind_param("i", $oid);
  $stmtH->execute();
  $history = $stmtH->get_result()->fetch_all(MYSQLI_ASSOC);

  echo json_encode(["order"=>$order, "history"=>$history]); exit;
}

if ($method === 'POST') {
  // Only admin can change status
  require_admin();

  $in = json_decode(file_get_contents("php://input"), true) ?: [];
  if (!isset($in['order_id'], $in['status'])) {
    http_response_code(400);
    echo json_encode(["error"=>"order_id and status required"]); exit;
  }

  $oid   = (int)$in['order_id'];
  $status= strtoupper(trim($in['status']));
  $note  = isset($in['note']) ? trim((string)$in['note']) : '';

  // Optional: restrict to allowed list
  $allowed = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];
  if (!in_array($status, $allowed, true)) {
    http_response_code(400);
    echo json_encode(["error"=>"Invalid status"]); exit;
  }

  // Update + history in one transaction
  $mysqli->begin_transaction();
  try {
    $stmtU = $mysqli->prepare("UPDATE orders SET status=? WHERE id=?");
    $stmtU->bind_param("si", $status, $oid);
    if (!$stmtU->execute()) { throw new Exception("Update failed: ".$mysqli->error); }

    $stmtH = $mysqli->prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?,?,?)");
    $stmtH->bind_param("iss", $oid, $status, $note);
    if (!$stmtH->execute()) { throw new Exception("History insert failed: ".$mysqli->error); }

    $mysqli->commit();
    echo json_encode(["ok"=>true, "order_id"=>$oid, "status"=>$status]);
    exit;
  } catch (Throwable $e) {
    $mysqli->rollback();
    http_response_code(500);
    echo json_encode(["error"=>"Status update failed", "detail"=>$e->getMessage()]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
