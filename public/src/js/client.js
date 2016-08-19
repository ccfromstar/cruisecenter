function showlist(i) {
	$('.nav_div').hide();
	$('#nav'+i).slideToggle();
}

function showfloat(i){
	$('.float_'+i).show();
}

function hidefloat(i){
	$('.float_'+i).hide();
}

function gotop(){
	$('body,html').animate({scrollTop:0},500);
}

$(window).scroll(function() {
    currTop = $(window).scrollTop();
    var nav_top = 700;
    //console.log(currTop);
    //console.log(nav_top);
    if(currTop < 560){
    	currTop = currTop;
    	nav_top = nav_top - currTop;
    	console.log(nav_top);
    	$('.left_nav').css('top',nav_top);
    }
});