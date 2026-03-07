<?php
require_once __DIR__ . '/../models/Cart.php';
require_once __DIR__ . '/../models/Product.php';

class CartController {
    private $cartModel;
    private $productModel;

    public function __construct() {
        $this->cartModel = new Cart();
        $this->productModel = new Product();
    }

    // Afficher le panier
    public function index() {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth/login');
            exit();
        }
        $userId = $_SESSION['user']['id'];
        $cartItems = $this->cartModel->getCart($userId);
        require __DIR__ . '/../views/shop/cart.php';
    }

    // Ajouter un produit au panier
    public function add($productId) {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth/login');
            exit();
        }
        $userId = $_SESSION['user']['id'];
        $this->cartModel->add($userId, $productId);
        header('Location: /cart');
        exit();
    }

    // Supprimer un produit du panier
    public function remove($productId) {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth/login');
            exit();
        }
        $userId = $_SESSION['user']['id'];
        $this->cartModel->remove($userId, $productId);
        header('Location: /cart');
        exit();
    }

    // Checkout
    public function checkout() {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth/login');
            exit();
        }
        $userId = $_SESSION['user']['id'];
        $items = $this->cartModel->getCart($userId);
        if (!$items) {
            header('Location: /cart');
            exit();
        }

        // Calcul total
        $total = 0;
        foreach($items as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        // Créer la commande
        $db = (new Database())->getConnection();
        $db->beginTransaction();

        try {
            $saleReference = 'VENTE-' . date('Ymd') . '-' . random_int(1000,9999);
            $status = 'pending';

            $stmt = $db->prepare("INSERT INTO orders (sale_reference, user_id, total, status, created_at) VALUES (?, ?, ?,?, NOW())");
            $stmt->execute([$saleReference, $userId, $total, $status]);
            $orderId = $db->lastInsertId();

            $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            foreach($items as $item) {
                $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);
            }

            // Vider le panier
            $this->cartModel->clear($userId);

            $db->commit();
            header('Location: /user/dashboard');
            exit();

        } catch (Exception $e) {
            $db->rollBack();
            die("Erreur lors du checkout : " . $e->getMessage());
        }
    }
}
?>