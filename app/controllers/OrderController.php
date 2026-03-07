<?php
require_once __DIR__ . '/../models/Order.php';

class OrderController {

    public function index() {
        $orderModel = new Order();
        $orders = $orderModel->getAll();

        // On envoie $orders à la vue
        require __DIR__ . '/../views/admin/orders.php';
    }

    public function updateStatus() {
    if(isset($_POST['order_id'], $_POST['status'])) {
        $orderModel = new Order();
        $orderModel->updateStatus($_POST['order_id'], $_POST['status']);
        if(!$succes){
            die("Erreur lors de la mise à jour du statut");
        }
    }
    
    header('Location: /admin/orders');
    var_dump($_POST);
    exit();
    }

}
?>
