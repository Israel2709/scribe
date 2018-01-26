'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('AdminCtrl', function ($scope, $http, $timeout, upload, Fact) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

    $scope.selections = "see-collections";
   
    $scope.collection = {};
    $scope.collectionsList;
    $scope.collectionsNames = []
    $scope.notebookObject = {};

    $scope.collectionSelected;

    $scope.selectedCollection = Fact.collectionDetail.id = null;

    $scope.resUploadFile;
    $scope.newIdCollect;

    $scope.changeView = function(select){
      if(select == 'see-collections'){
        $scope.selections = "see-collections";
        $scope.selectedCollection = Fact.collectionDetail.id = null;
      }
      else if(select == 'new-collections'){
        $scope.selections = 'new-collections';
        $scope.collection = {};
        $scope.collectionsList;
        $scope.collectionsNames = []
        $scope.notebookObject = {};
        $scope.getCollectionList();

        $scope.collectionSelected;

        $scope.selectedCollection = Fact.collectionDetail.id = null;

        $scope.resUploadFile;
        $scope.newIdCollect;
        $(".collectModal").removeClass("hidden")
        $(".notesModal").addClass("hidden")
      }
      else{
        $scope.selections = 'data-collections';
          $scope.getCollectionList();
          $(".collectModal").addClass("hidden")
          $(".notesModal").removeClass("hidden")
          $timeout(function() {
            $scope.views($scope.viewNotes);
          }, 300);
          $("#return-data").on("click", function(){
            $scope.changeView('see-collections')
          })
      }
    }


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
                 $scope.newIdCollect = $scope.collectionsList[$scope.collectionsList.length -1].id
                 for(var i=0; i<$scope.pruebasAdd.length; i++){
                    $scope.pruebasAdd[i].collection = $scope.newIdCollect
                  }
                $scope.listCollectionNames()
            },
            function(response) {
                alert("error")
            });
    }

    $scope.removeDisabled = function(){
      var submitImage = $(".view-image").attr("src")
      $scope.addNotebook = $("#news-notes").find("input.listo")
      if($scope.collection.name == "" || submitImage == "#" || $scope.collection.name == undefined || $scope.addNotebook.length != $scope.longMultiple){
        $("#submit-button").prop("disabled", true)
      }
      else{
         $("#submit-button").prop("disabled", false)
      }
    }

    $scope.listCollectionNames = function () {
      var i;
      for (i = 0; i < $scope.collectionsList.length; i++) {
        $scope.collectionsNames.push($scope.collectionsList[i].name)
      }
    }

    $scope.getCollectionList();

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

   

    $scope.uploadCollection = function () {
      if ($.inArray($scope.collection.name, $scope.collectionsNames) > -1) {
        alert("la coleccion ya existe");
        return false
      } else {
        $(".full-overlay").removeClass("hidden")
        $scope.collectionSelected = $scope.collection.name;
        console.log( $scope.collectionSelected)

        upload.upload('picture', $scope.collectionSelected,'modal').then(function (response) {
          console.log(response.status)
          if (response.status == '200') {
            $scope.collection.coverUrl = response.data;
            console.log($scope.collection)

            $http.post('https://api.backand.com:443/1/objects/collection/', $scope.collection, {
              headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
              }
            }).then(
              function (response) {         
                $scope.collection.name = "";
                $scope.getCollectionList()
                $("#picture").val("")
                $(".view-image").attr("src", "#").addClass("hidden")
              /*  $("#submit-button").prop("disabled", true)*/
                   $scope.uploadNotebook();
              },
              function (response) {
                alert("error")
              }
            );
          }
        })
      }
    }


    $scope.uploadNotebook = function () {
      var i;
      for(i=0; i < $scope.longMultiple; i++){
        $scope.transformImages('pictures', $scope.newIdCollect,'notebook', i)
      }
      $scope.uploadService()
    }

    $scope.uploadAllNotes = function(){
      console.log($scope.pruebasAdd)
      $http.post('https://api.backand.com:443/1/objects/notebook', $scope.pruebasAdd, {
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
          }
        }).then(
                function (response) {
                  $(".full-overlay").addClass("hidden");
                  $("#submitCorrect").modal("show");
                  $scope.pruebasAdd = [];
                  $scope.nameOriginal = [];
                  $scope.namesNotes = [];
                  $scope.arrayImages = [];
                  $timeout(function() {
                    $("#submitCorrect").modal("hide");
                    $("#return-new").trigger("click");
                  }, 2000);
                },
                function (response) {
                  alert("error")
                }
              );
      }
    

    $scope.readURL = function(input, images) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          console.log(input.files)
          reader.onload = function (e) {
              $(images).attr('src', e.target.result);
              $(images).removeClass("hidden");
              if(images == '#img_prev'){
                $scope.removeDisabledData()
              }
              else{
                $scope.removeDisabled()
              }
          };
          reader.readAsDataURL(input.files[0]);  
      }
  }


  $scope.nameOriginal = [];
  $scope.longMultiple;
 /* $scope.arrayPrueba = [];*/

   $scope.readURL2 = function(input) {
    var i;
    var reader;
    $scope.longMultiple = input.files.length 
      if (input.files && input.files[0]) {
          for(i=0; i < input.files.length; i++){
              reader = new FileReader();
                reader.onload = function (e) {
                  var images = "<div class=' col-md-2 col-sm-4 list-box addNotes' ><img name='"+e.total+"' class='addNotes' src='"+e.target.result+"' />"+
                  "<input type='text' class='general-input' onfocusout='angular.element(this).scope().addNotebookPrueba(this); angular.element(this).scope().removeDisabled()'  placeholder='Nombre de libreta'>"+
                  "<p class='text-danger hidden notes-exist'>Nombre existente</p></div>"
                  $("#news-notes").append(images);
                  $scope.removeDisabled();
              };
            reader.readAsDataURL(input.files[i]);
          }           

      }
  }

  $scope.pruebasAdd = []
  $scope.namesNotes = []

  $scope.addNotebookPrueba = function(notebooks){
    console.log($scope.pruebasAdd)
     $scope.pruebas1 = $(notebooks).val()
     $scope.pruebas2 = $(notebooks).siblings("img").attr("src")
     $scope.nameInput = $(notebooks).siblings("img").attr("name")
     $scope.suma = $scope.newIdCollect+1;
     var i;
   
     if ($.inArray($scope.pruebas1, $scope.namesNotes) > -1) {
        $(notebooks).next().removeClass("hidden").text("Nombre de libreta existente")
        $(notebooks).unbind("onfocusout")
        return false;
      } if ($scope.pruebas1.length == 0){
        $(notebooks).next().removeClass("hidden").text("Ingrese nombre")
        $(notebooks).unbind("onfocusout")
      }
      else if($(notebooks).hasClass("listo")){
         for(var i=0; i < $scope.pruebasAdd.length; i++){
          if($scope.pruebasAdd.length == 0){
            return false;
          }
          else if($scope.pruebasAdd[i].name2 == $scope.nameInput){
            $scope.pruebasAdd[i].name = $scope.pruebas1;
            $(notebooks).next().addClass("hidden")
          }
       }
     }
     else{
        $(notebooks).next().addClass("hidden")
        $(notebooks).addClass("listo")
/*        $(notebooks).prop("disabled", true)*/
         $scope.pruebasAdd.push({collection: $scope.suma, name: $scope.pruebas1, coverSource: $scope.pruebas2, name2: $scope.nameInput})
         $scope.namesNotes.push($scope.pruebas1)
       
     }
    
  }


    $scope.eventSelect = null;

    $scope.collectionOptions = function(element){
      $scope.eventSelect = $(element).find("img").attr("value")
      $scope.selectedCollection = Fact.collectionDetail.id = $scope.eventSelect;
      $scope.viewNotes = $scope.selectedCollection
      $scope.changeView('data-collections');
    }

      $scope.collectionDelete = function(){
        var element = $scope.viewNotes
        $(".collectModal").removeClass("hidden")
        $(".notesModal").addClass("hidden")
        $scope.eventSelect = null;
        var collection = $("#"+element).find("h1").text().toUpperCase()
        $(".title").text(collection)
        $scope.eventSelect = $("#"+element).find("img").attr("value")
        $scope.eventSelect = $("#"+element).find("img").attr("value")
        $("#options").modal("show")
        $(".no-collect").on("click", function(){
          $(".collectModal").addClass("hidden")
          $(".notesModal").removeClass("hidden")
        })
    }


    //Pruebas delete collection

    $scope.deleteCollection = function() {
       $http({
          method: 'DELETE',
          url: 'https://api.backand.com:443/1/objects/collection/' + $scope.viewNotes,
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
            $("#options").modal("hide")
            $("#delete").modal("show")
            $timeout(function() {
              $("#delete").modal("hide")
              $scope.changeView('see-collections')
              $scope.getCollectionList()
            }, 2000);
          },
          function (response) {
            alert("error")
          });
    }

    $scope.arrayImages = []
    $scope.count = []


    $scope.transformImages = function(id, selected, prefix, indice){
      var inputFileImage = $("#" + id)[0].files[indice];
      var nameFile = $("#" + id)[0].files[indice].size
      var dataImage = new FormData();
      dataImage.append("file", inputFileImage);
      dataImage.append('carpeta', selected);
      dataImage.append('prefix', prefix)
      console.log(nameFile)


      $scope.arrayImages.push({objectUrl: dataImage, names: nameFile})
      $scope.count.push(nameFile)
      console.log($scope.count)
    }



    $scope.uploadService = function(){
      var numImages = $scope.count.length-1;
      $scope.nameOfUpload = $scope.arrayImages[numImages].names

      $http({
          method: "POST",
          url: "https://luisvardez.000webhostapp.com/upload.php",
          data: $scope.arrayImages[numImages].objectUrl,
           headers: {
              'Content-Type': undefined
           }
       }).then(function(response) {
          console.log(response)
            var j;
            $scope.idUpload;
            for(j=0; j < $scope.pruebasAdd.length; j++){
              console.log("entra")
              console.log($scope.nameOfUpload)
              console.log("name "+ $scope.pruebasAdd[j].name2)
              if($scope.nameOfUpload == $scope.pruebasAdd[j].name2){
                console.log("el id es"+j)
                $scope.idUpload = j;
              }
            }
          $scope.pruebasAdd[$scope.idUpload].coverSource = response.data;
           var newNum = numImages - 1;
           $scope.count.pop();
          if(newNum == -1){
             $timeout(function() {
                $scope.uploadAllNotes()
            }, 2000);
           }
           else{
            $timeout(function() {
                $scope.uploadService()
            }, 1000);
            
           }
      });

    }

      
    $scope.views = function(id){
      console.log($scope.viewNotes)
      if($scope.viewNotes == null){
        angular.element(".selectpicker option:eq(2)").prop("selected", true).trigger("change")
        /*$scope.setCollection("Colecciones");*/
      }
      else{
        angular.element(".selectpicker option#"+id).prop("selected", true).trigger("change")
      }
    }


    //Funciones Cargar solo una libreta

    $scope.removeDisabledData = function(){
      var images = $("#img_prev").attr("src")
      var title = $(".selectpicker option:selected").text()
      if(title == "" || title == "Colecciones" || $scope.notebookObject.name == "" || $scope.notebookObject.name == undefined || images == "#"){
        $("#submit-notes").prop("disabled", true)
      }
      else{
         $("#submit-notes").prop("disabled", false)
      }
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


    var idSelection;

    $scope.setCollectionData = function(selection) {
        if (selection == "Colecciones") {
            $(".btn-red").addClass("disabled").off("click")
        } else {
          console.log(selection)
            idSelection = selection.toString();
            var title = $(".selectpicker option:selected").text() 
            $scope.notebookObject.name = '';
            $("#img_prev").attr("src", "#").addClass("hidden")
            $("#fileupload").val("")
            $(".note-selected, .title-data-collect").text(" Colección " + title)
            $(".titles-modal").text(title)
            $(".btn-red").removeClass("disabled").on("click")
            $scope.getNotebooks(idSelection);

            $scope.notebookObject.collection = $scope.viewNotes;

            console.log($scope.collectionsList)
            $scope.collectionsList.forEach(function (value, key) {
              if (value.id == $scope.viewNotes) {
                $scope.collectionSelected = value.name;
              }
            }, this);
              }
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

    //carga de libretas
    $scope.uploadNotebookData = function () {

      //se manda llamar el servicio creado para la carga de las imagenes,
      //Parametros:  Id de input tipo file,nombre de la coleccion que se envía y el nombre del tipo de imagen
      //:notebook y detail
      $(".full-overlay").removeClass("hidden")
      upload.upload('fileupload',$scope.viewNotes,'notebook').then(function(response){
        if(response.status == '200'){
           $scope.notebookObject.coverSource = response.data;
           $scope.notebookObject.collection = $scope.viewNotes;
           console.log($scope.notebookObject)

      /*     upload.upload('fileupload2',$scope.collectionSelected,'detail').then(function(response){*/
           /*    $scope.notebookObject.listCoverSource = response.data;*/
              $http.post('https://api.backand.com:443/1/objects/notebook', $scope.notebookObject, {
                headers: {
                  AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                }
              })
              .then(
                function (response) {
                  $(".full-overlay").addClass("hidden")
                  $("#submitCorrect").modal("show")
                  $scope.notebookObject = {};
                  $scope.selectedCollections = {};
                  $("#fileupload").val("");
                  $(".view-image").attr("src", "#").addClass("hidden")
                  $("#submit-notes").prop("disabled", true)
                  $scope.getNotebooks($scope.viewNotes);
                  $timeout(function() {
                    $("#submitCorrect").modal("hide")
                  }, 2000);
                },
                function (response) {
                  $(".full-overlay").addClass("hidden")
                  alert("error")
                }
              );
           /*})*/
        }
      })//termina then de servicio
    }


     $scope.optionNotes = function(element){
      $scope.valueId = null;
      $scope.valueId = $(element).attr("value");
      $("#options").modal("show")
    }

     $scope.deleteNotebooks = function() {
       $http({
          method: 'DELETE',
          url: 'https://api.backand.com:443/1/objects/notebook/' + $scope.valueId,
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
            $("#options").modal("hide")
            $("#delete").modal("show")
            $timeout(function() {
              $scope.valueId = null;
              $("#delete").modal("hide")
              $scope.getNotebooks($scope.viewNotes);
            }, 700);
          },
          function (response) {
            alert("error")
          });
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
