<!doctype html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script>
  </head>
  <body>

<?php
include_once('back/bdd.php');

$bdd = connexionbdd();

$stats = get_stat_station($_GET['id']);

$time = [];
$places_libres = [];
$i = 0;

foreach($stats as $key => $value)
{
	//echo strtotime($value['date']).';'.$value['places'].';'.$value['velos'].'<br>';
	$time[$i] = $value['date'];
	$places_libres[$i] = $value['places'];
	$i++;
}

$time = json_encode($time);
$places_libres = json_encode($places_libres);

$json_source = file_get_contents('http://api.citybik.es/v2/networks/velov');

$json_data = json_decode($json_source);

$i = 0;

while($json_data->{'network'}->{'stations'}[$i]->{'extra'}->{'uid'} != $_GET['id'])
{
	$i++;
}

echo $json_data->{'network'}->{'stations'}[$i]->{'name'};

echo '<br>';

echo '<canvas id="myChart" width="1500" height="800"></canvas>';

?>

<script type="text/javascript">

// Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
//var myNewChart = new Chart(ctx).PolarArea(data);


var data = {
    labels: <?php echo $time; ?>,
    datasets: [
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: <?php echo $places_libres; ?>
        }
    ]
};

var myLineChart = new Chart(ctx).Line(data, {});

</script>

</body>
</html>