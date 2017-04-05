$(document).ready(function(){
	fillCollectionSwiper(blackCollection)
})

var ObjectLike = {
	"like":[],
	"dislike":[]
};

var blackCollection = [{
	"name":"black1",
	"imgSrc":"img/list-covers/black/black-1.png",
	"smallCover":"img/list-covers/black/small/lib1.png"
},{
	"name":"black2",
	"imgSrc":"img/list-covers/black/black-2.png",
	"smallCover":"img/list-covers/black/small/lib2.png"
},{
	"name":"black3",
	"imgSrc":"img/list-covers/black/black-3.png",
	"smallCover":"img/list-covers/black/small/lib3.png"
},{
	"name":"black4",
	"imgSrc":"img/list-covers/black/black-4.png",
	"smallCover":"img/list-covers/black/small/lib4.png"
},{
	"name":"black5",
	"imgSrc":"img/list-covers/black/black-5.png",
	"smallCover":"img/list-covers/black/small/lib5.png"
},{
	"name":"black6",
	"imgSrc":"img/list-covers/black/black-6.png",
	"smallCover":"img/list-covers/black/small/lib6.png"
},{
	"name":"black7",
	"imgSrc":"img/list-covers/black/black-7.png",
	"smallCover":"img/list-covers/black/small/lib7.png"
},{
	"name":"black8",
	"imgSrc":"img/list-covers/black/black-8.png",
	"smallCover":"img/list-covers/black/small/lib8.png"
},{
	"name":"black9",
	"imgSrc":"img/list-covers/black/black-9.png",
	"smallCover":"img/list-covers/black/small/lib9.png"
},{
	"name":"black10",
	"imgSrc":"img/list-covers/black/black-10.png",
	"smallCover":"img/list-covers/black/small/lib10.png"
},{
	"name":"black11",
	"imgSrc":"img/list-covers/black/black-1.png",
	"smallCover":"img/list-covers/black/small/lib11.png"
}]

function fillObject(category,item){
	eval("ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\")})");
	//Objeto.push({"coleccion":item.data("coleccion"),"nombre":item.data("nombre"),"imagen":item.data("imagen")});
	console.log(ObjectLike)
}

function goTo(destiny){
	$(".section").addClass("hidden")
	$(destiny).toggleClass("hidden")
}

function toggleHeaderBtn(btn){
	$(".header .btn").addClass("hidden");
	$(btn).toggleClass("hidden");
	
}

function togglePreferencesList(selection){
	$(".preferences-control .btn").removeClass("active")
	$(selection).addClass("active")
}

function changeContainer(){
	$(".img-logo").toggleClass("hidden");
	if($(".main-container").hasClass("container")){
		$(".main-container").removeClass("container");
		$(".main-container").addClass("container-fluid");
	}else{
		$(".main-container").addClass("container");
		$(".main-container").removeClass("container-fluid");
	}
	
}

function clickPanel(selected){
	console.log(selected);
	goTo('.detail-wrapper');
	changeContainer();
	toggleHeaderBtn('.btn-back-white');
}

function fillCollectionSwiper(collection){
	console.log(collection)
	var selectedCollection = collection;

	if (collection == undefined){
		var selectedCollection = blackCollection
	}
	console.log(selectedCollection)
	$("#swipe-wrapper ul").empty()
	for(i=0; i<selectedCollection.length; i++){
		var swipePanel = 	"<li class='pane pane"+(i+1)+"' data-coleccion='black' data-nombre='Black "+(i+1)+"' data-imagen='"+selectedCollection[i].smallCover+"'>"+
						"<div class='img-wrapper'> <img src='"+selectedCollection[i].imgSrc+"' alt=''> </div>"+
						"<p class='slide-name'>Black</p>"+
						"<div class='like'></div>"+
						"<div class='dislike'></div>"+
						"<div class='like-btn'></div></li>"
		$("#swipe-wrapper ul").append(swipePanel)
	}
	/**
	 * jTinder initialization
	 */
	$("#swipe-wrapper").jTinder({
		// dislike callback
	    onDislike: function (item) {
		    // set the status text
	        $('#status').html('Dislike image ' + (item.index()+1));
			fillObject("dislike",item);
	    },
		// like callback
	    onLike: function (item) {
		    // set the status text
	        $('#status').html('Like image ' + (item.index()+1));
			fillObject("like",item);
	    },
		animationRevertSpeed: 200,
		animationSpeed: 400,
		threshold: 1,
		likeSelector: '.like',
		dislikeSelector: '.dislike'
	});

	/**
	 * Set button action to trigger jTinder like & dislike.
	 */
	$('.actions .like, .actions .dislike').click(function(e){
		e.preventDefault();
		$("#swipe-wrapper").jTinder($(this).attr('class'));
	});
}

function fillPreferencesList(listType){
	var selectedList;
	switch (listType){
		case "like":
		selectedList = ObjectLike.like;
		console.log(selectedList)
		break;

		case "dislike":
		selectedList = ObjectLike.dislike;
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


