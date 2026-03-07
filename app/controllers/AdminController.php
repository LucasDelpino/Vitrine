<?php
require_once __DIR__ . '/../models/Product.php';



class AdminController {
    private $productModel;

    public function __construct() {
        if (!isset($_SESSION['user']) || $_SESSION['user']['roles'] !== 'admin') {
            header('Location: /auth/login');
            exit();
        }
        $this->productModel = new Product();
    }

    public function products($action = null, $id = null) {
    
        $product = new Product();

        // ➜ Ajouter
        if ($action === 'add') {

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                $name = trim($_POST['name']);
                $description = trim($_POST['description']);
                $price = floatval($_POST['price']);

                if (empty($name) || empty($price)) {
                    die("Données invalides");
                }

                $data = [
                    'name' => $_POST['name'],
                    'description' => $_POST['description'],
                    'price' => $_POST['price'],
                    
                ];
                
                $productId = $product->create($data);

                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                $uploadDir = __DIR__ . '/../../public/uploads/';

                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    if ($_FILES['images']['error'][$key] === 0) {
                        $originalName = $_FILES['images']['name'][$key];
                        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                        if (in_array($extension, $allowedExtensions)) {
                            $newImageName = uniqid('product_', true) . '.' . $extension;
                            move_uploaded_file($tmpName, $uploadDir . $newImageName);

                        
                            $stmtImage = Database::getConnection()->prepare("INSERT INTO product_images (product_id, image) VALUES (?, ?)");
                            $stmtImage->execute([$productId, $newImageName]);
                        }
                    }
                }
                

                header("Location: " . BASE_URL . "admin/products");
                exit();
            }

            require '../app/views/admin/add_product.php';
            return;
        }

        //-Edit
        if ($action === 'edit' && $id){
            $productData = $product->getById($id);

            $images = $product->getImages($id);
            if (!$images) $images = [];

            if($_SERVER['REQUEST_METHOD']=== 'POST'){

                $data = [
                    'name' => $_POST['name'],
                    'description' => $_POST['description'],
                    'price' => $_POST['price'],
                    
                ];

                $product->update($id,$data);

                if (!empty($_POST['delete_images'])) {
                    foreach ($_POST['delete_images'] as $imageId) {
                        // Récupérer le nom du fichier
                        $stmt = Database::getConnection()->prepare("SELECT image FROM product_images WHERE id = ? AND product_id = ?");
                        $stmt->execute([$imageId, $id]);
                        $img = $stmt->fetch(PDO::FETCH_ASSOC);
                        if ($img) {
                            $filePath = __DIR__ . '/../../public/uploads/' . $img['image'];
                            if (file_exists($filePath)) unlink($filePath);
                            // Supprimer en base
                            $stmtDel = Database::getConnection()->prepare("DELETE FROM product_images WHERE id = ?");
                            $stmtDel->execute([$imageId]);
                        }
                    }
                }

                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                $uploadDir = __DIR__ . '/../../public/uploads/';

                if (!empty($_FILES['images']['tmp_name'])) {
                    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                        if ($_FILES['images']['error'][$key] === 0) {
                            
                            $originalName = $_FILES['images']['name'][$key];
                            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                            if (in_array($extension, $allowedExtensions)) {
                                $newImageName = uniqid('product_', true) . '.' . $extension;
                                move_uploaded_file($tmpName, $uploadDir . $newImageName);

                                $stmtImage = Database::getConnection()->prepare("INSERT INTO product_images (product_id, image) VALUES (?, ?)");
                                $stmtImage->execute([$id, $newImageName]);
                            }
                        }
                    }
                }



                header("Location: /admin/products");
                exit();
            }

            $productData = $product->getById($id);

            require '../app/views/admin/edit_product.php';
            return;
        }

        // ➜ Supprimer
        if ($action === 'delete' && $id) {
            $product->delete($id);
            header("Location: " . BASE_URL . "admin/products");
            exit();
        }

        // ➜ Liste produits
        $products = $product->getAll();
        require '../app/views/admin/products.php';
    }

    public function orders() {
        $orderModel = new Order();
        $orders = $orderModel->getAll();
        require __DIR__ . '/../views/admin/orders.php';
    }

    public function addProduct() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
                'name' => trim($_POST['name'] ?? ''),
                'description' => trim($_POST['description'] ?? ''),
                'price' => floatval($_POST['price'] ?? 0),
                
            ];

            $product = new Product();
            $product->create($data); // <-- Maintenant la méthode existe

            header("Location: /admin/products");
            exit();
        }

    require __DIR__ . '/../views/admin/add_product.php';
    }


    public function editProduct($id) {
        $productData = $this->productModel->find($id);
        if (!$productData) { echo "Produit introuvable"; exit();}

        $images = $this->productModel->getImages($id);
        if(!$images) $images = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = ['name'=>$_POST['name'],'description'=>$_POST['description'],'price'=>floatval($_POST['price'])];
            $this->productModel->update($id,$data);

            // 2️⃣ Supprimer les images cochées
            if(!empty($_POST['delete_images'])) {
                foreach($_POST['delete_images'] as $imageId) {
                    // Supprimer le fichier physique
                    $img = $this->productModel->getImageById($imageId);
                    if($img && file_exists(__DIR__ . '/../../public/uploads/' . $img['image'])) {
                        unlink(__DIR__ . '/../../public/uploads/' . $img['image']);
                    }
                    // Supprimer de la base
                    $stmt = Database::getConnection()->prepare("DELETE FROM product_images WHERE id = ?");
                    $stmt->execute([$imageId]);
                }
            }

            // 3️⃣ Ajouter les nouvelles images
            if(!empty($_FILES['images']['tmp_name'])) {
                $allowedExtensions = ['jpg','jpeg','png','webp'];
                $uploadDir = __DIR__ . '/../../public/uploads/';
                foreach($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    if($_FILES['images']['error'][$key] === 0) {
                        $originalName = $_FILES['images']['name'][$key];
                        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                        if(in_array($ext, $allowedExtensions)) {
                            $newImageName = uniqid('product_', true) . '.' . $ext;
                            move_uploaded_file($tmpName, $uploadDir . $newImageName);

                            $stmt = Database::getConnection()->prepare("INSERT INTO product_images (product_id, image) VALUES (?, ?)");
                            $stmt->execute([$id, $newImageName]);
                        }
                    }
                }
            }

            header('Location: /admin/products'); 
            exit();
        }
        require __DIR__ . '/../views/admin/edit_product.php';
    }

    public function deleteProduct($id) {

        $product = new Product();

        if ($product->delete($id)) {
            header("Location: /admin/products");
            exit();
        } else {
            die("Erreur suppression produit");
        }
    }

    public function updateOrderStatus() {
        if(isset($_POST['order_id'], $_POST['status'])) {
            $orderModel = new Order();
            $orderId = $_POST['order_id'];
            $newStatus = $_POST['status'];
            $orderModel->updateStatus($_POST['order_id'], $_POST['status']);

            if($newStatus === 'shipped') {
                $order = $orderModel->getById('$orderId');
                $items = $orderModel->getItems('$orderId');

                $this->sendShipmentEmail($order, $items);
            }
        }
        header('Location: /admin/orders');
        exit();
    }

    
    }


    


?>