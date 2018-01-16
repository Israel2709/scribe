'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:LoginadminCtrl
 * @description
 * # LoginadminCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('LoginadminCtrl', function ($scope, $http, Fact) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.collectionsList;
    $scope.userMails = [];

    $scope.changeBG = function(){
      $(".header img").addClass("marginTAdmin")
    	$("body").prepend("<div class='bgLogin'></div>")
    }

    $scope.removeBg = function(){
    	
    }

    $scope.checking = function(){
      $(".form-check-label").toggleClass("correct")
    }

    $scope.changeBG();

    $scope.getCollectionList = function() {
        $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/userAdmin?pageSize=20&pageNumber=1',
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
                $scope.listUsersMail();
            },
            function(response) {
                alert("error")
            });
    }

    $scope.listUsersMail = function () {
      var i;
      for (i = 0; i < $scope.collectionsList.length; i++) {
        $scope.userMails.push({
              id : $scope.collectionsList[i].id,
              email : $scope.collectionsList[i].email, 
              password :  $scope.collectionsList[i].password
          });
      }
      console.log($scope.userMails)
    }

    $scope.getCollectionList();

    $scope.pruebas = function(){
      var i;
      for (i = 0; i < $scope.userMails.length; i++) {
        if($scope.userMails[i].email == $scope.email){
          //
          if($scope.userMails[i].password == $scope.password){
            $(".bgLogin").remove()
            $(".header img").removeClass("marginTAdmin")
            $(".red-btn").removeClass("disabled")
            window.location = "#/admin";
            $scope.userEnter = Fact.userAdmin.id = $scope.userMails[i].id;
          }
          else{
            alert("datos no coinciden")
          }
        }
        else{
          alert("datos no validos")
        }
      }
    }

  });
