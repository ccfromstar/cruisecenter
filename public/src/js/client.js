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

function setFW(i) {
	$('#FW li').removeClass('active');
	$('#FW li').eq(i).addClass('active');
	if(i == 0) {
		var s1 = "天海新世纪号;歌诗达大西洋号;歌诗达幸运号;歌诗达维多利亚号;歌诗达赛琳娜号";
		var tmp1 = s1.split(";");
		var s2 = "qn_3;AT;FO;vi;qn_2";
		var tmp2 = s2.split(";");
		var html = "";
		/*取3个随机数*/
		var arr1 = randUnique(0,(tmp1.length - 1),3);
		var r1 = arr1[0];
		var r2 = arr1[1];
		var r3 = arr1[2];
		//console.log(r1+";"+r2+";"+r3);
		for(var i = 0; i < tmp1.length; i++) {
			if(i == r1 || i == r2 || i == r3) {
				html += "<li onclick='window.location=\"#/index/services/note?page="+i+"\"'>";
				html += "<figure>";
				html += "<img src='../../src/image/" + tmp2[i] + ".jpg'/>";
				html += "<div>";
				html += "<h1>" + tmp1[i] + "</h1>";
				html += "<img src='../../src/image/go.png' />";
				html += "</div>";
				html += "<p>" + tmp1[i] + "登轮须知</p>";
				html += "</figure>";
				html += "</li>";
			}
		}
	} else if(i == 1) {
		var s1 = "港口指南;登离船流程;边检政策";
		var s2 = "guide;boarding;immigration";
		var s3 = "passenger_map_pic.gif;passenger_departure_pic.gif;W_EDIT_1458114141m377.png";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var html = "";
		for(var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"#/index/services/" + tmp2[i] + "\"'>";
			html += "<figure>";
			html += "<img src='http://o9mbu84vh.bkt.clouddn.com/" + tmp3[i] + "'/>";
			html += "<div>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<img src='../../src/image/go.png' />";
			html += "</div>";
			html += "<p>" + tmp1[i] + "须知</p>";
			html += "</figure>";
			html += "</li>";
		}
	} else if(i == 2) {
		var s1 = "航班查询;港口交通;停车服务";
		var s2 = "cal;traffic;parking";
		var s3 = "42-15061Q41Q0H5.jpg;W_EDIT_1426490125Y4WY.jpg;transport_parking_pic.gif";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var html = "";
		for(var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"#/index/services/" + tmp2[i] + "\"'>";
			html += "<figure>";
			html += "<img src='http://o9mbu84vh.bkt.clouddn.com/" + tmp3[i] + "'/>";
			html += "<div>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<img src='../../src/image/go.png' />";
			html += "</div>";
			html += "<p>" + tmp1[i] + "须知</p>";
			html += "</figure>";
			html += "</li>";
		}
	}
	$(".qn").html(html);
}

/** 
 * 获取不重复随机数 
 * @param integer start 随机数最小值 
 * @param integer end 随机数最大值 
 * @param integer size 随机数获取数量 最小为1，默认1 
 * @return integer|array 如 1或者[2,4,7,9] 
 */  
function randUnique(start, end, size){  
    // 全部随机数值  
    var allNums = new Array;  
  
    // 判断获取随机数个数  
    size = size ? (size > end - start ? end - start : size) : 1;  
  
    // 生成随机数值区间数组  
    for (var i = start, k = 0; i <= end; i++, k++) {  
    allNums[k] = i;  
    }  
  
    // 打撒数组排序  
    allNums.sort(function(){ return 0.5 - Math.random(); });  
  
    // 获取数组从第一个开始到指定个数的下标区间  
    return allNums.slice(0, size);  
}  

function setBD(i) {
	$('#BD li').removeClass('active');
	$('#BD li').eq(i).addClass('active');
	if(i == 0) {
		var s1 = "皇家加勒比;歌诗达邮轮;丽星邮轮;公主邮轮;挪威邮轮;地中海邮轮";
		var s2 = "1;2;3;4;5;6";
		var s3 = "RCCL;COSTA;STAR;PRINCESS;NCL;MSC";
		var s4 = "Royal Caribbean;Costa Cruises;Star Cruises;Princess Cruises;Norwegian Cruises;MSC Cruises";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for(var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/curisecompany?page=%2Fc_curisecompany_sec%3Fpid*V0" + tmp2[i] + "\"'>";
			html += "<img src='http://www.youlunshidai.com/databaseimages/" + tmp3[i] + "_md.jpg'/>";
			html += "<hgroup>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<h2>" + tmp4[i] + "</h2>";
			html += "</hgroup>";
			html += "</li>";
		}
	} else if(i == 1) {
		var s1 = "地中海;欧洲;加勒比海;阿拉斯加;澳洲新西兰;日韩";
		var s2 = "1;2;3;4;5;6";
		var s3 = "MED;EUR;CAB;ALSK;AUZ;JK";
		var s4 = "Mediterranean;Europe;Caribbean;Alaska;Aotea Aust;Japan | South Korea";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for(var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/destination?page=%2Fc_destination_sec%3Fpid*hq" + tmp2[i] + "\"'>";
			html += "<img src='http://www.youlunshidai.com/databaseimages/" + tmp3[i] + "_md.jpg'/>";
			html += "<hgroup>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<h2>" + tmp4[i] + "</h2>";
			html += "</hgroup>";
			html += "</li>";
		}
	} else if(i == 2) {
		var s1 = "家庭邮轮;老年邮轮;奢华邮轮;会议邮轮;探险邮轮;环球邮轮";
		var s2 = "1;2;3;4;5;6";
		var s3 = "theme1_family;theme2_sunset;theme3_luxury;theme4_group;theme5_explore;theme6_world";
		var s4 = "Family Cruise;Sunset Cruise;Luxury Cruise;Group Cruise;Explore Cruise;World Cruise";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for(var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/theme?page=%2Fc_theme_sec%3Fid*T000" + tmp2[i] + "\"'>";
			html += "<img src='http://www.youlunshidai.com/databaseimages/" + tmp3[i] + "_md.jpg'/>";
			html += "<hgroup>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<h2>" + tmp4[i] + "</h2>";
			html += "</hgroup>";
			html += "</li>";
		}
	}
	$(".port").html(html);
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

function gotop_quickly() {
	scroll(0, 0);
}

function openDoc(id) {
	window.sessionStorage.setItem("newsid", id);
	window.location = '#/index/trends/newsform?id=' + id;
	window.location.reload();
}

function iFrameHeight() {

	var ifm = document.getElementById("iframepage");
	var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
	if(ifm != null && subWeb != null) {
		ifm.height = subWeb.body.scrollHeight;
		//ifm.width = subWeb.body.scrollWidth;
		ifm.width = 1000;
	}
	ifm.style.display = "block";
	ifm.style.marginTop = "-20px";
}

function iFrameHeightP() {
	var ifm = document.getElementById("iframepage");
	ifm.height = 2500;
	ifm.width = 1000;
	ifm.style.display = "block";
	ifm.style.marginTop = "-20px";
}

function showNote(i) {
	$('.note_post').hide();
	$('#note_' + i).show();
	$('.note_title li').removeClass('active');
	$('.note_title li').eq(i).addClass('active');
	gotop();
}

$(window).scroll(function() {
	currTop = $(window).scrollTop();
	/*首页左侧浮动栏*/
	var nav_top = 683;
	//console.log(currTop);
	//console.log(nav_top);
	if(currTop < 560) {
		currTop = currTop;
		nav_top = nav_top - currTop;
		//console.log(nav_top);
		$('.left_nav').css('top', nav_top);
	} else {
		$('.left_nav').css('top', 123);
	}
	/*游客注意事项浮动栏*/
	var nav_top = -162;
	//console.log(currTop);
	//console.log(nav_top);
	if(currTop > 200) {
		currTop = currTop;
		nav_top = nav_top + currTop;
		//console.log(nav_top);
		$('.note_title').css('top', nav_top);
	} else {
		$('.note_title').css('top', 0);
	}
});

setBD(1);