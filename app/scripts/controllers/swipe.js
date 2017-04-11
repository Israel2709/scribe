'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:SwipeCtrl
 * @description
 * # SwipeCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('SwipeCtrl', function ($document, $scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.selection;

    $scope.ObjectLike = {
      "like":[],
      "dislike":[]
    }; 
   

    $scope.initJtinder = function(){
        $("#swipe-wrapper").jTinder({
          onDislike: function (item) {
              $('#status').html('Dislike image ' + (item.index()+1));
              fillObject("dislike",item);
          },
          onLike: function (item) {
              $('#status').html('Like image ' + (item.index()+1));
            fillObject("like",item);
          },
        animationRevertSpeed: 200,
        animationSpeed: 400,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
      });

      $('.actions .like, .actions .dislike').click(function(e){
        e.preventDefault();
        $("#swipe-wrapper").jTinder($(this).attr('class'));
      });
    }

    $scope.changeView = function(value){
      $scope.selection = value;
      setTimeout(function() {
        $scope.initJtinder();
      }, 500);
      
    }

     $scope.changeView('content');

  
    function fillObject(category,item){
      eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\")})");
      console.log($scope.ObjectLike)
    }

    $scope.goTo = function(){
      alert("goto")
      /*$(".section").addClass("hidden")
      $(destiny).toggleClass("hidden")*/
    }

   
    $scope.toggleHeaderBtn =  function(btn){
      $(".header .btn").addClass("hidden");
      $(btn).toggleClass("hidden");
    }

    $scope.togglePreferencesList =  function(selection){
      $(".preferences-control .btn").removeClass("active")
      $(selection).addClass("active")
    }

    $scope.fillPreferencesList =  function(listType){
      console.log(listType)
      var selectedList;
      switch (listType){
        case "like":
        selectedList = $scope.ObjectLike.like;
        console.log(selectedList)
        break;

        case "dislike":
        selectedList = $scope.ObjectLike.dislike;
        console.log(selectedList)
        break;
      }

      $(".list-wrapper").empty();
      for(i=0; i<selectedList.length; i++){
            var selectedCard = 	"<div class='col-xs-12 col-sm-4'>" +
                      "<div class='list-card'>"+
                        "<img src='"+selectedList[i].imagen+"' alt=''>" +
                        "<p class='card-name'>"+selectedList[i].nombre+"</p>" +
                        "<div class='like-count'>" +
                        "<span class='counter'>"+Math.floor((Math.random() * 500) + 100)+"</span>" +
                        "<div class='like-btn'></div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
        $(".list-wrapper").append(selectedCard)
      }
    }

    $scope.changeContainer = function(){
      $(".img-logo").toggleClass("hidden");
      if($(".main-container").hasClass("container")){
        $(".main-container").removeClass("container");
        $(".main-container").addClass("container-fluid");
      }else{
        $(".main-container").addClass("container");
        $(".main-container").removeClass("container-fluid");
      }
      
    }

  });

