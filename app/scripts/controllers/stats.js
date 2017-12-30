'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('StatsCtrl', function ($scope, $http) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        $scope.labels = ["Likes", "Dislikes"];
    
    $scope.getCollectionList = function() {
        $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/collection?pageSize=20&pageNumber=1',
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            },
            params: {
                pageSize: 20,
                pageNumber: 1
            }
        }).then(
            function(response) {
                $scope.collectionsList = response.data.data;
            },
            function(response) {
                alert("error")
            });
    }

    $scope.getCollectionNotebooks = function(selectedCollection) {
        $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/notebook?pageSize=20&pageNumber=1',
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            },
            params: {
                pageSize: 20,
                pageNumber: 1,
                "filter": [{
                    "fieldName": "collection",
                    "operator": "in",
                    "value": selectedCollection /*aqui va el id de la colección a consultar*/
                }],
            }
        }).then(
            function(response) {
                $scope.collectionNotebooks = response.data.data;
                console.log($scope.collectionNotebooks)
               /* console.log($("#doughnut").prop("chart-data"))*/
                for(var i=0; i<$scope.collectionNotebooks.length; i++){
                    $scope.dataLikes = [response.data.data[i].like, response.data.data[i].dislike];
                    $scope.collectionNotebooks[i].dataLikes = $scope.dataLikes;
                    $scope.dataGender = [response.data.data[i].likedToMale, response.data.data[i].likedToFemale]
                    $scope.collectionNotebooks[i].dataGender = $scope.dataGender;
                    $scope.dataAges = [response.data.data[i].userAgeA, response.data.data[i].userAgeB]
                    $scope.collectionNotebooks[i].dataAges = $scope.dataAges;
                      console.log($scope.collectionNotebooks[i].dataLikes)
                }
                console.log($scope.collectionNotebooks)
            },
            function(response) {
                alert("error")
            }
        );
    }

    $scope.getCollectionList();

    $scope.setCollection = function(selection) {
        if (selection == "Colecciones") {
            return false;
        } else {
            var selectedCollection = selection.toString();
            var prueba = $(".selectpicker option:selected").text()
            $(".title").text(prueba)
            $scope.getCollectionNotebooks(selectedCollection);
        }
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    $scope.export = function(e){
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
        e.preventDefault();
    }

  });
