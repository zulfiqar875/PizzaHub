<?php require_once("../config/session.php"); require_once("../config/db.php"); require_once("../lib/auth.php");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $rs = $mysqli->query("SELECT id,name,is_active FROM categories ORDER BY name");
  echo json_encode($rs->fetch_all(MYSQLI_ASSOC)); exit;
}

require_admin();

if ($method === 'POST') { // create
  $in = json_decode(file_get_contents("php://input"), true);
  $stmt=$mysqli->prepare("INSERT INTO categories(name,is_active) VALUES(?,1)");
  $stmt->bind_param("s",$in['name']); $stmt->execute();
  echo json_encode(["ok"=>true, "id"=>$stmt->insert_id]); exit;
}
if ($method === 'PUT') { // update
  parse_str(file_get_contents("php://input"), $in);
  $stmt=$mysqli->prepare("UPDATE categories SET name=?, is_active=? WHERE id=?");
  $stmt->bind_param("sii",$in['name'],$in['is_active'],$in['id']); $stmt->execute();
  echo json_encode(["ok"=>true]); exit;
}
if ($method === 'DELETE') {
  parse_str(file_get_contents("php://input"), $in);
  $stmt=$mysqli->prepare("DELETE FROM categories WHERE id=?"); $stmt->bind_param("i",$in['id']); $stmt->execute();
  echo json_encode(["ok"=>true]); exit;
}
