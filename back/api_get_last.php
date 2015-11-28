<?php

include_once('bdd.php');

$bdd = connexionbdd();

$stats = get_last();

$i = 0;

$data = [];

foreach($stats as $key => $value)
{
	//$data[$value['date']] = $value['places'];

	$data['date'][$i] = $value['date'];
	$data['places'][$i] = $value['places'];
	$data['velos'][$i] = $value['velos'];

	$i++;
}

echo json_encode($stats);


