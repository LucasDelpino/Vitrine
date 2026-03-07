<?php
session_start();

ini_set('display_errors',1);
error_reporting(E_ALL);

// Définition de l'URL de base
define('BASE_URL','/');  // si DocumentRoot = Nelegance/public

require_once '../config/database.php';
require_once '../core/Router.php';

spl_autoload_register(function($class){
    $paths = [
        "../app/controllers/$class.php",
        "../app/models/$class.php"
    ];
    foreach($paths as $file){
        if(file_exists($file)){
            require_once $file;
            return;
        }
    }
});

$url = $_GET['url'] ?? '';
$router = new Router();
$router->route($url);
?>