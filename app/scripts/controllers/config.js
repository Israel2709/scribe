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
            $("#name").val(response.data.email)
            $scope.changeName = response.data.email;
          /*  $("#alias").val(response.data.alias)
             $scope.changeAlias = response.data.alias;*/
             $scope.password = response.data.password;
             /*$("#profile-photo").attr("src", "https://luisvardez.000webhostapp.com/"+response.data.imageUser)*/
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
      var newPass = $("#new-pass").val();
      var confirmNew = $("#confirm-pass").val();
      var oldPass = $("#old-pass").val();
       if(newPass.length == 0 && confirmNew.length == 0 && oldPass.length == 0){
                $http({
                  method: 'PUT',
                  url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
                  data: {
                      name: $scope.changeName,
                  },
                  headers: {
                      AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                  }
              }).then(
                  function(response) {
                      alert("Sus datos han cambiado")
                      $("#change-profile").prop("disabled", true)
                      console.log(response);
                      
                  },
                  function(response) {
                      alert("error")
                  });
        }
          else{
                if(newPass.length == 0 || confirmNew.length == 0 || oldPass.length == 0){
                  alert("Llene todos los campos")
                }else{
                   if(oldPass == $scope.password){
                    if(newPass == confirmNew){
                        console.log($scope.selectionUser)
                        $http({
                              method: 'PUT',
                              url: 'https://api.backand.com:443/1/objects/userAdmin/' + $scope.selectionUser,
                              data: {
                                  password: confirmNew,
                                  name: $scope.changeName
                              },
                              headers: {
                                  AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                              }
                          }).then(
                              function(response) {
                                  console.log(response);
                                   alert("Sus datos han cambiado")
                                   $("#change-profile").prop("disabled", true)
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
    }


  });


