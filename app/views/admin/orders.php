<?php require __DIR__ . '/../layouts/header.php'; ?>

<h2>Liste des commandes</h2>

<table border="1" cellpadding="5">
    <tr>
        <th>ID Commande</th>
        <th>Utilisateur</th>
        <th>Email</th>
        <th>Date</th>
        <th>Produits</th>
        <th>Total</th>
        <th>Vente</th>
        <th>Statut</th>
    </tr>

<?php 
// ← PLACE ICI : avant la boucle foreach
$statusConfig = [
    'pending'   => ['label'=>'En attente', 'color'=>'orange'],
    'paid'      => ['label'=>'Payée', 'color'=>'blue'],
    'shipped'   => ['label'=>'Expédiée', 'color'=>'green'],
    'cancelled' => ['label'=>'Annulée', 'color'=>'red']
];
?>

<?php foreach($orders as $order): ?>
    <?php 
    // On récupère les infos de couleur et label pour le statut actuel
    $currentStatus = $statusConfig[$order['status']] ?? ['label'=>$order['status'],'color'=>'gray'];
    ?>
    <tr>
        <td><?= $order['id'] ?></td>
        <td><?= htmlspecialchars($order['prenom'] . ' ' . $order['nom']) ?></td>
        <td><?= htmlspecialchars($order['email']) ?></td>
        <td><?= $order['created_at'] ?></td>
        <td>
            <ul>
                <?php foreach($order['items'] as $item): ?>
                    <li><?= htmlspecialchars($item['name']) ?> x <?= $item['quantity'] ?></li>
                <?php endforeach; ?>
            </ul>
        </td>
        <td><?= array_sum(array_map(fn($i) => $i['quantity'] * $i['price'], $order['items'])) ?> €</td>
        <td><?= $order['sale_reference']; ?></td>
        <td>
            <span style="color:white;background:<?= $currentStatus['color'] ?>;padding:5px 10px;border-radius:5px;">
                <?= $currentStatus['label']; ?>
            </span>

            <!-- Formulaire pour changer le statut -->
            <form method="POST" action="/admin/updateOrderStatus" style="margin-top:5px;">
                <input type="hidden" name="order_id" value="<?= $order['id']; ?>">
                <select name="status" onchange="this.form.submit()">
                    <?php foreach($statusConfig as $key => $config): ?>
                        <option value="<?= $key ?>" <?= $order['status']==$key?'selected':'' ?>>
                            <?= $config['label'] ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </form>
        </td>
    </tr>
<?php endforeach; ?>

</table>

<?php require __DIR__ . '/../layouts/footer.php'; ?>
