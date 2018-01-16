'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:ConfigCtrl
 * @description
 * # ConfigCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('ConfigCtrl', function ($scope, Fact, $http, upload,  $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

    $scope.selection = 'edit-profile';
    $scope.password;
    //variable en la cual se guarda el resultado de la petición al guardar imagen en el servidor
    $scope.resUploadFile;

    $scope.selectionUser = Fact.userAdmin.id
    console.log($scope.selectionUser)

    $scope.changeView = function(value, nav) {
      $scope.selection = value;
      if ($scope.selection == "edit-profile") {
        $scope.getDataUser()
      	$scope.activeModule(nav)
      } else if ($scope.selection == "change-pass") {
        $scope.getDataUser()
        $scope.activeModule(nav)
      }
      else{
      	$scope.activeModule(nav)
      }
    }

    $scope.activeModule = function(target){
    	var target = $(event.target)
      	$(".menu2").removeClass("active")
      	target.addClass("active");
    }

    $scope.checking = function(input){
      $(input).closest("label").toggleClass("correct")
    }

    $scope.getDataUser = function() {
       $http({
          method: 'GET',
          url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
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
            console.log($scope.collectionsList)
            $("#name").val(response.data.name)
            $scope.changeName = response.data.name;
            $("#alias").val(response.data.alias)
             $scope.changeAlias = response.data.alias;
             $scope.password = response.data.password;
             $("#profile-photo").attr("src", "https://luisvardez.000webhostapp.com/"+response.data.imageUser)
          },
          function (response) {
            alert("error")
          });
    }

    $scope.getDataUser()

    $scope.removeDisabled = function(){
      $("#change-profile").prop("disabled", false)
    }

    $scope.changeProfile = function() {
      $scope.changeName = $("#name").val()
      $scope.changeAlias = $("#alias").val()

        $http({
            method: 'PUT',
            url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
            data: {
                name: $scope.changeName,
                alias:  $scope.changeAlias

            },
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
        }).then(
            function(response) {
                alert("Sus datos han cambiado")
                console.log(response);
                
            },
            function(response) {
                alert("error")
            });

        if($("#profile-photo").hasClass("changeOn")){
          
          /*Upload profilePhoto*/
           upload.upload('picture', 'photosUser','profile').then(function(response){
            console.log(response.status)
            if(response.status == '200'){
              $scope.imageUrl = response.data
               /*    $scope.notebookObject.listCoverSource = response.data;*/
              $http({
                  method: 'PUT',
                  url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
                  data: {
                      imageUser: $scope.imageUrl,
                  },
                  headers: {
                      AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                  }
              }).then(
                  function(response) {
                      console.log(response)
                  },
                  function(response) {
                      alert("error")
                  });
              }
            }) 

        }

        $("#change-profile").prop("disabled", true).off("click")
        
    }


    $scope.changePhoto = function(){
       
      }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }


    $scope.changePassword = function(){
      var newPass = $("#new-pass").val();
      var confirmNew = $("#confirm-pass").val();
      var oldPass = $("#old-pass").val();
      if(newPass.length == 0 || confirmNew.length == 0 || oldPass.length == 0){
        alert("Llene todos los campos")
      }
      else{
        if(oldPass == $scope.password){
            if(newPass == confirmNew){
                console.log($scope.selectionUser)
                $http({
                      method: 'PUT',
                      url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
                      data: {
                          password: confirmNew
                      },
                      headers: {
                          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                      }
                  }).then(
                      function(response) {
                          console.log(response);
                           alert("Su contraseña ha cambiado")
                           $("#new-pass, #confirm-pass, #old-pass").val("")
                      },
                      function(response) {
                          alert("error")
                  });
            }
            else{
              alert("Contraseña nueva no coincide");
            }
        }
        else{
          alert("Contraseña actual incorrecta");
        }
      }
    }

    $scope.readURL = function(input) {

      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $("#profile-photo").attr('src', e.target.result).addClass("changeOn")
          };
          reader.readAsDataURL(input.files[0]);  
      }
    }



  })

  .service('upload',[
    '$http',
    function($http){
      this.upload =  function(id,selected,prefix){
      
      var inputFileImage = $("#" + id)[0].files[0];
      console.log("input "+inputFileImage)
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


