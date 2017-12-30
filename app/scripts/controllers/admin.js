'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('AdminCtrl', function ($scope, $http, $timeout, upload) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

     $scope.collection = {};
    $scope.collectionsList;
    $scope.collectionsNames = []

    //variable en la cual se guarda el resultado de la petición al guardar imagen en el servidor
    $scope.resUploadFile;

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

    $scope.uploadCollection = function () {

      if ($.inArray($scope.collection.name, $scope.collectionsNames) > -1) {
        alert("la coleccion ya existe");
        return false
      } else {

        $(".full-overlay").removeClass("hidden");

        $scope.collectionSelected = $scope.collection.name;

        upload.upload('picture', $scope.collectionSelected,'modal').then(function (response) {
          if (response.status == '200') {
            $scope.collection.coverUrl = response.data;

            $http.post('https://api.backand.com:443/1/objects/collection', $scope.collection, {
              headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
              }
            }).then(
              function (response) {
                alert("cargada con éxito")
                $scope.collection.name = "";
                $scope.getCollectionList()
                 $(".full-overlay").addClass("hidden");
              },
              function (response) {
                alert("error")
              }
            );
          }
        })
      }
    }

    $scope.readURL = function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $(input).parent().next().attr('src', e.target.result);
              $(input).parent().next().removeClass("hidden");
          };
          reader.readAsDataURL(input.files[0]);   
      }
  }

  $scope.export = function(e){
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
        e.preventDefault();
    }

    
  })

  .service('upload',[
    '$http',
    function($http){
      this.upload =  function(id,selected,prefix){
      
      var inputFileImage = $("#" + id)[0].files[0];
      var dataImage = new FormData();

      dataImage.append("file", inputFileImage);
      dataImage.append('carpeta',selected);
      dataImage.append('prefix',prefix)

        return $http({
          method: "POST",
          url: "https://luisvardez.000webhostapp.com/upload.php",
          data: dataImage,
          headers: {
            'Content-Type': undefined
          }
        })
      }
    }
  ]);