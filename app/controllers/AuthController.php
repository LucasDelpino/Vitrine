<?php
require_once '../app/models/User.php';

class AuthController {

    private $userModel;

    public function __construct(){
        $this->userModel = new User();
    }

    public function login(){

        if($_SERVER['REQUEST_METHOD']==='POST'){

            $user = $this->userModel->findByEmail($_POST['email']);

            if($user && password_verify($_POST['password'],$user['password'])){
                $_SESSION['user']=$user;
                header("Location: /shop");
                exit;
            }

            $_SESSION['error']="Identifiants incorrects";
            header("Location: /auth/login");
            exit;
        }

        require '../app/views/auth/login.php';
    }

    public function register(){

        if($_SERVER['REQUEST_METHOD']==='POST'){

            $data=[
                'nom'=>$_POST['nom'],
                'prenom'=>$_POST['prenom'],
                'email'=>$_POST['email'],
                'password'=>password_hash($_POST['password'],PASSWORD_DEFAULT),
                'roles'=>'user'
            ];

            $this->userModel->create($data);

            header("Location: /auth/login");
            exit;
        }

        require '../app/views/auth/register.php';
    }

    public function logout(){
        session_destroy();
        header("Location: /shop");
        exit;
    }
}
?>