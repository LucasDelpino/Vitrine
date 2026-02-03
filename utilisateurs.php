<?php

$servername ="localhost";
$username ="root";
$password ="root";

try {
    $bdd = new PDO("mysql:host=$servername;dbname=bddnelegance", $username, $password);
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connexion réussie !";
}

catch (PDOException $e){
    echo "Erreur : ".$e->getMessage();
}

$email = $_COOKIE['email'];
$token = $_COOKIE['token'];

if($token){
    $req = $bdd->query("SELECT * FROM utilisateurs WHERE email = '$email' AND token = '$token'");
    $rep = $req->fetch();
    
    if($rep['pseudo'] != false){
        echo "Vous êtes connecté ".$rep['pseudo']." !";
        header("Location: Nelegance.html");
        exit();

}

else{
    header("Location: connexion.php");
}

}


?>