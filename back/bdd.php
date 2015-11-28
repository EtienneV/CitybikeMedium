<?php

function connexionbdd()
{
	// On se connecte à la base de données
	try
	{
	  $bdd = new PDO('mysql:host=xxxxx;dbname=xxxxx', 'xxxxx', 'xxxxx');
	  $bdd->exec("SET CHARACTER SET utf8");
	  $bdd->exec('SET lc_time_names = "fr_FR"');  
	  return $bdd;
	}
	catch (Exception $e)
	{
	    die('Erreur : ' . $e->getMessage());
	}
}

function enregistrer_velov($id_velov, $places, $velos)
{
	global $bdd;

	$req = $bdd->prepare('INSERT INTO historique(date, numero, places, velos) VALUES(NOW(), ?, ?, ?)');
    $req->execute(array($id_velov, $places, $velos));
}

function get_stat_station($id_station)
{
	global $bdd;

	$i = 0;

	$req = $bdd->prepare('SELECT * FROM historique WHERE numero = ?');
    $req->execute(array($id_station));

	while($donnees = $req->fetch()) 
    {
    	$data[$i] = $donnees;
    	$i++;
    }
    $req->closeCursor();

    if(isset($data))
	{
		return $data;
	}
	else
	{
		return 0;
	}
}

function get_last()
{
	global $bdd;

	$i = 0;

	$req = $bdd->prepare('SELECT * FROM historique ORDER BY id DESC LIMIT 0, 347');
    $req->execute(array($id_station));

	while($donnees = $req->fetch()) 
    {
    	$data[$i] = $donnees;
    	$i++;
    }
    $req->closeCursor();

    if(isset($data))
	{
		return array_reverse($data);
	}
	else
	{
		return 0;
	}
}