<?php
require_once __DIR__ . '/../../config/database.php';

class Cart {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    // Ajouter un produit au panier
    public function add($userId, $productId, $quantity = 1) {
        $stmt = $this->db->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        $item = $stmt->fetch();

        if ($item) {
            $stmt = $this->db->prepare("UPDATE cart SET quantity = quantity + ? WHERE id = ?");
            $stmt->execute([$quantity, $item['id']]);
        } else {
            $stmt = $this->db->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $productId, $quantity]);
        }
    }

    // Supprimer un produit du panier
    public function remove($userId, $productId) {
        $stmt = $this->db->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
    }

    // Récupérer le panier complet
    public function getCart($userId) {
        $stmt = $this->db->prepare("
            SELECT c.product_id, c.quantity, p.name, p.price
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    // Vider le panier après checkout
    public function clear($userId) {
        $stmt = $this->db->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->execute([$userId]);
    }
}
?>
