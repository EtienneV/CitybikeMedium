<?php

include_once('back/bdd.php');

$bdd = connexionbdd();

$req = $bdd->prepare('SELECT COUNT(*) FROM vues');
$req->execute();
$donnees = $req->fetch();
$req->closeCursor();

echo 'Nombre de vues totales: '.$donnees['COUNT(*)'].'<br>';

$req = $bdd->prepare('SELECT COUNT(*) FROM vues WHERE ip != "109.213.172.102"');
$req->execute();
$donnees = $req->fetch();
$req->closeCursor();

echo 'Nombre de vues extérieures: '.$donnees['COUNT(*)'];

