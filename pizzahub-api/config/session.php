<?php
// config/session.php
// CORS for vite dev origin:
$origin = 'http://localhost:5173';
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $origin) {
  header("Access-Control-Allow-Origin: $origin");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; } // preflight

session_name("PIZZAHUBSESSID");
session_start();
header('Content-Type: application/json');
