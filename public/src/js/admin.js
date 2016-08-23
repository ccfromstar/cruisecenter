$(function() {
	setInfo();
	setInterval(function() {
		setInfo();
	}, 1000);
});

function setInfo() {
	var d = new Date();
	var today = "现在时间是： " + d.toLocaleString();
	var info = "";
	if ((d.getHours() > 10 && d.getMinutes() > 15) && d.getHours() < 13) {
		info = "现在是午休时间,不要光顾着工作,要记得吃午饭哦!";
	} else if ((d.getHours() > 16 && d.getMinutes() > 59) && (d.getHours() < 9 && d.getMinutes() < 31)) {
		info = "现在是下班时间,做点丰富生活的事情吧,不要总是加班!";
	} else {
		info = "现在是上班时间,请合理安排好您一天的工作内容!";
	}
	$("#homeinfo1").html(today);
	$("#homeinfo2").html(info);
}

function newFrom(page) {
	window.sessionStorage.setItem("mode", "new");
	window.sessionStorage.removeItem("editid");
	window.location = '/' + page;
}

function showErr(info) {
	$('.errorinfo').html('<p>' + info + '</p>').removeClass("none");
	setTimeout(function() {
		$('.errorinfo').addClass("none");
	}, 2000);
}

function saveForm(table) {
	var mode = window.sessionStorage.getItem('mode');
	if (table == 'news') {
		var title = $('#title').val();

		html = editor.html();
		editor.sync();

		var post = $('#post').val();
		var summary = $('#summary').val();

		if (!title) {
			showErr("新闻标题不能为空");
			return false;
		}

		if (!summary) {
			showErr("内容概要不能为空");
			return false;
		}

		$.ajax({
			type: "post",
			url: "/news/create",
			data: {
				mode: mode,
				title: title,
				post: post,
				summary: summary,
				editid: window.sessionStorage.getItem("editid")
			},
			success: function(data) {
				if (data == "300") {
					$('.successinfo').html('<p>保存成功</p>').removeClass("none");
					setTimeout(function() {
						window.location = 'view_news';
					}, 1000);
				}
			}
		});
	}
}

function delDoc(i) {
	if (i == 1) {
		//新闻
		$.ajax({
			type: "post",
			url: "news/del",
			data: {
				id: window.sessionStorage.getItem("delid")
			},
			success: function(data) {
				if (data == "300") {
					toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>删除成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
			}
		});
	}
}

function editDoc(i,id){
	if (i == 1) {
		//新闻
		window.sessionStorage.setItem("editid",id);
		window.sessionStorage.setItem("mode","edit");
		window.location = '/news';
	}
}

function showDelCofirm(id) {
	window.sessionStorage.setItem("delid", id);
	$("#del-confirm").modal();
}

function toPage(page) {
	var $modal = $('#my-modal-loading');
	$modal.modal();

	window.sessionStorage.setItem("indexPage", page);
	var indexPage = window.sessionStorage.getItem("indexPage");
	indexPage = indexPage ? indexPage : 1;

	$.ajax({
		type: "post",
		url: "/news/get",
		data: {
			indexPage: indexPage
		},
		success: function(data) {
			console.log(data);
			var html = "";
			var record = data.record;
			for (var i in record) { 
				html += "<tr>";
				html += "<td>" + record[i].title + "</td>";
				html += "<td>" + record[i].publishAt + "</td>";
				html += "<td>" + record[i].summary + "</td>";
				html += "<td><button type='button' onclick='editDoc(1," + record[i].id + ")' class='am-btn am-btn-default am-btn-xs am-text-secondary'><span class='am-icon-pencil-square-o'></span> 编辑</button>";
				html += "<button type='button' onclick='showDelCofirm(" + record[i].id + ")' class='am-btn am-btn-default am-btn-xs am-text-danger'><span class='am-icon-trash-o'></span> 删除</button></td>";
				html += "</tr>";
			}
			var isFirstPage = data.isFirstPage ? "am-disabled" : "";
			var isLastPage = data.isLastPage ? "am-disabled" : "";
			var pager = "";
			var iPa = Number(window.sessionStorage.getItem("indexPage"));
			iPa = iPa ? iPa : 1;
			for (var i = 1; i < data.totalpage + 1; i++) {
				var hasClass = "";
				if (i == iPa) {
					hasClass = "am-active";
				}

				pager += '<li class="' + hasClass + '"><a href="#" onclick="toPage(' + i + ')">' + i + '</a></li>';

			}
			var pagination = "<li class='" + isFirstPage + "'><a href='#' onClick='toPage(" + (Number(window.sessionStorage.getItem("indexPage")) - 1) + ")'>«</a></li>";
			pagination += pager;
			pagination += "<li class='" + isLastPage + "'><a href='#' onClick='toPage(" + (Number(window.sessionStorage.getItem("indexPage")) + 1) + ")'}>»</a></li>";
			$("#json_tbody").html(html);
			$("#total").html(data.total);
			$('#pagination').html(pagination);
			$modal.modal('close');
		}
	});
}

function loadNews() {
	toPage(1);
}