<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Dashboard de <?= htmlspecialchars($user['prenom']) ?></h1>
<p>Bienvenue sur votre espace personnel !</p>
<a href="/shop">Aller à la boutique</a>

<?php require __DIR__ . '/../layouts/footer.php'; ?>


