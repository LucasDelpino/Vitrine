<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Connexion</h1>

<?php if(!empty($_SESSION['error'])): ?>
    <p style="color:red"><?= $_SESSION['error']; unset($_SESSION['error']); ?></p>
<?php endif; ?>

<form method="POST" action="<?= BASE_URL ?>auth/login">
    <input type="email" name="email" placeholder="Email" required><br>
    <input type="password" name="password" placeholder="Mot de passe" required><br>
    <button type="submit">Se connecter</button>
</form>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
