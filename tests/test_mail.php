<?php
require __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.free.fr';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'delpino.lucas@free.fr';
    $mail->Password   = 'Vibration34+';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
    $mail->Port       = 587;

    $mail->setFrom('delpino.lucas@free.fr', 'Test Nelegance');
    $mail->addAddress('delpino.lucas@hotmail.fr', 'Moi'); // ton email de test

    $mail->isHTML(true);
    $mail->Subject = "Test PHPMailer depuis localhost";
    $mail->Body    = "<h2>Bonjour !</h2><p>Ça fonctionne depuis MAMP.</p>";

    $mail->send();
    echo "✅ Mail envoyé avec succès !";
} catch (Exception $e) {
    echo "❌ Erreur : {$mail->ErrorInfo}";
}
?>