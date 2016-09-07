function showlist(i) {
	$('.nav_div').hide();
	$('#nav' + i).slideToggle();
}

function hidelist() {
	$('.nav_div').hide();
}

function showQuery(i) {
	$('.query_left li').removeClass('active');
	$('.query_left li').eq(i).addClass('active');
}

function showfloat(i) {
	$('.float_common').hide();
	$('.float_' + i).show();
}

function hidefloat(i) {
	$('.float_' + i).hide();
}

function gotop() {
	$('body,html').animate({
		scrollTop: 0
	}, 500);
}

function gotop_quickly(){
	scroll(0,0);
}

function openDoc(id) {
	window.sessionStorage.setItem("newsid", id);
	window.location = '#/index/trends/newsform?id=' + id;
	window.location.reload();
}

function iFrameHeight() {
	
	var ifm = document.getElementById("iframepage");
	var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
	if (ifm != null && subWeb != null) {
		ifm.height = subWeb.body.scrollHeight;
		//ifm.width = subWeb.body.scrollWidth;
		ifm.width = 1000;
	}
	ifm.style.display = "block";
	ifm.style.marginTop = "-20px";
}

$(window).scroll(function() {
	currTop = $(window).scrollTop();
	var nav_top = 683;
	//console.log(currTop);
	//console.log(nav_top);
	if (currTop < 560) {
		currTop = currTop;
		nav_top = nav_top - currTop;
		//console.log(nav_top);
		$('.left_nav').css('top', nav_top);
	} else {
		$('.left_nav').css('top', 123);
	}
});