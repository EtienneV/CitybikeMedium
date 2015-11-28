<?php
include_once('bdd.php');

$bdd = connexionbdd();


$json_source = file_get_contents('http://api.citybik.es/v2/networks/velov');

$json_data = json_decode($json_source);

echo $json_data->{'network'}->{'stations'}[1]->{'name'};

foreach ($json_data->{'network'}->{'stations'} as $key => $value) {
	echo $value->{'name'}.'<br>';
	enregistrer_velov($value->{'extra'}->{'uid'}, $value->{'empty_slots'}, $value->{'free_bikes'});
}
