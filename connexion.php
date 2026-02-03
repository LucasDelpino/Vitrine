<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <link rel = "stylesheet" href ="connexion.css">
    <script src="https://kit.fontawesome.com/3925e8d33e.js" crossorigin="anonymous"></script>
    
    

</head>

<body>
    
    <?php
    $servername ="localhost";
    $username ="root";
    $password ="root";

    try {
        $bdd = new PDO("mysql:host=$servername;dbname=bddnelegance", $username, $password);
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    catch (PDOException $e){
        echo "Erreur : ".$e->getMessage();
        
    }

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $email = $_POST ["email"];
        $password = $_POST["pass"];
        if($email != "" && $password != ""){
            //création token
            $token = bin2hex(random_bytes(32));
            //Connexion à la BDD
            $req = $bdd->query("SELECT * FROM utilisateurs WHERE email = '$email' AND pass ='$password'");
            $rep = $req->fetch();
            if($rep ["id"] != false){
                //Token lié avec la BDD
                $bdd->exec("UPDATE utilisateurs SET token = '$token' WHERE email = '$email' AND pass = '$password'");
                setcookie("token", $token, time() + 3600);
                setcookie("email", $email, time() + 3600);
                //création de cookie
                //setcookie("username", $email, time() + 3600);
                //setcookie("password", $password, time() + 3600);
                //echo "Vous êtes connecté avec : " ;//.$_COOKIE['username'].' - '.$COOKIE['password'];
                header("Location: utilisateurs.php");
                exit();
                //header("Location: exemple.php") pour rediriger
                //exit();


            }
            else{
                $error_msg = "Email ou mot de passe incorrect.";
            }




        }
    }

    ?>

    <form method="POST" action="">
        <section>
            <h1>Connexion</h1>
            <div class="input-box">
            <label for="email">Email</label>
                <input type="email" placeholder="Entrez votre email" id="email" name="email" required>
                <i class="fa-regular fa-user"></i>
            </div>
            <div class="input-box">
                <label for="pass">Mot de passe</label>
                <input type="password" placeholder="Entrez votre mot de passe" id="pass" name="pass" required>
                <i class="fa-solid fa-key"></i>
            </div>
            <div>
                <!-- input sur "Se connecter" si nécessaire !-->
                <button class="login-btn" type="submit" value="Se connecter" name="ok">Se connecter</button>
            </div>
            <div class="register-link">
                <p>Pas de compte ? <a href="inscription.php">Je m'inscris !</a></p>
            </div>
        </section>
    </form>


<?php

if($error_msg){
    ?>
    <p><?php echo $error_msg; ?></p>
<?php
}
?>
</body>
</html>



