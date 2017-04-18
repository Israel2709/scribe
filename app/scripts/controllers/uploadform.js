'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:UploadformCtrl
 * @description
 * # UploadformCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
    .controller('UploadformCtrl', function($scope, $http) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.collection = {};
        $scope.collectionsList;
        $scope.notebookObject={};

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
                },
                function(response) {
                    alert("error")
                });
        }

        $scope.getCollectionList();
        
        $scope.uploadCollection = function() {
            console.log($scope.collection);
            $http.post('https://api.backand.com:443/1/objects/collection', $scope.collection, {
                headers: {
                    AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                }
            }).then(
                function(response) {
                    alert("cargada con éxito")
                    $scope.collection.name = "";
                    $scope.getCollectionList()

                },
                function(response) {
                    alert("error")
                }
            );
        }

        $scope.setCollectionId = function(){
            console.log($scope.selectedCollection)
            $scope.notebookObject.collection = $scope.selectedCollection
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


        $scope.uploadFile =  function() {
            var url = "https://luisvardez.000webhostapp.com/upload.php";
            var inputFileImage = $("#fileupload")[0].files[0];
            var dataImage = new FormData();

            dataImage.append("carpeta", 'Black');
            dataImage.append("file", inputFileImage);

            $http({
                method: "POST",
                url: url,
                data: dataImage,
                headers: {
                  'Content-Type': undefined
                }
              })
              .then(function(res) {
                console.log(res)
                
              })
              .catch(function(res) {
                console.log(res)
              })

           
        }
    })


    