<?php
$user = $_SESSION['user'] ?? null;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nelegance - Bijoux en acier inoxydable</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL ?>css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
<header class="main-header">
    <div class="logo"><a href="<?= BASE_URL ?>shop">NELEGANCE</a></div>
    <ul class="nav-list">
        <li><a href="/">Accueil</a></li>
        <li><a href="<?= BASE_URL ?>shop">Boutique</a></li>
        <li><a href="<?= BASE_URL ?>user/dashboard">Mon compte</a></li>
        <li><a href="<?= BASE_URL ?>cart">Panier</a></li>
    </ul>
            <?php if($user && $user['roles'] === 'admin'): ?>
                <li><a href="<?= BASE_URL ?>admin/products">Gestion produit</a></li>
                <li><a href="<?= BASE_URL ?>admin/orders">Commande client</a></li>
            <?php endif; ?>
        
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>
    <div class="user-actions">
        <?php if($user): ?>
            Bonjour, <?= htmlspecialchars($user['prenom']) ?> |
            <a href="<?= BASE_URL ?>auth/logout">Déconnexion</a>
        <?php else: ?>
            <a href="<?= BASE_URL ?>auth/login">Connexion  |</a>
            <a href="<?= BASE_URL ?>auth/register">S'inscrire</a>
        <?php endif; ?>
    </div>
</header>
<div class="overlay" id="overlay"></div>
<main>
