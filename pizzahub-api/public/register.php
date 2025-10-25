<?php
/***** register.php (place inside htdocs/pizzahub-api/public) *****/

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Resolve project root (because this file is in /public)
$ROOT = dirname(__DIR__); // one level up from /public

require_once($ROOT . "/config/session.php");
require_once($ROOT . "/config/db.php");

/* Only allow POST with JSON body */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed; use POST"]); exit;
}

$raw = file_get_contents("php://input");
$in  = json_decode($raw, true);

if (!$in || !isset($in['name'], $in['email'], $in['password'])) {
  http_response_code(400);
  echo json_encode(["error" => "Missing name, email or password"]); exit;
}

$name = trim((string)$in['name']);
$email = trim(strtolower((string)$in['email']));
$pass = (string)$in['password'];

/* Basic validation */
if ($name === '' || strlen($name) > 100) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid name"]); exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid email"]); exit;
}
if (strlen($pass) < 4) {
  http_response_code(400);
  echo json_encode(["error" => "Password too short (min 4 chars)"]); exit;
}

/* Check if email already exists */
$check = $mysqli->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
if (!$check) {
  http_response_code(500);
  echo json_encode(["error" => "DB prepare failed: ".$mysqli->error]); exit;
}
$check->bind_param("s", $email);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
  http_response_code(409);
  echo json_encode(["error" => "Email already registered"]); exit;
}

/* Create user */
$hash = password_hash($pass, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare("INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,'customer')");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["error" => "DB prepare failed: ".$mysqli->error]); exit;
}
$stmt->bind_param("sss", $name, $email, $hash);

if ($stmt->execute()) {
  echo json_encode(["ok" => true]);
} else {
  // 1062 = duplicate key (unique constraint) – handle gracefully
  if ($mysqli->errno === 1062) {
    http_response_code(409);
    echo json_encode(["error" => "Email already registered"]); exit;
  }
  http_response_code(500);
  echo json_encode(["error" => "DB insert failed: ".$mysqli->error]);
}
