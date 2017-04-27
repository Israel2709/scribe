'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:SwipeCtrl
 * @description
 * # SwipeCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .directive('myRepeatDirective',function(){
      return function(scope, element, attrs) {
        if (scope.$last){
          $("#swipe-wrapper").css("display","block");
          $(".text-center").css("display","none");
          setTimeout(function() {
             scope.initJtinder();
          }, 400);
        }
      };
  })

  .controller('SwipeCtrl', function ($document, $scope,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //varible para mostrar las diferentes capas dependiendo del contendino
    $scope.selection;

    //arreglo donde se guardan los like y dislikes de las imagenes
    $scope.ObjectLike = {
      "like":[],
      "dislike":[]
    }; 

    $("#collection-modal").modal("show")
    $("#collection-modal").on("hidden.bs.modal",function(e){
      $('#swipe-wrapper').unbind().removeData();
      $scope.initJtinder()
      console.log("closing modal")
    })

    //arreglo que guarda la lista de libretas
    $scope.collectionNotebooks = {};

    var selectedCollection = "56"

    $("#collection-modal").modal("show")

    var selectedCollection = "56";
   
    //función para inicializar el plug in de tinder.
    $scope.initJtinder = function() {
      $("#swipe-wrapper").jTinder({
        onDislike: function(item) {
            $('#status').html('Dislike image ' + (item.index() + 1));
            fillObject("dislike", item);

            //elimina del arreglo el elemento que ya fue evaluado, esto para que cuando cambiemos de pantalla y regresemos no se esten rpesentando los
            //todos aunque ya los hayamos evaluado
            $scope.collectionNotebooks.forEach(function(index, value) {
                if ($scope.collectionNotebooks[value].id == item.data("id")) {
                    $scope.collectionNotebooks.splice(value, 1)
                }
            }, this);
        },
        onLike: function(item) {
            $('#status').html('Like image ' + (item.index() + 1));
            fillObject("like", item);

            $scope.collectionNotebooks.forEach(function(index, value) {
                if ($scope.collectionNotebooks[value].id == item.data("id")) {
                    $scope.collectionNotebooks.splice(value, 1)
                }
            }, this);
        },
        animationRevertSpeed: 200,
        animationSpeed: 400,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
      });

      $('.actions .like, .actions .dislike').click(function(e) {
        e.preventDefault();
        $("#swipe-wrapper").jTinder($(this).attr('class'));
      });
    }

    $scope.changeView = function(value, image = "") {
      $scope.selection = value;
      if ($scope.selection == "preferences") {
        setTimeout(function() {
            $scope.fillPreferencesList('like');
        }, 600);

      } else if ($scope.selection == "content") {
          //$("#collection-modal").modal("show")
      } else {
        setTimeout(function() {
            $("#img-detail").attr("src", "https://luisvardez.000webhostapp.com/" + image.notebooks.coverSource);
            $(".title-note").text(image.notebooks.name);
            $(".counterLikes").text(image.notebooks.like);
        }, 200);
      }
    }

    

     $scope.getCollectionNotebooks = function (selectedCollection) {
       //if($scope.collectionNotebooks.length == 0 || $scope.collectionNotebooks.length == undefined){
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
        function (response) {
          $scope.collectionNotebooks = response.data.data;     
        },
        function (response) {
          alert("error")
        });
    }

    $scope.changeView('content');

  
    function fillObject(category,item){
      eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\"),\"like\":item.data(\"like\")})");
      console.log($scope.ObjectLike)
      $scope.getSelectedNotebook(item.data('id'));
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
        $(".main-container .header").addClass("displayN")
      }else{
        $(".main-container").addClass("container");
        $(".main-container").removeClass("container-fluid");
        $(".main-container .header").removeClass("displayN")
      }
      
    }

    //NOTA: NO ESTA PASANDO LA REFERENCIA DEL ELEMENTO AL QUE SE ESTA DANDO CLICK, AL PARECER POR LA REFERENCIA DE NG-CLICK... VALIDAR
    $scope.togglePreferencesList =  function(event){
      var target = $(event.target)
      $(".preferences-control .btn").removeClass("active");
      target.addClass("active");
    }

    $scope.fillPreferencesList =  function(listType){
      var selectedList;
      switch (listType){
        case "like":
        selectedList = $scope.ObjectLike.like;
        break;
        case "dislike":
        selectedList = $scope.ObjectLike.dislike;
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
                "<span class='counter'>"+selectedList[i].like+"</span>" +
                "<div class='like-btn'></div>" +
                "</div>" +
                "</div>" +
                "</div>";

            contador++;
            if(contador === 3){
              selectedCard +="</div>";
              contador = 0;
            }
      }
      $(".list-wrapper").append(selectedCard);

    }

    $scope.collectionsList;

    $scope.getCollectionList = function () {
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
        function (response) {
          console.log(response.data.data)
          $scope.collectionsList = response.data.data;
          console.log($scope.collectionsList)
        },
        function (response) {
          alert("error")
        });
    }

    $scope.getCollectionList();

    $scope.selectCollection = function(selected,target){
      var target = $(event.target);

      selectedCollection = selected.toString();
      $scope.getCollectionNotebooks(selectedCollection);

      target.css("opacity","0.5");
      target.parent().attr("disabled",true);

      $("#collection-modal").modal("hide");
    }

    $scope.getSelectedNotebook = function(idNote){
      $http({
        method: 'GET',
        url: 'https://api.backand.com:443/1/objects/notebook/' + idNote,
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
        }
      }).then(
        function (response) {
          var likes = response.data.like;
          if(typeof(response.data.like) ==  "string"){
            likes = 0;
          }
          likes = parseInt(likes) + 1;     
          $scope.updateLikes(idNote,likes);
        },
        function (response) {
          alert("error")
        });
    }

    $scope.updateLikes = function(id,count){
      $http({
        method:'PUT',
        url: 'https://api.backand.com:443/1/objects/notebook/'+id,
        data:{like:count},
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
        }
      }).then(
        function (response) {
          console.log(response);
        },
        function (response) {
          alert("error")
        });
    }

  });

