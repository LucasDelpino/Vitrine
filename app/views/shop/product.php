<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1><?= htmlspecialchars($product['name']) ?></h1>
<p><?= htmlspecialchars($product['description']) ?></p>
<p>Prix : <?= htmlspecialchars($product['price']) ?> €</p>

<a href="/shop">Retour à la boutique</a>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
