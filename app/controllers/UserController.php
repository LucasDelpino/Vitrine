<?php

class UserController {

    public function dashboard() {
        if (!isset($_SESSION['user'])) {
            header('Location: /auth/login');
            exit();
        }
        $user = $_SESSION['user'];
        require __DIR__ . '/../views/user/dashboard.php';
    }
}
?>