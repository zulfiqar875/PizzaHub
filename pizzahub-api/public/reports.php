<?php require_once("../config/session.php"); require_once("../config/db.php"); require_once("../lib/auth.php");
require_admin();
$range = $_GET['range'] ?? 'daily';
$groupFmt = $range==='monthly' ? '%Y-%m' : ($range==='weekly' ? '%x-%v' : '%Y-%m-%d');
$q = $mysqli->prepare("
  SELECT DATE_FORMAT(placed_at, ?) AS period,
         COUNT(*) orders_count,
         SUM(total) revenue
  FROM orders
  WHERE status IN ('CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED')
  GROUP BY DATE_FORMAT(placed_at, ?)
  ORDER BY period DESC
  LIMIT 31
");
$q->bind_param("ss",$groupFmt,$groupFmt);
$q->execute(); $res=$q->get_result();
echo json_encode($res->fetch_all(MYSQLI_ASSOC));
