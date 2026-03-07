<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Modifier le produit</h1>

<form method="POST" enctype="multipart/form-data" action="/admin/products/edit/<?= $productData['id'] ?>">

    <label>Nom:<br>
        <input type="text" name="name" value="<?= htmlspecialchars($productData['name']) ?>" required>
    </label><br><br>

    <label>Description:<br>
        <textarea name="description" required><?= htmlspecialchars($productData['description']) ?></textarea>
    </label><br><br>

    <label>Prix (€):<br>
        <input type="number" step="0.01" name="price" value="<?= htmlspecialchars($productData['price']) ?>" required>
    </label><br><br>

    <label>Images existantes :</label><br>
    <div class="existing-images">
        <?php if(!empty($images) && is_array($images)): ?>
            <?php foreach ($images as $image): ?>
                <div style="display:inline-block; margin:5px; text-align:center;">
                    <img src="/uploads/<?= htmlspecialchars($image['image']) ?>" width="100" style="border:1px solid #ccc; margin-bottom:5px;"><br>
                    <label>
                        <input type="checkbox" name="delete_images[]" value="<?= $image['id'] ?>">
                        Supprimer
                    </label>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>Aucune image pour ce produit.</p>
        <?php endif; ?>
    </div><br>

    <label>Ajouter de nouvelles images :<br>
        <input type="file" name="images[]" accept="image/*" multiple>
    </label><br><br>

    <!-- 🔹 Boutons -->
    <button type="submit" name="update_product" style="background-color:#E6C068;color:#fff;padding:8px 15px;border-radius:4px;">
        Mettre à jour
    </button>

    <button type="submit" name="delete_selected_images" style="background-color:#d9534f;color:#fff;padding:8px 15px;border-radius:4px; margin-left:10px;">
        Supprimer les images sélectionnées
    </button>

</form>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
