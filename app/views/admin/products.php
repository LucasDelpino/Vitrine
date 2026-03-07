<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Liste des produits</h1>
<a href="products/add" style="background-color:#E6C068;color:#fff;padding:8px 15px;border-radius:4px;">Ajouter un produit</a>

<table border="1" cellpadding="10" cellspacing="0" style="margin-top:20px;width:100%;">
    <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Prix</th>
        <th>Images</th>
        <th>Actions</th>
    </tr>
    <?php foreach($products as $p): ?>
    <tr>
        <td><?= $p['id'] ?></td>
        <td><?= htmlspecialchars($p['name']) ?></td>
        <td><?= htmlspecialchars($p['description']) ?></td>
        <td><?= number_format($p['price'],2) ?> €</td>
        <td>
            <?php 
            // Récupère les images liées à ce produit
            $images = $product->getImages($p['id']); 
            foreach($images as $img): 
            ?>
                <img src="/uploads/<?= htmlspecialchars($img['image']) ?>" width="80" style="margin:2px; border:1px solid #ccc;">
            <?php endforeach; ?>
        </td>
        <td>
            <a href="products/edit/<?= $p['id'] ?>" >Modifier |</a>
            <a href="products/delete/<?= $p['id'] ?>" onclick="return confirm('Supprimer ce produit ?')">Supprimer</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
