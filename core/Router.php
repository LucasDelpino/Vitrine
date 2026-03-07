<?php
class Router {
    public function route($url) {
        $url = trim($url, '/');          // retire slash en début/fin
        $segments = explode('/', $url);  // explode sur '/'

        $controllerName = !empty($segments[0]) ? ucfirst($segments[0]) . 'Controller' : 'ShopController';
        $method = $segments[1] ?? 'index';
        $param1 = $segments[2] ?? null;
        $param2 = $segments[3] ?? null;

        if (!class_exists($controllerName)) die("404 - Controller $controllerName introuvable");
        $controller = new $controllerName();

        if (!method_exists($controller, $method)) die("404 - Méthode $method introuvable");

        // Appelle la méthode avec 0, 1 ou 2 paramètres
        if ($param2 !== null) {
            $controller->$method($param1, $param2);
        } elseif ($param1 !== null) {
            $controller->$method($param1);
        } else {
            $controller->$method();
        }
    }
}
?>