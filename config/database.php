<?php

class Database {

    public static function getConnection(){
        return new PDO( // host=localhost avant d'être mappé sur Docker //
            "mysql:host=db;dbname=bddnelegance;charset=utf8",
            "root",
            "root",
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }
}
?>