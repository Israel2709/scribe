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
      var name = $("#name").val()
      var newPass = $("#new-pass").val();
      var confirmNew = $("#confirm-pass").val();
      var oldPass = $("#old-pass").val();
      if(newPass == "" || confirmNew == "" || oldPass == ""){
        $("#change-profile").prop("disabled", true)
        if(name == $scope.changeName){
          $("#change-profile").prop("disabled", true)
        }
        else{
          $("#change-profile").prop("disabled", false)
        }
      }
      else{
        $("#change-profile").prop("disabled", false)
      }
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
                    $("#submitCorrect").modal("show") 
                    $("#change-profile").prop("disabled", true)  
                    $timeout(function() {
                      $("#submitCorrect").modal("hide")
                    }, 2000);            
                  },
                  function(response) {
                      alert("error")
                  });
        }
          else{
                if(newPass.length == 0 || confirmNew.length == 0 || oldPass.length == 0){
                  $(".enter").removeClass("hidden").text("Llenar todos los campos.")
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
                                  $("#submitCorrect").modal("show") 
                                   $("#change-profile").prop("disabled", true)
                                   $("#new-pass, #confirm-pass, #old-pass").val("")
                                   $(".enter").addClass("hidden").text("")
                                   $timeout(function() {
                                      $("#submitCorrect").modal("hide")
                                    }, 2000);
                              },
                              function(response) {
                                  alert("error")
                          });
                    }
                    else{
                      $(".enter").removeClass("hidden").text("Contraseña nueva no coincide.")
                    }
                }
                else{
                  $(".enter").removeClass("hidden").text("Contraseña actual incorrecta.")
                }
                }
               
              }
    }


  });


