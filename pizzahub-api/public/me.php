<?php require_once("../config/session.php");
echo json_encode(["user"=>($_SESSION['user'] ?? null)]);
