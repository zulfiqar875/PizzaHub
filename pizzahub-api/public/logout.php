<?php require_once("../config/session.php");
$_SESSION = []; session_destroy(); echo json_encode(["ok"=>true]);
