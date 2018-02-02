$(function(){
	if(sessionStorage.authorize != 1){
		window.location = 'login.html';
	}
	$("#cname").html(sessionStorage.company+"-"+sessionStorage.username);
	var _html = '';
	if(Number(sessionStorage.activeUpload) == 1){
		_html = '<li><a href="import.html"><span class="am-icon-pencil-square-o"></span> 游客信息导入</a></li><li><a href="queryxls.html"><span class="am-icon-pencil-square-o"></span> 游客信息查询（来源：导入）</a></li><li><a href="query.html"><span class="am-icon-pencil-square-o"></span> 游客信息查询（来源：口岸）</a></li><li><a href="line.html"><span class="am-icon-pencil-square-o"></span> 航班信息维护</a></li>';
	}else{
		_html = '<li><a href="query.html"><span class="am-icon-pencil-square-o"></span> 游客信息查询</a></li><li><a href="line.html"><span class="am-icon-pencil-square-o"></span> 航班信息维护</a></li>';
	}
	$('.admin-sidebar-list').html(_html);
});

function exitUser(){
	sessionStorage.authorize = 0;
	window.location = 'login.html';
}