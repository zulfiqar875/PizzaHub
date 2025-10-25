<?php require_once("../config/session.php"); require_once("../config/db.php"); require_once("../lib/auth.php");
require_login(); $uid = $_SESSION['user']['id'];

function get_cart_id($mysqli,$uid){
  $rs=$mysqli->query("SELECT id FROM carts WHERE user_id=".$uid);
  if($row=$rs->fetch_assoc()) return $row['id'];
  $mysqli->query("INSERT INTO carts(user_id) VALUES ($uid)");
  return $mysqli->insert_id;
}

$method=$_SERVER['REQUEST_METHOD'];
if($method==='GET'){
  $cid=get_cart_id($mysqli,$uid);
  $q="SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price FROM cart_items ci JOIN products p ON p.id=ci.product_id WHERE ci.cart_id=$cid";
  $rs=$mysqli->query($q); echo json_encode(["items"=>$rs->fetch_all(MYSQLI_ASSOC)]); exit;
}
if($method==='POST'){
  $in=json_decode(file_get_contents("php://input"), true);
  $cid=get_cart_id($mysqli,$uid);
  // upsert
  $stmt=$mysqli->prepare("INSERT INTO cart_items(cart_id,product_id,quantity) VALUES(?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+VALUES(quantity)");
  $stmt->bind_param("iii",$cid,$in['product_id'],$in['quantity']); $stmt->execute();
  echo json_encode(["ok"=>true]); exit;
}
if($method==='DELETE'){
  parse_str(file_get_contents("php://input"), $in);
  $stmt=$mysqli->prepare("DELETE FROM cart_items WHERE id=?"); $stmt->bind_param("i",$in['id']); $stmt->execute();
  echo json_encode(["ok"=>true]); exit;
}
