<?php
require_once __DIR__ . '/../models/Product.php';

class ProductController {

    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    public function index() {
        $products = $this->productModel->getAll();
        require __DIR__ . '/../views/shop/index.php';
    }

    public function show($id = null) {
        if (!$id) die("Produit introuvable");
        $product = $this->productModel->find($id);
        require __DIR__ . '/../views/shop/product.php';
    }
}
?>
