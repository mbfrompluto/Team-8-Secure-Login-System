<?php
require_once __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

function sendMail($to, $subject, $htmlContent) {
    try {
        $username = 'dhruvmy90@gmail.com';
        $appPassword = 'ipexpvstsyvbtjsi'; 

        $dsn = 'smtp://' . urlencode($username) . ':' . urlencode($appPassword) . '@smtp.gmail.com:587?encryption=tls';

        $transport = Transport::fromDsn($dsn);
        $mailer = new Mailer($transport);

        $email = (new Email())
            ->from($username)
            ->to($to)
            ->subject($subject)
            ->html($htmlContent);

        $mailer->send($email);
        return true;
    } catch (Exception $e) {
        return "❌ Mailer Error: " . $e->getMessage();
    }
}
?>
