'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:UploadformCtrl
 * @description
 * # UploadformCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
    .controller('UploadformCtrl', function($scope, $http, $timeout) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

        $scope.collection = {};
        $scope.collectionsList;
        $scope.collectionsNames=[]
        $scope.notebookObject={};
        
        $scope.collectionSelected;

        //variable en la cual se guarda el resultado de la petición al guardar imagen en el servidor
        $scope.resUploadFile;

        var urlModal;
        var urlDetalle;
        var urlLista;

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
                    console.log(response.data.data)
                    $scope.collectionsList = response.data.data;
                    console.log($scope.collectionsList)
                    $scope.listCollectionNames()
                },
                function(response) {
                    alert("error")
                });
        }

        $scope.listCollectionNames = function(){
            var i;
            for (i=0; i< $scope.collectionsList.length;i++){
                $scope.collectionsNames.push($scope.collectionsList[i].name)
            }
            console.log($scope.collectionsNames)
        }

        $scope.getCollectionList();

        $scope.uploadCollection = function() {

            if ($.inArray($scope.collection.name, $scope.collectionsNames) > -1) {
              alert("la coleccion ya existe");
              return false
            } else {
              //var filename = $("#picture").val();
              //var nameLength = filename.length
              //filename = filename.substr((filename.lastIndexOf("\\") + 1), nameLength);

              //$scope.collection.modalCoverUrl = "images/collection-catalog/" + $scope.collection.name + "/" + filename
              
              $scope.collectionSelected = $scope.collection.name;
              $scope.uploadFile('picture');

              setTimeout(function() {
                if($scope.resUploadFile != "error" || $scope.resUploadFile != undefined){
                  $scope.collection.coverUrl = $scope.resUploadFile;

                  $http.post('https://api.backand.com:443/1/objects/collection', $scope.collection, {
                      headers: {
                          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                      }
                  }).then(
                      function (response) {
                          alert("cargada con éxito")
                          $scope.collection.name = "";
                          $scope.getCollectionList()

                      },
                      function (response) {
                          alert("error")
                      }
                );
              }
              }, 400);
              
            }
        }

        $scope.setCollectionId = function(){

            $scope.notebookObject.collection = $scope.selectedCollection;

            console.log($scope.collectionsList)
            $scope.collectionsList.forEach(function(value,key) {
                if(value.id == $scope.selectedCollection){
                     $scope.collectionSelected = value.name;
                }
            }, this);
            
        }

        $scope.uploadNotebook = function(){
            console.log($scope.notebookObject)
            $http.post('https://api.backand.com:443/1/objects/notebook', $scope.notebookObject, {
                headers: {
                    AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                }
            }).then(
                function(response) {
                    alert("cargada con éxito")
                    $scope.notebookObject={};
                    $scope.selectedCollection = {}

                },
                function(response) {
                    alert("error")
                }
            );
        }

        $scope.uploadFile =  function(id) {
            
            var inputFileImage = $("#" + id)[0].files[0];
            var dataImage = new FormData();
            
            dataImage.append("file", inputFileImage);
            dataImage.append('carpeta', $scope.collectionSelected);

            $http({
                method: "POST",
                url: $scope.urlUpload,
                data: dataImage,
                headers: {
                  'Content-Type': undefined
                },
                transformRequest:angular.identity
              })
              .then(function(res) {
                  if(res.data != "error" || res.data != "no_permitido"){
                    $scope.resUploadFile = res.data;
                  } 
              })           
        }
    })


    