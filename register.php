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
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Basic  validation
if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Name, Email & Password are required."]);
    exit();
}

// Check email 
$stmt_check = $connect->prepare("SELECT id FROM security WHERE email = ?");
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();
if ($stmt_check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    $stmt_check->close();
    exit();
}
$stmt_check->close();

// Hashed password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// additional user data
$age = 0;
$gender = 'N/A';
$phone = 'N/A';

// data base
$stmt = $connect->prepare("
    INSERT INTO security (name, age, gender, email, phone, password, dt)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())
");
$stmt->bind_param("sissss", $name, $age, $gender, $email, $phone, $hashedPassword);

if ($stmt->execute()) {

    $otp = random_int(100000, 999999);


    $_SESSION['otp'] = $otp;
    $_SESSION['user_email'] = $email;
    $_SESSION['otp_verified'] = false;
    $_SESSION['otp_expiry'] = time() + 300; // 5 minutes
    $_SESSION['otp_attempts'] = 0;
    $_SESSION['resend_attempts'] = 0;

    
    $msg = "<p>Your SecureAuth OTP is <strong>$otp</strong>. It will expire in 5 minutes.</p>";
    $mailStatus = sendMail($email, "SecureAuth Registration OTP", $msg);

    if ($mailStatus === true) {
        echo json_encode(["success" => true, "message" => "Registered successfully. OTP sent to email."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Registration succeeded, but failed to send OTP.", "email" => $email]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
}

$stmt->close();
$connect->close();
