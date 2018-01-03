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
          $(".congrats").css("display","none");
          setTimeout(function() {
             scope.initJtinder();
          }, 400);
        }
      };
  })

 


  .controller('SwipeCtrl', function ($document, $scope,$http, Fact) {
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

    $scope.detailElement;

    $("#collection-modal").modal("show")
    $("#collection-modal").on("hidden.bs.modal",function(e){
      $('#swipe-wrapper').unbind().removeData();
      $scope.initJtinder()
      console.log("closing modal")
    })

    //arreglo que guarda la lista de libretas
    $scope.collectionNotebooks = {};

    $("#collection-modal").modal("show")

    var selectedCollection;
   
    //función para inicializar el plug in de tinder.
    $scope.initJtinder = function() {
      $("#swipe-wrapper").jTinder({
        onDislike: function(item) {
            $('#status').html('Dislike image ' + (item.index() + 1));
            fillObject("dislike", item);
            $(item).addClass("disliked");

            //elimina del arreglo el elemento que ya fue evaluado, esto para que cuando cambiemos de pantalla y regresemos no se esten rpesentando los
            //todos aunque ya los hayamos evaluado
            /*$scope.collectionNotebooks.forEach(function(index, value) {
                if ($scope.collectionNotebooks[value].id == item.data("id")) {
                    $scope.collectionNotebooks.splice(value, 1)
                }
            }, this);*/
        },
        onLike: function(item) {
            $('#status').html('Like image ' + (item.index() + 1));
            fillObject("like", item);
            $(item).addClass("liked")

            /*$scope.collectionNotebooks.forEach(function(index, value) {
                if ($scope.collectionNotebooks[value].id == item.data("id")) {
                    $scope.collectionNotebooks.splice(value, 1)
                }
            }, this);*/
        },
        animationRevertSpeed: 200,
        animationSpeed: 400,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
      });

      $('.actions .like, .actions .dislike').click(function(event) {
        event.preventDefault();
        $("#swipe-wrapper").jTinder($(this).attr('class'));
      });
    }

    $scope.changeView = function(value, image) {
      $scope.selection = value;
      if ($scope.selection == "preferences") {
        setTimeout(function() {
            $scope.fillPreferencesList('like');
        }, 600);

      } else if ($scope.selection == "content") {
          //$("#collection-modal").modal("show")

           if($scope.collectionNotebooks.length == 0){
              $("#collection-modal").modal("show")
            }
      } else {
        $scope.detailElement = image;
        setTimeout(function() {
            $("#img-detail").attr("src", "https://luisvardez.000webhostapp.com/" + image.notebooks.coverSource);
            $(".title-note").text(image.notebooks.name);
            $(".counterLikes").text(image.notebooks.like);
            $(".descriptionNote").text(image.notebooks.descripcion)
        }, 200);
      }


     
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
              console.log( $scope.collectionNotebooks)
          },
          function(response) {
              alert("error")
          }
        );
    }

    $scope.changeView('content');

  
    function fillObject(category, item) {
        if(category == "like"){
          eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\"),\"likedToMale\":item.data(\"likedToMale\"),\"likedToFemale\":item.data(\"likedToFemale\"),\"like\":item.data(\"like\")})");
          $scope.getSelectedNotebook(item.data('id'), category);
        }
        else{
          eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\"),\"likedToMale\":item.data(\"likedToMale\"),\"likedToFemale\":item.data(\"likedToFemale\"),\"dislike\":item.data(\"dislike\"),\"like\":item.data(\"like\")})");
          $scope.getSelectedNotebook(item.data('id'), category);
        }
        
    }
   
    //funciones manipulación de vista
    $scope.toggleHeaderBtn = function(btn) {
        $(".header .btn").addClass("hidden");
        $(btn).toggleClass("hidden");
    }

    $scope.changeContainer = function() {
        $(".img-logo").toggleClass("hidden");
        if ($(".main-container").hasClass("container")) {
            $(".main-container").removeClass("container");
            $(".main-container").addClass("container-fluid");
            $(".main-container .header").addClass("displayN")
        } else {
            $(".main-container").addClass("container");
            $(".main-container").removeClass("container-fluid");
            $(".main-container .header").removeClass("displayN")
        }
    }

    //NOTA: NO ESTA PASANDO LA REFERENCIA DEL ELEMENTO AL QUE SE ESTA DANDO CLICK, AL PARECER POR LA REFERENCIA DE NG-CLICK... VALIDAR
    $scope.togglePreferencesList = function(event) {
        var target = $(event.target)
        $(".preferences-control .btn").removeClass("active");
        target.addClass("active");
    }

    $scope.fillPreferencesList = function(listType) {
        var selectedList;
        switch (listType) {
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
        for (var i = 0; i < selectedList.length; i++) {
          var back = ["Aquamarine","blue","gray", "red", "yellow", "pink", "coral", "cyan", "DarkMagenta", "gold", "HoneyDew", "LightBlue"];
          var rand = back[Math.floor(Math.random() * back.length)];
            if (contador == 0) {
                selectedCard += "<div class='row'>";
            }
            selectedCard += "<div class='col-xs-6 col-sm-4'>" +
                "<div class='list-card'>" +
                "<div class='content-image' style='background:"+rand+";'>"+
                "<img src='https://luisvardez.000webhostapp.com/" + selectedList[i].imagen + "' alt=''></div>" +
                "<div class='detail-card'><p class='card-name'>" + selectedList[i].nombre + "</p>" +
                "<div class='like-count'>" +
                "<span class='counter'>" + selectedList[i].like + "</span>" +
                "<div class='like-btn'></div></div>" +
                "</div>" +
                "</div>" +
                "</div>";

            contador++;
            if($(window).width() < 420){
              if(contador == 2){
                selectedCard += "</div>";
                contador = 0;
              }
            }
            else{
              if(contador === 3) {
                selectedCard += "</div>";
                contador = 0;
              }
            }
        }
        $(".list-wrapper").append(selectedCard);
    }

    $scope.collectionsList;

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
            },
        }).then(
            function(response) {
                console.log(response.data.data)
                $scope.collectionsList = response.data.data;
                console.log($scope.collectionsList)
            },
            function(response) {
                alert("error")
            });
    }

    $scope.getCollectionList();

    $scope.selectCollection = function(selected, target) {
        var target = $(event.target);
        selectedCollection = selected.toString();
        $scope.getCollectionNotebooks(selectedCollection);
        target.css("opacity", "0.5");
        target.parent().unbind().removeData();
        $("#collection-modal").modal("hide");
    }


    var likes;
    var dislikes;
    var likedFemale;
    var likedMale;
    var ageA;
    var ageB;
    var female;
    var male;
    var currentNotebookId;

    $scope.selectionGender = Fact.userGender.gender
    $scope.selectionAges = Fact.userAge.age

    $scope.getSelectedNotebook = function(idNote, statusLikes) {
        currentNotebookId = idNote
        $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/notebook/' + idNote,
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
        }).then(
            function(response) {
                likes = response.data.like;
                dislikes = response.data.dislike;
                likedFemale = response.data.likedToFemale;
                likedMale = response.data.likedToMale;
                ageA = response.data.userAgeA;
                ageB = response.data.userAgeB;
                female = 1;
                male = 1;
                switch(statusLikes){
                  case 'like':
                    if (typeof(response.data.like) == "string") {
                        likes = 0;
                    }
                    likes = parseInt(likes) + 1;
                    if($scope.selectionGender == "H"){
                      if (typeof(response.data.likedToMale) == "string") {
                            likedMale = 0;
                        }
                        likedMale = parseInt(likedMale) + 1;
                    }
                    else{
                      if (typeof(response.data.likedToFemale) == "string") {
                            likedFemale = 0;
                        }
                        likedFemale = parseInt(likedFemale) + 1;
                    }
                    if($scope.selectionAges < 20){
                      if (typeof(response.data.userAgeA) == "string") {
                            ageA = 0;
                        }
                        ageA = parseInt(ageA) + 1;
                    }else{
                        if (typeof(response.data.userAgeB) == "string") {
                            ageB = 0;
                        }
                        ageB = parseInt(ageB) + 1;
                    }
                    break;
                  case 'dislike':
                    if(typeof(response.data.dislike) == "string"){
                      dislikes = 0;
                    }
                    dislikes = parseInt(dislikes) + 1;
                    break;
                }
                $scope.updateLikes(idNote, likes, dislikes, likedFemale, likedMale, ageA, ageB);
                console.log(idNote + " " + likes + " " + dislikes + " " + likedFemale + " " + likedMale + " " + ageA + " " + ageB)
            },
            function(response) {
                alert("error")
            });
        return true;
    }

    $scope.updateLikes = function(id, count, count2, female, male, ageA, ageB) {
        $http({
            method: 'PUT',
            url: 'https://api.backand.com:443/1/objects/notebook/' + id,
            data: {
                like: count,
                dislike: count2,
                likedToFemale: female,
                likedToMale: male,
                userAgeA: ageA,
                userAgeB: ageB
            },
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
        }).then(
            function(response) {
                console.log(response);
            },
            function(response) {
                alert("error")
            });
    }

    $scope.reduceLikes = function() {
      var lastItem = $(".pane:hidden:eq(0)")
      var lastId = $(".pane:hidden:eq(0)").data("id")
      var lastLikes = $(".pane:hidden:eq(0)").data("like")
      var lastDislikes = $(".pane:hidden:eq(0)").data("dislike")
      var lastMales = $(".pane:hidden:eq(0)").data("likedtofemale")
      var lastFemales = $(".pane:hidden:eq(0)").data("likedtomale")
      var lastAgeA = $(".pane:hidden:eq(0)").data("useragea")
      var lastAgeB = $(".pane:hidden:eq(0)").data("userageb")
      console.log(lastLikes +" "+ lastDislikes +" "+ lastMales +" "+ lastFemales +" "+ lastAgeA +" "+ lastAgeB+" "+lastId)
      $http({
            method: 'PUT',
            url: 'https://api.backand.com:443/1/objects/notebook/' + lastId,
            data: {
                like: lastLikes,
                dislike: lastDislikes,
                likedToFemale: lastMales,
                likedToMale: lastFemales,
                userAgeA: lastAgeA,
                userAgeB: lastAgeB
            },
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
        }).then(
            function(response) {
                console.log(response);
            },
            function(response) {
                alert("error")
            });
    }

    $scope.showAction = function (action) {

      eval("$scope.ObjectLike." + action + ".push({\"coleccion\":$scope.detailElement.notebooks.collection,\"nombre\":$scope.detailElement.notebooks.name,\"imagen\":$scope.detailElement.notebooks.listCoverSource,\"like\":$scope.detailElement.notebooks.like})");

      $scope.getSelectedNotebook($scope.detailElement.notebooks.id);
      $scope.collectionNotebooks.forEach(function (index, value) {
        if ($scope.collectionNotebooks[value].id == $scope.detailElement.notebooks.id) {
          $scope.collectionNotebooks.splice(value, 1)
        }
      }, this);

      $(".detail-button a").unbind().removeData();

      $(".detail-button a").click(function (event) {
        event.preventDefault();
      });


      $(".detail-wrapper .card-text").css("opacity", "0");
      $(".detail-wrapper ." + action).css("opacity", "1").queue(function () {
        setTimeout(function () {
          angular.element('.btn-back-white').triggerHandler('click');
        }, 500);
      });

    }

    $scope.undoSelection = function(){
      $scope.cardsEvaluated = $(".pane:hidden").length
      if($scope.cardsEvaluated == 0){
        console.log("no disponible")
        return false
      } else {
         $scope.reduceLikes()
        $('#swipe-wrapper').jTinder('undo');
        //console.log("id "+currentNotebookId+" likes "+likes+" dislikes "+dislikes+ " liked Female "+likedFemale+" likedMale "+likedMale+" ageA "+ageA+" ageB "+ageB)
        //$scope.reduceLikes(currentNotebookId, likes, dislikes, likedFemale, likedMale, ageA, ageB)
       
      }
    }

  });

