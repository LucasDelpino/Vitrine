<!DOCTYPE html>
<html lang = "fr">

<head>
    <meta charset = "UTF - 8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name = "viewport" content = "width=device-width, initial-scale=1.0">
    <title> Inscription </title>
    <link rel = "stylesheet" href ="inscription.css">
    <script src="https://kit.fontawesome.com/3925e8d33e.js" crossorigin="anonymous"></script>
    
</head>

<body>
    <section>
    <h1> Veuillez renseignez les champs suivant : </h1>
    <form method="POST" action="traitement.php">
        <div class="input-box">
            <label for="nom">Votre nom*</label>
            <input type="text" id="nom" name="nom" placeholder="Entrez votre nom" required>
        </div>
        <div class="input-box">
            <label for="prenom">Votre prénom*</label>
            <input type="text" id="prenom" name="prenom" placeholder="Entrez votre prénom" required>
        </div>
        <div class="input-box">
            <label for="pseudo">Votre pseudo*</label>
            <input type="text" id="pseudo" name="pseudo" placeholder="Entrez votre pseudo" required>
        </div>
        <div class="input-box">
            <label for="email">Votre email*</label>
            <input type="text" id="email" name="email" placeholder="Entrez votre email" required>
        </div>
        <div class="input-box">
            <label for="pass">Votre mot de passe*</label>
            <input type="password" id="pass" name="pass" placeholder="Entrez votre mot de passe" required>
        </div>
        <div class="login-btn">
        <button class="login-btn" type="submit" value="M'inscrire" name="ok">M'inscrire</button>
        </div>
    
    </form>
    </section>

</body>
</html>