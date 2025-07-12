<?php
session_start();
header("Content-Type: application/json");
require_once 'mailer.php';

$connect = new mysqli("localhost", "root", "", "security");
if ($connect->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validate inputs
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

// attempt limit
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}
if ($_SESSION['login_attempts'] >= 3) {
    http_response_code(429);
    echo json_encode(["success" => false, "message" => "Too many failed login attempts. Try again later."]);
    exit;
}

// Query
$stmt = $connect->prepare("SELECT * FROM security WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // successful login: reset attempts
        $_SESSION['login_attempts'] = 0;

        // senerate secure OTP
        $otp = random_int(100000, 999999);

        // store OTP in session
        $_SESSION['otp'] = $otp;
        $_SESSION['user_email'] = $email;
        $_SESSION['otp_verified'] = false;
        $_SESSION['otp_expiry'] = time() + 300; // 5 min expiry
        $_SESSION['otp_attempts'] = 0;
        $_SESSION['resend_attempts'] = 0;

        // generate email
        $message = "<p>Your SecureAuth login OTP is <strong>$otp</strong>. It will expire in 5 minutes.</p>";
        $mailStatus = sendMail($email, "Your SecureAuth Login OTP", $message);

        if ($mailStatus === true) {
            echo json_encode([
                "success" => true,
                "redirect_to_otp" => true,
                "message" => "Login successful. OTP sent to your email."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Login succeeded but failed to send OTP: $mailStatus"
            ]);
        }
    } else {
        $_SESSION['login_attempts']++;
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    $_SESSION['login_attempts']++;
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "No account found with that email."]);
}

$stmt->close();
$connect->close();
