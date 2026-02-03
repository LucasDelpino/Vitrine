<?php

//Connexion à la base de donnée :
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

// Formulaire d'incription
if(isset($_POST["ok"])){
    $nom = $_POST["nom"];
    $prenom = $_POST["prenom"];
    $pseudo = $_POST["pseudo"];
    $email = $_POST["email"];
    $pass = $_POST["pass"];

    $requete = $bdd->prepare("INSERT INTO utilisateurs VALUES (0, :nom, :prenom, :pseudo, :email, :pass, '')"); // MD5(:pass) pour une MDP chiffré
    $requete->execute(
        array(
            "nom" => $nom,
            "prenom" => $prenom,
            "pseudo" => $pseudo,
            "email" => $email,
            "pass" => $pass
        )
    );
    echo "Inscription validée !";
    //header("Location: Nelegance.html");
    // Pour rediriger la page une fois l'inscription finie :
    // header("Location: nom_de_la_page_a_recharger Ex: incription.php");
}


?>