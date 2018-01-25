'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('StatsCtrl', function ($scope, $http, $timeout) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        $scope.labels = ["Likes", "Dislikes"];
        $scope.black = [
            "panel1",
            "panel2"
          ]
    
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
                 $timeout(function() {
                    angular.element(".selectpicker option:eq(2)").prop("selected", true).trigger("change");
                }, 1);
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
                }
            },
            function(response) {
                alert("error")
            }
        );
    }

    $scope.getCollectionList();

    $scope.setCollection = function(selection) {
        if (selection == "Elige la colección para ver las estadisticas") {
            $(".btn-red").addClass("black").attr("disabled", true)
            $(".list-black").removeClass("hidden")
            $(".list-stats").addClass("hidden")
            $(".text-stat").text("Selecciona tu colección para poder ver los valores de cada libreta.")
        } else {
            $(".list-black").addClass("hidden")
             $(".list-stats").removeClass("hidden")
            var selectedCollection = selection.toString();
            var titles = $(".selectpicker option:selected").text()
            $(".text-stat").text("Graficas de la Colección "+ titles)
            $(".title").text(titles)
            $(".btn-red").removeClass("black").attr("disabled", false)
            $scope.getCollectionNotebooks(selectedCollection);
        }
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    $scope.export = function(e){
        var titles = $(".selectpicker option:selected").text()
        if(titles == "" || titles == "Elige la colección para ver las estadisticas"){
            alert("Seleccione una colección");
        }
        else{
            $("#dvData").table2excel({  
                name: "Table2Excel",  
                filename: "Estadisticas",  
                fileext: ".xls"  
            });  
            /* window.open('application/vnd.ms-excel;charset=utf-8,' + escape($('#dvData').html()));
            e.preventDefault();*/
        }
    }

  });
