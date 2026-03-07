<?php require __DIR__ . '/../layouts/header.php'; ?>

<h1>Mon Panier</h1>

<?php if(!$cartItems): ?>
    <p>Votre panier est vide.</p>
<?php else: ?>
    <table border="1" cellpadding="10">
        <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Action</th>
        </tr>
        <?php $grandTotal = 0; ?>
        <?php foreach($cartItems as $item): ?>
            <?php $total = $item['price'] * $item['quantity']; ?>
            <?php $grandTotal += $total; ?>
            <tr>
                <td><?= htmlspecialchars($item['name']) ?></td>
                <td><?= number_format($item['price'],2) ?> €</td>
                <td><?= $item['quantity'] ?></td>
                <td><?= number_format($total,2) ?> €</td>
                <td><a href="/cart/remove/<?= $item['product_id'] ?>">Supprimer</a></td>
            </tr>
        <?php endforeach; ?>
        <tr>
            <td colspan="3"><strong>Total :</strong></td>
            <td colspan="2"><strong><?= number_format($grandTotal,2) ?> €</strong></td>
        </tr>
    </table>
    <br>
    <a href="/cart/checkout">Valider la commande</a>
<?php endif; ?>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
