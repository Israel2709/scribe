var ObjectLike = {
	"like":[],
	"dislike":[]
};

var blackCollection = [{
	"name":"black1",
	"imgSrc":"img/list-covers/black/black-1.png"
},{
	"name":"black2",
	"imgSrc":"img/list-covers/black/black-2.png"
},{
	"name":"black3",
	"imgSrc":"img/list-covers/black/black-3.png"
},{
	"name":"black4",
	"imgSrc":"img/list-covers/black/black-4.png"
},{
	"name":"black5",
	"imgSrc":"img/list-covers/black/black-5.png"
},{
	"name":"black6",
	"imgSrc":"img/list-covers/black/black-6.png"
},{
	"name":"black7",
	"imgSrc":"img/list-covers/black/black-7.png"
},{
	"name":"black8",
	"imgSrc":"img/list-covers/black/black-8.png"
},{
	"name":"black9",
	"imgSrc":"img/list-covers/black/black-9.png"
},{
	"name":"black10",
	"imgSrc":"img/list-covers/black/black-10.png"
},{
	"name":"black11",
	"imgSrc":"img/list-covers/black/black-1.png"
}]

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

function fillObject(category,item){
	eval("ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\")})");
	//Objeto.push({"coleccion":item.data("coleccion"),"nombre":item.data("nombre"),"imagen":item.data("imagen")});
	console.log(ObjectLike)
}

function goTo(destiny){
	$(".section").addClass("hidden")
	$(destiny).toggleClass("hidden")
}

function toggleHeaderBtn(){
	$(".header .btn").toggleClass("hidden")
}

function togglePreferencesList(selection){
	$(".preferences-control .btn").removeClass("active")
	$(selection).addClass("active")
}

function changeContainer(){
	if($(".main-container").hasClass("container")){
		$(".main-container").removeClass("container");
		$(".main-container").addClass("container-fluid");
	}else{
		$(".main-container").addClass("container");
		$(".main-container").removeClass("container-fluid");
	}
	
}

function noescogi(selected){
	console.log(selected);
	goTo('.detail-wrapper');
	changeContainer()
}

function fillColectionSwiper(collection){

}