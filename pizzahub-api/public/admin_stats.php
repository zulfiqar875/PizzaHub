<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$ROOT = dirname(__DIR__);
require_once($ROOT . "/config/session.php");
require_once($ROOT . "/config/db.php");
require_once($ROOT . "/lib/auth.php");

require_admin();

// counts
$totals = [
  "categories" => 0,
  "products"   => 0,
  "users"      => 0,
  "orders_today" => 0
];

// categories
$rs = $mysqli->query("SELECT COUNT(*) c FROM categories");
$totals["categories"] = (int)($rs->fetch_assoc()["c"] ?? 0);

// products
$rs = $mysqli->query("SELECT COUNT(*) c FROM products");
$totals["products"] = (int)($rs->fetch_assoc()["c"] ?? 0);

// users
$rs = $mysqli->query("SELECT COUNT(*) c FROM users");
$totals["users"] = (int)($rs->fetch_assoc()["c"] ?? 0);

// today orders
$rs = $mysqli->query("SELECT COUNT(*) c FROM orders WHERE DATE(placed_at)=CURDATE()");
$totals["orders_today"] = (int)($rs->fetch_assoc()["c"] ?? 0);

// latest today's orders (limit 10)
$orders = [];
$q = "
  SELECT id, user_id, status, total, placed_at, tracker_code
  FROM orders
  WHERE DATE(placed_at)=CURDATE()
  ORDER BY placed_at DESC
  LIMIT 10
";
$res = $mysqli->query($q);
if ($res) { $orders = $res->fetch_all(MYSQLI_ASSOC); }

echo json_encode(["totals"=>$totals, "today_orders"=>$orders]);
