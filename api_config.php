<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$connect = new mysqli("localhost", "root", "", "security");
if ($connect->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB connection failed: " . $connect->connect_error]);
    exit();
}

include 'mailer.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
