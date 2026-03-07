<?php
require_once __DIR__ . '/../../config/database.php';

class Product {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection(); // Assurez-vous que Database::getConnection() retourne PDO
    }

    // Récupérer tous les produits
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM products");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 🔹 Ajouter un produit
    public function create($data) {
        $stmt = $this->pdo->prepare("INSERT INTO products (name, description, price) VALUES (:name, :description, :price)");
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->execute();
        return $this->pdo->lastInsertId();
    }

    // Récupérer un produit par id
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Mettre à jour un produit
    public function update($id, $data){
        $stmt = $this->pdo->prepare("UPDATE products SET name = :name, description = :description, price = :price WHERE id = :id");

        $params = [
            ':name' => $data['name'] ?? '',
            ':description' => $data['description'] ?? '',
            ':price' => $data['price']?? 0,
            ':id' => $id
        ];
        $stmt->execute($params);
        return true;
    }


    // Supprimer un produit
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if (!$stmt->execute()) {
            print_r($stmt->errorInfo());
            die();
        }

        return true;
    }

    public function getImages($productId) {
        $stmt = $this->pdo->prepare("SELECT * FROM product_images WHERE product_id = ?");
        $stmt->execute([$productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


}
?>