<?php
require_once '../config/database.php';

class User {

    private $pdo;

    public function __construct(){
        $this->pdo = Database::getConnection();
    }

    public function findByEmail($email){
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email=?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function create($data){
        $stmt = $this->pdo->prepare("
            INSERT INTO users (nom,prenom,email,password,roles)
            VALUES (?,?,?,?,?)
        ");
        $stmt->execute([
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['password'],
            $data['roles']
        ]);
    }
}
?>