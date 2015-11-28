angular.module('app', ['components'])

.controller('ListeStations', function($scope, $locale, $http) {
  $scope.data = {};
  $scope.data.listeStations = [];

  $scope.data.jsonvelov = 'a';

  var nb_bornes = [];

  function getQuerystring(key, default_)
  {
    if (default_==null) default_=""; 
    key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if(qs == null)
      return default_;
    else
      return qs[1];
  }

  $scope.data.selectionStation = function (id, uid) {
    $http({
      method: 'GET',
      url: 'http://etiennevilledieu.fr/velov/back/api_get_station.php?uid='+uid
    }).then(function successCallback(response) {

        angular.forEach($scope.data.listeStations, function(value, key) {
          $scope.data.listeStations[key].active = '';
        });

        $scope.data.listeStations[id].active = 'active';
        $scope.data.stationCourante.nom = $scope.data.listeStations[id].nom;

        for (var i = 0; i < response.data.velos.length; i++) {
          nb_bornes[i] = parseInt(response.data.velos[i]) + parseInt(response.data.places[i]);
        };

        var data = {
            labels: response.data.date,
            datasets: [
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: response.data.velos
                },
                {
                  label: "My First dataset",
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: nb_bornes
                }
            ]
        };

        var myLineChart = new Chart(ctx).Line(data, {pointHitDetectionRadius : 1, pointDot : false});

        myLineChart.update();

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

  $http({
    method: 'GET',
    url: 'http://api.citybik.es/v2/networks/velov'
  }).then(function successCallback(response) {
      $scope.data.jsonvelov = response.data;
      console.log($scope.data.jsonvelov);

      $scope.data.listeStations = [];

      $scope.data.stationCourante = {};
      $scope.data.stationCourante.nom = response.data.network.stations[0].name;
      $scope.data.stationCourante.uid = response.data.network.stations[0].uid;

      angular.forEach(response.data.network.stations, function(value, key) {
        this.push({
          nom : value.name,
          uid : value.extra.uid,
          active : ''
        });
      }, $scope.data.listeStations);

      $scope.data.listeStations[0].active = 'active';

      $http({
        method: 'GET',
        url: 'http://etiennevilledieu.fr/velov/back/api_get_station.php?uid='+8009
      }).then(function successCallback(response) {

          for (var i = response.data.velos.length - 1; i >= 0; i--) {
            nb_bornes[i] = parseInt(response.data.velos[i]) + parseInt(response.data.places[i]);

          };

          var data = {
              labels: response.data.date,
              datasets: [
                  {
                      label: "My Second dataset",
                      fillColor: "rgba(151,187,205,0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(151,187,205,1)",
                      data: response.data.velos
                  },
                  {
                      label: "My First dataset",
                      fillColor: "rgba(220,220,220,0.2)",
                      strokeColor: "rgba(220,220,220,1)",
                      pointColor: "rgba(220,220,220,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(220,220,220,1)",
                      data: nb_bornes
                  }
              ]
          };

        var myLineChart = new Chart(ctx).Line(data, {pointHitDetectionRadius : 1, pointDot : false});

        var uid_station = getQuerystring('uid');

        if(uid_station != '')
        {
          //console.log(uid_station);

          var j = 0;
          var id_station = 0;

          angular.forEach($scope.data.listeStations, function(value, key) {
            if(value.uid == uid_station) 
            {
              id_station = j;
            }
            j++;
          });

          console.log(id_station);

          $scope.data.selectionStation(id_station, uid_station);
        }

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });


    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  // Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  //var myNewChart = new Chart(ctx).PolarArea(data);

  $http({
    method: 'GET',
    url: 'http://etiennevilledieu.fr/velov/back/ajout_vue.php'
  }).then(function successCallback(response) {}, function errorCallback(response) {});

  

})

.controller('MapController', function($scope, $locale, $http) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZXRpZW5uZXYiLCJhIjoiY2lnaWYycGFiMDAwOHQzbHRwaTloa2szOCJ9.4NR1CkCihYs1-SVZU7zuEg';
      var map = L.mapbox.map('map', 'mapbox.pirates')
        .setView([45.763753, 4.862006], 14);

      var myLayer = L.mapbox.featureLayer().addTo(map);

      /*var geojson = {
          type: 'FeatureCollection',
          features: []};*/

      var geojson = [];

      $http({
        method: 'GET',
        url: 'http://api.citybik.es/v2/networks/velov'
      }).then(function successCallback(response) {
          
          angular.forEach(response.data.network.stations, function(value, key) {

            geojson.push({
              type: 'Feature',
              properties: {
                  title: value.name,
                  'marker-color': '#f86767',
                  'marker-size': 'large',
                  'marker-symbol': 'bicycle',
                  url: 'http://etiennevilledieu.fr/velov/graph.html?uid='+value.extra.uid
              },
              geometry: {
                  type: 'Point',
                  coordinates: [value.longitude, value.latitude]
              }
            });
          });

          // Add custom popups to each using our custom feature properties
            myLayer.on('layeradd', function(e) {
                var marker = e.layer,
                    feature = marker.feature;

                // Create custom popup content
                var popupContent =  '<div>'+'<a href="'+feature.properties.url+'">'+feature.properties.title+'</a>'+'</div>';//'<a target="_blank" class="popup" href="' + feature.properties.url + '">TEST' + '</a>';

                // http://leafletjs.com/reference.html#popup
                marker.bindPopup(popupContent,{
                    closeButton: false,
                    minWidth: 320
                });
            });

          // Pass features and a custom factory function to the map
          myLayer.setGeoJSON(geojson);
          
          /*myLayer.on('click', function(e) {
              window.open(e.layer.feature.properties.url);
          });*/

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });   

        $http({
          method: 'GET',
          url: 'http://etiennevilledieu.fr/velov/back/ajout_vue.php'
        }).then(function successCallback(response) {}, function errorCallback(response) {});  
})

.controller('TempsReelController', function($scope, $locale, $http) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZXRpZW5uZXYiLCJhIjoiY2lnaWYycGFiMDAwOHQzbHRwaTloa2szOCJ9.4NR1CkCihYs1-SVZU7zuEg';
      var map = L.mapbox.map('map', 'mapbox.pirates')
        .setView([45.763753, 4.862006], 14);

      var myLayer = L.mapbox.featureLayer().addTo(map);

      var geojson = [];

      var taille_progressbar = 0;

      var t = 0;
      var i = 0;
      var j = 0;
      var data_precedentes = [];
      var marker_color = 'DEB162';
      var commentaire_station = '';

      $http({
        method: 'GET',
        url: 'http://etiennevilledieu.fr/velov/back/api_get_last.php'
      }).then(function successCallback(response) {

        angular.forEach(response.data, function(value, key) {
          data_precedentes.push(value.velos);
        });

      }, function errorCallback(response) {});  

      var miseAJour = function () {

      $http({
        method: 'GET',
        url: 'http://api.citybik.es/v2/networks/velov'
      }).then(function successCallback(response) {
            i = 0;
            geojson = [];
            angular.forEach(response.data.network.stations, function(value, key) {

              /*if(t == 0) // Si c'est le premières données qu'on récupère
              {
                data_precedentes.push(value.free_bikes);
                t = 1;
              }*/

              if(data_precedentes[i] == value.free_bikes) // Si le nb n'a pas changé
              {
                marker_color = '51626F'; 
                commentaire_station = '';
              }
              else if(data_precedentes[i] >= value.free_bikes) // Si on a moins de vélos
              {
                marker_color = 'DE394C'; 
                commentaire_station = (value.free_bikes-data_precedentes[i]);
                commentaire_station += ' vélos depuis la dernière mise à jour';
              }
              else if(data_precedentes[i] <= value.free_bikes) // Si on a plus de vélos
              {
                marker_color = '08CC31';
                commentaire_station = '+ ';
                commentaire_station += (value.free_bikes-data_precedentes[i]);
                commentaire_station += ' vélos depuis la dernière mise à jour';
              }

              
              geojson.push({
                type: 'Feature',
                properties: {
                    title: value.name,
                    'marker-color': marker_color,
                    'marker-size': 'large',
                    'marker-symbol': 'bicycle',
                    url: 'http://etiennevilledieu.fr/velov/graph.html?uid='+value.extra.uid,
                    velos: value.free_bikes,
                    emplacements: value.empty_slots,
                    commentaire: commentaire_station
                },
                geometry: {
                    type: 'Point',
                    coordinates: [value.longitude, value.latitude]
                }
              });

              data_precedentes[i] = value.free_bikes;
              i++;
            });

          // Pass features and a custom factory function to the map
          myLayer.clearLayers();
          // Add custom popups to each using our custom feature properties
            myLayer.on('layeradd', function(e) {
                var marker = e.layer,
                    feature = marker.feature;

                // Create custom popup content
                var popupContent =  '<div>'+'<a href="'+feature.properties.url+'">'+feature.properties.title+'</a><br>'+
                ''+feature.properties.velos+' vélos disponibles<br>'+
                feature.properties.emplacements+' emplacements disponibles<br>'+
                feature.properties.commentaire+'<br>'+
                '<a href="'+feature.properties.url+'">Voir les statistiques de cette station</a>'+'</div>';//'<a target="_blank" class="popup" href="' + feature.properties.url + '">TEST' + '</a>';

                // http://leafletjs.com/reference.html#popup
                marker.bindPopup(popupContent,{
                    closeButton: false,
                    minWidth: 320
                });
            });
          myLayer.setGeoJSON(geojson);

          taille_progressbar = 0;

          $('.progresstime').css('width', taille_progressbar+'%');

        }, function errorCallback(response) {});     
      };

      miseAJour();

      setInterval(miseAJour, 240000);

      setInterval(function maj_pb() {
        if(taille_progressbar < 100) taille_progressbar = taille_progressbar + 0.042;
        else taille_progressbar = 0;

        $('.progresstime').css('width', taille_progressbar+'%');
      }, 100);

      $http({
        method: 'GET',
        url: 'http://etiennevilledieu.fr/velov/back/ajout_vue.php'
      }).then(function successCallback(response) {}, function errorCallback(response) {});
})

.controller('TotalController', function($scope, $locale, $http) {
  $scope.data = {};
  $scope.data.listeStations = [];

  var total_Velos = [];
  var dates = [];

  var t = 0;

  $http({
    method: 'GET',
    url: 'http://api.citybik.es/v2/networks/velov'
  }).then(function successCallback(response) {

    angular.forEach(response.data.network.stations, function(value, key) {

      this.push({
        uid : value.extra.uid
      });

    }, $scope.data.listeStations);

    for (var j = 0 ; j < $scope.data.listeStations.length ; j++) {
      $http({
        method: 'GET',
        url: 'http://etiennevilledieu.fr/velov/back/api_get_station.php?uid='+$scope.data.listeStations[j].uid
      }).then(function successCallback(response) {

        for (var i = 0; i < response.data.velos.length; i++) { // Pour chaque date, on l'ajoute au total
          if (t == 0) {
            total_Velos.push(parseInt(response.data.velos[i]));  // Si c'est le premier passage
            dates.push(response.data.date[i]);
          }
          else total_Velos[i] += parseInt(response.data.velos[i]);
        };

        t++;

        if(j == $scope.data.listeStations.length)
        {
          var data = {
              labels: dates,
              datasets: [
                  {
                      label: "My Second dataset",
                      fillColor: "rgba(151,187,205,0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(151,187,205,1)",
                      data: total_Velos
                  }
              ]
          };

          var ctx = document.getElementById("myChart").getContext("2d");

          Chart.defaults.global.animation = false;

          var myLineChart = new Chart(ctx).Line(data, {pointHitDetectionRadius : 1, pointDot : false});

          Chart.defaults.global.animation = false;
        }

      }, function errorCallback(response) {});
    };

    

  }, function errorCallback(response) {});

});