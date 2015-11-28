<?php

include_once('bdd.php');

$bdd = connexionbdd();

$req = $bdd->prepare('INSERT INTO vues(date, ip) VALUES(NOW(), ?)');
$req->execute(array($_SERVER["REMOTE_ADDR"]));