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

//$sql = "SELECT * FROM utilisateurs";
//$req = $bdd->query($sql);
//$rep = $req->fetchAll();
//var_dump($rep)

$requete = $bdd->prepare("SELECT * FROM utilisateurs WHERE nom = :nom");
$requete->execute(
    array(
        "nom" => "lobbedey"
    )
);
$reponse = $requete->fetchAll(PDO::FETCH_ASSOC);

var_dump($reponse)



?>