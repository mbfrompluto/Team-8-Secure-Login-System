<?php
require_once 'api_config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email is required for password recovery."]);
        exit();
    }

    $stmt_check = $connect->prepare("SELECT id FROM security WHERE email = ?");
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $stmt_check->store_result();
    if ($stmt_check->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No account found with this email."]);
        $stmt_check->close();
        $connect->close();
        exit();
    }
    $stmt_check->close();

    $resetToken = bin2hex(random_bytes(32));
    $expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));

    $stmt_insert_token = $connect->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?");
    $stmt_insert_token->bind_param("sssss", $email, $resetToken, $expiry, $resetToken, $expiry);

    if ($stmt_insert_token->execute()) {
        $resetLink = "http://yourfrontend.com/reset-password.html?token=$resetToken&email=$email";
        $message = "<p>You requested a password reset. Click this link to reset your password: <a href='$resetLink'>$resetLink</a></p><p>This link is valid for 1 hour.</p>";
        $mailResult = sendMail($email, "Password Reset Request for SecureAuth", $message);

        if ($mailResult === true) {
            echo json_encode([
                "success" => true,
                "message" => "Password reset link sent to $email."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to send password reset email: $mailResult"
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to generate password reset token."]);
    }
    $stmt_insert_token->close();

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
}
$connect->close();
