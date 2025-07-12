<?php
session_start();
require_once 'api_config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit();
}


if (!isset($_SESSION['resend_attempts'])) {
    $_SESSION['resend_attempts'] = 0;
}
if ($_SESSION['resend_attempts'] >= 3) {
    http_response_code(429); // Too Many Requests
    echo json_encode(["success" => false, "message" => "Too many OTP resend attempts. Try again later."]);
    exit();
}


if (isset($_SESSION['user_email']) && $_SESSION['user_email'] !== $email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email mismatch with session."]);
    exit();
}


$otp = random_int(100000, 999999);

// Store OTP details in session
$_SESSION['otp'] = $otp;
$_SESSION['user_email'] = $email;
$_SESSION['otp_verified'] = false;
$_SESSION['otp_expiry'] = time() + 300; // 5-minute expiry
$_SESSION['otp_attempts'] = 0;
$_SESSION['resend_attempts']++;


$message = "<p>Your new OTP for SecureAuth is <strong>$otp</strong>. It is valid for 5 minutes.</p>";
$mailResult = sendMail($email, "Your SecureAuth OTP (Resend)", $message);

if ($mailResult === true) {
    echo json_encode([
        "success" => true,
        "message" => "New OTP sent to $email."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to send OTP: $mailResult"
    ]);
}

$connect->close();
