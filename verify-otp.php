<?php
require_once 'api_config.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$enteredOtp = trim($data['otp'] ?? '');
$email = trim($data['email'] ?? '');


if (!isset($_SESSION['otp'], $_SESSION['user_email'], $_SESSION['otp_expiry'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Session expired or invalid"]);
    exit();
}


if (time() > $_SESSION['otp_expiry']) {
    unset($_SESSION['otp'], $_SESSION['otp_expiry']);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "OTP has expired. Please request a new one."]);
    exit();
}


if (!isset($_SESSION['otp_attempts'])) {
    $_SESSION['otp_attempts'] = 0;
}


if ($_SESSION['otp'] != $enteredOtp || $_SESSION['user_email'] !== $email) {
    $_SESSION['otp_attempts']++;

    if ($_SESSION['otp_attempts'] >= 3) {
        unset($_SESSION['otp'], $_SESSION['otp_expiry'], $_SESSION['otp_attempts']);
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Too many incorrect attempts. Please log in again."]);
        exit();
    }

    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid OTP. Attempt {$_SESSION['otp_attempts']} of 3."
    ]);
    exit();
}


$_SESSION['otp_verified'] = true;
unset($_SESSION['otp'], $_SESSION['otp_expiry'], $_SESSION['otp_attempts']);

echo json_encode([
    "success" => true,
    "message" => "OTP verified successfully!",
    "redirect_to_dashboard" => true
]);

$connect->close();
