<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Ajouter un produit</h1>

<form method="POST" enctype="multipart/form-data">

    <label>Nom:<br>
        <input type="text" name="name" required>
    </label><br>

    <label>Description:<br>
        <textarea name="description" required></textarea>
    </label><br>

    <label>Prix (€):<br>
        <input type="number" step="0.01" name="price" required>
    </label><br>

    <label>Images du produit:<br>
        <input type="file" name="images[]" accept="image/*" multiple required><br>
        <input type="file" name="images[]" accept="image/*" multiple><br>
        <input type="file" name="images[]" accept="image/*" multiple><br>
        <input type="file" name="images[]" accept="image/*" multiple><br>
        <input type="file" name="images[]" accept="image/*" multiple><br>
    </label><br><br>

    <button type="submit" style="background-color:#E6C068;color:#fff;padding:8px 15px;border-radius:4px;">
        Ajouter
    </button>

</form>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
