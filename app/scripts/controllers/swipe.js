'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:SwipeCtrl
 * @description
 * # SwipeCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('SwipeCtrl', function ($document, $scope,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.selection;

    //arreglo donde se guardan los like y dislikes de las imagenes
    $scope.ObjectLike = {
      "like":[],
      "dislike":[]
    }; 

    $scope.collectionNotebooks = {};
   
    //función para inicializar el plug in de tinder.
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
        $scope.getCollectionNotebooks();
        
      }, 500);

      setTimeout(function() {
        $scope.initJtinder();
      }, 1000);
      
    }

    $scope.changeView('content');

  
    function fillObject(category,item){
      eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\")})");
      console.log($scope.ObjectLike)
    }
   
    //funciones manipulación de vista
    $scope.toggleHeaderBtn =  function(btn){
      $(".header .btn").addClass("hidden");
      $(btn).toggleClass("hidden");
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

    //NOTA: NO ESTA PASANDO LA REFERENCIA DEL ELEMENTO AL QUE SE ESTA DANDO CLICK, AL PARECER POR LA REFERENCIA DE NG-CLICK... VALIDAR
    $scope.togglePreferencesList =  function(selection){
      console.log(selection)
      $(".preferences-control .btn").removeClass("active");
      $(selection).children().addClass("active");
    }

    $scope.fillPreferencesList =  function(listType){
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
      var selectedCard = "";
      var contador = 0;
      for(var i=0; i<selectedList.length; i++){
          if(contador == 0){
            selectedCard += "<div class='row'>";
          }
          selectedCard += "<div class='col-xs-12 col-sm-4'>" +
              "<div class='list-card'>"+
                "<img src='https://luisvardez.000webhostapp.com/"+selectedList[i].imagen+"' alt=''>" +
                "<p class='card-name'>"+selectedList[i].nombre+"</p>" +
                "<div class='like-count'>" +
                "<span class='counter'>"+Math.floor((Math.random() * 500) + 100)+"</span>" +
                "<div class='like-btn'></div>" +
                "</div>" +
                "</div>" +
                "</div>";

            contador++;
            if(contador == 3){
              selectedCard +="</div>";
              contador = 0;
            }
      }
      $(".list-wrapper").append(selectedCard);

    }

    //obtención de la lista de libretas de una colección
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
            "value": "53" /*aqui va el id de la colección a consultar*/
          }],
        }
      }).then(
        function (response) {
          $scope.collectionNotebooks = response.data.data;
          console.log($scope.collectionNotebooks);
        },
        function (response) {
          alert("error")
        });
    }

  });

