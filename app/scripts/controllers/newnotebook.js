'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:NewnotebookCtrl
 * @description
 * # NewnotebookCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('NewnotebookCtrl', function ($scope, $http, $timeout,upload) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.collectionsList;
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
            $(".btn-red").addClass("disabled").off("click")
        } else {
            var selectedCollection = selection.toString();
            var prueba = $(".selectpicker option:selected").text()
            $(".note-selected, .title").text(" Colección " + prueba)
            $(".btn-red").removeClass("disabled").on("click")
            $scope.getCollectionNotebooks(selectedCollection);
        }
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    $scope.collectionsLists;
    $scope.collectionsNames = []
    $scope.notebookObject = {};
    $scope.selectedCollections;

    $scope.collectionSelected;

    $scope.setCollectionId = function () {

      $scope.notebookObject.collection = $scope.selectedCollections;

      console.log($scope.collectionsList)
      $scope.collectionsList.forEach(function (value, key) {
        if (value.id == $scope.selectedCollections) {
          $scope.collectionSelected = value.name;
        }
      }, this);

    }

    //carga de libretas
    $scope.uploadNotebook = function () {
       $(".full-overlay").removeClass("hidden");
      //se manda llamar el servicio creado para la carga de las imagenes,
      //Parametros:  Id de input tipo file,nombre de la coleccion que se envía y el nombre del tipo de imagen
      //:notebook y detail
      upload.upload('fileupload',$scope.collectionSelected,'notebook').then(function(response){
        if(response.status == '200'){
           $scope.notebookObject.coverSource = response.data;

           upload.upload('fileupload2',$scope.collectionSelected,'detail').then(function(response){
               $scope.notebookObject.listCoverSource = response.data;
              $http.post('https://api.backand.com:443/1/objects/notebook', $scope.notebookObject, {
                headers: {
                  AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                }
              })
              .then(
                function (response) {
                  alert("cargada con éxito")
                  $scope.notebookObject = {};
                  $scope.selectedCollections = {};
                  $(".full-overlay").addClass("hidden");
                  $("#fileupload,#fileuload2").attr({ value: '' });
                  $(".img-prev").attr("src","").addClass("hidden");
                },
                function (response) {
                  alert("error")
                }
              );
           })
        }
      })//termina then de servicio
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
        var titles = $(".selectpicker option:selected").text()
        if(titles == ""){
            alert("Seleccione una colección");
        }
        else{
             window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
            e.preventDefault();
        }
    }


  })

//servicio para la ejecución de peticion y guardado de imagenes
  //Prefix: modal,notebook,detail
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
