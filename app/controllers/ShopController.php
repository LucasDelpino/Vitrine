<?php
require_once '../app/models/Product.php';

class ShopController {

    private $productModel;

    public function __construct(){
        $this->productModel = new Product();
    }

    public function index() {
        $productModel = new Product();
        $products = $productModel->getAll();

        foreach ($products as &$p) {
            $p['images'] = $productModel->getImages($p['id']);
        }

        require __DIR__ . '/../views/shop/index.php';
    }

}
?>