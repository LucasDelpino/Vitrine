<?php

//Configuration d'un serveur SMTP avec un port nécessaire

$destinataire = "delpino.lucas@hotmail.fr";
$sujet = "Bienvenu sur mon site !";

$message = "<html><body>";
$message = "<h1>Bienvenu sur mon site Nelegance</h1>";
$message = "</body></html>";

$header = "From: lb.madison34@gmail.com\r\n";
$header = "Reply-To: lb.madison34@gmail.com";
$header = "Content-Type: text/html; charset=\"utf-8\"\r\n";

//Envoi

if(mail($destinataire, $sujet, $message, $header)){
    echo "L'email a été envoyé !";

}

else{
    echo "Une erreur est survenue !";

}

?>