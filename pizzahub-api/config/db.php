<?php
$mysqli = new mysqli("localhost", "root", "", "pizzahub");
if ($mysqli->connect_error) { http_response_code(500); die("DB error: ".$mysqli->connect_error); }
$mysqli->set_charset("utf8mb4");
