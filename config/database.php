<?php

class Database {

    public static function getConnection(){
        return new PDO(
            "mysql:host=localhost;dbname=bddnelegance;charset=utf8",
            "root",
            "root",
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
}
?>