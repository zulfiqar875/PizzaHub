<?php
function require_login() {
  if (empty($_SESSION['user'])) { http_response_code(401); echo json_encode(["error"=>"unauthorized"]); exit; }
}
function require_admin() {
  require_login();
  if ($_SESSION['user']['role'] !== 'admin') { http_response_code(403); echo json_encode(["error"=>"forbidden"]); exit; }
}
