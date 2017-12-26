'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('AdminCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.selection = "collections";

    $scope.changeView = function(value) {
        $scope.selection = value;
        if ($scope.selection == "collections") {


        } else if ($scope.selection == "notebooks") {
            $(".selected").trigger("click")
        } else {

        }
    }
 
    $scope.changeView('collections');

    $scope.collectionsList;

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
            $(".note-selected").text(" Colección " + prueba)
            $scope.getCollectionNotebooks(selectedCollection);
        }
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    $scope.getNotebookArray = function() {
        $http({
            method: 'GET',
            url: 'https://api.backand.com/1/objects/notebook',
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
        }).then(
            function(response) {
                $scope.notebookArray = response.data.data;
                console.log($scope.notebookArray)
            },
            function(response) {
                alert("error")
            }
        );
    }

    $scope.getNotebookArray()

    
  });