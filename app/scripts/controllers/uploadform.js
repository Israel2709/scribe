'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:UploadformCtrl
 * @description
 * # UploadformCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
    .controller('UploadformCtrl', function($scope, $http,upload) {
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
                    AnonymousToken: "85287cc5-3404-4318-97e7-0571e2c805e8"
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
                    AnonymousToken: "85287cc5-3404-4318-97e7-0571e2c805e8"
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
                    AnonymousToken: "85287cc5-3404-4318-97e7-0571e2c805e8"
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

            var file = $scope.file;
            upload.uploadFile(file).then(function(){

            }) 
        }
    })

    .directive('uploaderModel',["$parse",function($parse){
        return{
            restrict: 'A',
            link:function(scope,iElement,iAttrs){
                iElement.on("change",function(e){
                    $parse(iAttrs.uploaderModel).assign(scope,iElement[0].files[0]);
                })
            }
        }
    }])

    .service('upload',["$http","$q",function($http,$q){

        var url = "upload.php";
        this.uploadFile = function (file) {
          var deferred = $q.defer();
          //var inputFileImage = $("#fileupload")[0].files[0];
          var dataImage = new FormData();

          dataImage.append('file', file);

          return $http({
                method:"POST",
                url:url,
                data:dataImage,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(function(res){
                console.log(res)
              deferred.resolve(res)
            })
            .catch(function(msg, code){
                console.log(msg)
              deferred.reject(msg);
            })

          return deferred.promise;
        }


    }])