var ObjectLike = {
	"like":[],
	"dislike":[]
};

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