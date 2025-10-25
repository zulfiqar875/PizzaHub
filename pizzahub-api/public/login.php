<?php require_once("../config/session.php"); require_once("../config/db.php");
$in = json_decode(file_get_contents("php://input"), true);
$stmt = $mysqli->prepare("SELECT id,role,name,email,password_hash FROM users WHERE email=?");
$stmt->bind_param("s",$in['email']); $stmt->execute(); $res=$stmt->get_result(); $u=$res->fetch_assoc();
if($u && password_verify($in['password'], $u['password_hash'])){
  $_SESSION['user'] = ["id"=>$u['id'],"role"=>$u['role'],"name"=>$u['name'],"email"=>$u['email']];
  echo json_encode(["ok"=>true,"user"=>$_SESSION['user']]);
}else{ http_response_code(401); echo json_encode(["error"=>"invalid"]); }
