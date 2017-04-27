'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('AboutCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.dataUser = [];

    $scope.edad;
    $scope.mapa_lat;
    $scope.mapa_long;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          $scope.mapa_lat = position.coords.latitude;
          $scope.mapa_long = position.coords.longitude;

        });
      });
    }
    
    $(".genero img").click(function () {
      $scope.genero = $(this).data("genero");
      $(".genero img").css("transform", "scale(1)");
      //$(this).attr("src","img/dislike-btn.svg")
      $(this).css({
        transform: "scale(1.25)"
      });
    });


    $scope.viewData =  function(){
        $scope.dataUser.push({
          genero:$scope.genero,
          edad:$scope.edad,
          mapa_lat:$scope.mapa_lat,
          mapa_long:$scope.mapa_long
      });
    }


  });
