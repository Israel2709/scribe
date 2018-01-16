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

  $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

    $scope.collection = {};
    $scope.collectionsList;
    $scope.collectionsNames = []
    $scope.notebookObject = {};

    $scope.collectionSelected;

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
                 $scope.listCollectionNames()
            },
            function(response) {
                alert("error")
            });
    }

    $scope.getNotebooks = function(selectedCollection) {
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

  $scope.getCollectionNotebooks = function () {
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
            "value": "50" /*aqui va el id de la colección a consultar*/
          }],
        }
      }).then(
        function (response) {
          console.log(response.data.data)
        },
        function (response) {
          alert("error")
        });
    }

    $scope.getCollectionList();

    var idSelection;

    $scope.setCollection = function(selection) {
        if (selection == "Colecciones") {
            $(".btn-red").addClass("disabled").off("click")
        } else {
            idSelection = selection.toString();
            var title = $(".selectpicker option:selected").text()
            $(".note-selected, .title").text(" Colección " + title)
            $(".btn-red").removeClass("disabled").on("click")
            $scope.getNotebooks(idSelection);

            $scope.notebookObject.collection = $scope.selectedCollection;

            console.log($scope.collectionsList)
            $scope.collectionsList.forEach(function (value, key) {
              if (value.id == $scope.selectedCollection) {
                $scope.collectionSelected = value.name;
              }
            }, this);
              }
    }

    $scope.listCollectionNames = function () {
      var i;
      for (i = 0; i < $scope.collectionsList.length; i++) {
        $scope.collectionsNames.push($scope.collectionsList[i].name)
      }
      console.log($scope.collectionsNames)
    }

     $scope.getSingleCollection = function () {
      $http({
        method: 'GET',
        url: 'https://api.backand.com:443/1/objects/collection/50',
        /*el último número debe ser el id de la colección a consultar*/
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
        },
        params: {
          pageSize: 20,
          pageNumber: 1
        }
      }).then(
        function (response) {
          console.log(response.data)
          $scope.getCollectionNotebooks();
        },
        function (response) {
          alert("error")
        });
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    //carga de libretas
    $scope.uploadNotebook = function () {
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

    $scope.readURL = function(input, idImage) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $(idImage).attr('src', e.target.result);
              $(idImage).removeClass("hidden");
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
          $("#dvData").table2excel({  
                name: "Table2Excel",  
                filename: "Libretas",  
                fileext: ".xls"  
            }); 
            /* window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
            e.preventDefault();*/
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
