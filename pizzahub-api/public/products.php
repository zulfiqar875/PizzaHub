<?php require_once("../config/session.php"); require_once("../config/db.php"); require_once("../lib/auth.php");
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $cat = $_GET['category_id'] ?? null;
  $q = "SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.is_active=1";
  if ($cat) { $q .= " AND p.category_id=".(int)$cat; }
  $q .= " ORDER BY p.created_at DESC";
  $rs=$mysqli->query($q); echo json_encode($rs->fetch_all(MYSQLI_ASSOC)); exit;
}

require_admin();

if ($method === 'POST') {
  $in = json_decode(file_get_contents("php://input"), true);
  $stmt=$mysqli->prepare("INSERT INTO products(category_id,name,description,price,image_url,is_active) VALUES(?,?,?,?,?,1)");
  $stmt->bind_param("issds",$in['category_id'],$in['name'],$in['description'],$in['price'],$in['image_url']);
  $stmt->execute(); echo json_encode(["ok"=>true,"id"=>$stmt->insert_id]); exit;
}
if ($method === 'PUT') {
  parse_str(file_get_contents("php://input"), $in);
  $stmt=$mysqli->prepare("UPDATE products SET category_id=?, name=?, description=?, price=?, image_url=?, is_active=? WHERE id=?");
  $stmt->bind_param("issdsii",$in['category_id'],$in['name'],$in['description'],$in['price'],$in['image_url'],$in['is_active'],$in['id']);
  $stmt->execute(); echo json_encode(["ok"=>true]); exit;
}
if ($method === 'DELETE') {
  parse_str(file_get_contents("php://input"), $in);
  $stmt=$mysqli->prepare("DELETE FROM products WHERE id=?"); $stmt->bind_param("i",$in['id']); $stmt->execute();
  echo json_encode(["ok"=>true]); exit;
}
