$(function(){
	if(sessionStorage.authorize != 1){
		window.location = 'login.html';
	}
	$("#cname").html(sessionStorage.company+"-"+sessionStorage.username);
});

function exitUser(){
	sessionStorage.authorize = 0;
	window.location = 'login.html';
}