/**
 * 这里是书籍列表模块
 * @type {[type]}
 */
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $state, $stateParams) {
	$scope.filterOptions = {
		filterText: "",
		useExternalFilter: true
	};
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [5, 10, 20],
		pageSize: 5,
		currentPage: 1
	};
	$scope.setPagingData = function(data, page, pageSize) {
		var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		$scope.books = pagedData;
		$scope.totalServerItems = data.length;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	//这里可以根据路由上传递过来的bookType参数加载不同的数据
	console.log($stateParams);
	$scope.getPagedDataAsync = function(pageSize, page, searchText) {
		setTimeout(function() {
			var data;
			if (searchText) {
				var ft = searchText.toLowerCase();
				$http.get('../data/books' + $stateParams.bookType + '.json')
					.success(function(largeLoad) {
						data = largeLoad.filter(function(item) {
							return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
						});
						$scope.setPagingData(data, page, pageSize);
					});
			} else {
				$http.get('../data/books' + $stateParams.bookType + '.json')
					.success(function(largeLoad) {
						$scope.setPagingData(largeLoad, page, pageSize);
					});
			}
		}, 100);
	};

	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

	$scope.$watch('pagingOptions', function(newVal, oldVal) {
		if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		}
	}, true);
	$scope.$watch('filterOptions', function(newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
		}
	}, true);

	$scope.gridOptions = {
		data: 'books',
		rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
			'<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
			'<div ng-cell></div>' +
			'</div></div>',
		multiSelect: false,
		enableCellSelection: true,
		enableRowSelection: false,
		enableCellEdit: true,
		enablePinning: true,
		columnDefs: [{
			field: 'index',
			displayName: '序号',
			width: 60,
			pinnable: false,
			sortable: false
		}, {
			field: 'name',
			displayName: '书名',
			enableCellEdit: true
		}, {
			field: 'author',
			displayName: '作者',
			enableCellEdit: true,
			width: 220
		}, {
			field: 'pubTime',
			displayName: '出版日期',
			enableCellEdit: true,
			width: 120
		}, {
			field: 'price',
			displayName: '定价',
			enableCellEdit: true,
			width: 120,
			cellFilter: 'currency:"￥"'
		}, {
			field: 'bookId',
			displayName: '操作',
			enableCellEdit: false,
			sortable: false,
			pinnable: false,
			cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
		}],
		enablePaging: true,
		showFooter: true,
		totalServerItems: 'totalServerItems',
		pagingOptions: $scope.pagingOptions,
		filterOptions: $scope.filterOptions
	};
});

/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {
	console.log($stateParams);
	//请模仿上面的代码，用$http到后台获取数据，把这里的例子实现完整

});

/**
 * 自定义filter模块
 * @type {[type]}
 */
var tanktest = angular.module('tanktest', []);
tanktest.filter('tankreplace', function() {
	return function(input) {
		return input.replace(/tank/, "str1")
	};
});

/**
 * http服务模块
 * @type {[type]}
 */
var httptest = angular.module('httptest', []);
httptest.controller('HttpCtrl', function($scope, $http) {
	$scope.getDate = function() {
			$http.get('http://117.121.26.83:1338/product/getdetail?productId=310').
			success(function(data, status, headers, config) {
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				console.log("error");
			});
		},
		$scope.postDate = function() {
			$http.post('http://www.4000191177.com:8080/service/getTotal').
			success(function(data, status, headers, config) {
				console.log(data);
			}).
			error(function(data, status, headers, config) {
				console.log("error");
			});
		}
});

/**
 * location模块
 * @type {[type]}
 */
var locationtest = angular.module('locationtest', []);
locationtest.controller('LocationCtrl', function($scope, $location) {
	$scope.location_absUrl = $location.absUrl();
	$scope.location_url = $location.url();
	$scope.location_host = $location.host();
	$scope.location_foo = $location.search().foo;
	$scope.location_baz = $location.search()['baz'];
});

var factoryApp = angular.module("factoryApp", []);
/*定义一个工厂对象，里面有一个乘法的方法multiply*/
factoryApp.factory('MathService', function() {
	var factory = {};
	factory.multiply = function(a, b) {
		return a * b;
	}
	return factory;
});
/*定义一个服务，计算次方*/
factoryApp.service('CalcService', function(MathService) {
	this.quare = function(a) {
		return MathService.multiply(a, a);
	}
});
/*在控制器里调用service*/
factoryApp.controller('CalcController', function($scope, CalcService, MathService) {
	$scope.square = function() {
		$scope.result = CalcService.quare($scope.number);
	}
});

var repeatApp = angular.module("repeatApp", []);
repeatApp.controller("CartController", function($scope) {
	$scope.items = [{
		name: "商品1",
		quantity: 1,
		price: 199.00
	}, {
		name: "商品2",
		quantity: 1,
		price: 139.00
	}, {
		name: "商品3",
		quantity: 2,
		price: 84.20
	}];

	$scope.remove = function(index) {
		$scope.items.splice(index, 1);
	}
});

var applyApp = angular.module("applyApp", []);
applyApp.controller("applyCtrl", function($scope) {
	$scope.message = "Waiting 2000ms for update";
	setTimeout(function() {　　
		$scope.$apply(function() {　　
			$scope.message = "Timeout called!";
		});
	}, 2000);
});

var appModule = angular.module('directiveapp', []);
appModule.directive('hello', function() {
	return {
		restrict: 'E',
		template: '<div>Hi there</div>',
		replace: true
	};
});
appModule.directive('hello2', function() {
	return {
		restrict: 'E',
		template: '<div>Hi there <span ng-transclude></span></div>',
		transclude: true
	};
});

var expanderModule = angular.module('expanderModule', []);
expanderModule.directive('expander', function() {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		scope: {
			title: '=expanderTitle'
		},
		template: '<div>' + '<div class="title" ng-click="toggle()">{{title}}</div>' + '<div class="body" ng-show="showMe" ng-transclude></div>' + '</div>',
		link: function(scope, element, attrs) {
			scope.showMe = false;
			scope.toggle = function toggle() {
				scope.showMe = !scope.showMe;
			}
		}
	}
});
expanderModule.controller('SomeController', function($scope) {
	$scope.title = '点击展开';
	$scope.text = '这里是内部的内容。';
});

var resApp = angular.module('resApp', []);
resApp.controller('resCtrl', function($scope) {
	$scope.ress = [{
		type: "视频",
		title: "AngularJS实战",
		url: "http://www.imooc.com/learn/156"
	}, {
		type: "文章",
		title: "angularjs directive 实例 详解",
		url: "http://blog.51yip.com/jsjquery/1607.html"
	}];
});

var ftitAppModule = angular.module('ftitApp', []);
ftitAppModule.controller('WeiboController', function($scope) {
	$scope.toWeibo = function() {
		window.open('http://weibo.com/cruisesh?topnav=1&wvr=6&topsug=1');
	}
});

var navApp = angular.module('navApp', []);
navApp.controller('NavController', function($scope) {
	$scope.navigateTo = function(i) {
		$('.nav_navigate a').removeClass('active');
		$('.nav_navigate a').eq(i).addClass('active');
		if (i == 0) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 热点新闻');
		} else if (i == 1) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 紧急公告');
		}
	}
	$scope.ServicesTo = function(i) {
		ServicesTo(i);
	}
	gotop();
});

var adminApp = angular.module('adminApp', []);
adminApp.controller('AdminController', function($scope, $interval) {
	var setInfo = function() {
		var d = new Date();
		$scope.today = d.toLocaleString();
		if ((d.getHours() > 10 && d.getMinutes() > 15) && d.getHours() < 13) {
			$scope.info = "现在是午休时间,不要光顾着工作,要记得吃午饭哦!";
		} else if ((d.getHours() > 16 && d.getMinutes() > 59) && (d.getHours() < 9 && d.getMinutes() < 31)) {
			$scope.info = "现在是下班时间,做点丰富生活的事情吧,不要总是加班!";
		} else {
			$scope.info = "现在是上班时间,请合理安排好您一天的工作内容!";
		}
	}
	setInfo();
	var timer = $interval(function() {
		setInfo();
	}, 1000);

	$scope.add = function(view) {
		window.location = 'management.html#/management/' + view;
	}
});

var listApp = angular.module('listApp', []);
listApp.controller('newsFormController', function($scope, $http, $location, $state) {
	$scope.getDocById = function() {
		var l = $location.absUrl();
		var arr1 = l.split("?id=");
		var editid = arr1[1];
		$.ajax({
			type: "post",
			url: hosts + "news/getByIdAndNext",
			data: {
				id: editid
			},
			success: function(data) {
				//console.log(data);
				$scope.data = data;
				//console.log(data[0].title);
				$('#title').html(data[0].title);
				var s = data[0].source ? data[0].source : "";
				$('#publishAt').html(new Date(data[0].publishAt).toLocaleString() + " 来源:" + s);
				$('#post').html(data[0].post);
				if (data[0].front[0].title) {
					$('#pfront').html('上一篇 : <span onclick="openDoc(' + data[0].front[0].id + ')">' + data[0].front[0].title + '</span>');
				}
				if (data[0].next[0].title) {
					$('#pnext').html('下一篇 : <span onclick="openDoc(' + data[0].next[0].id + ')">' + data[0].next[0].title + '</span>');
				}
			}
		});
	}
	$scope.openDoc = function(page, id) {
		if (page == 'news' || !page) {
			window.sessionStorage.setItem("newsid", id);
			window.location = '#/index/trends/newsform?id=' + id;
			window.location.reload();
		}
	}
	var newsitems = window.sessionStorage.getItem("newsitems");
	newsitems = newsitems.replace(/red/g, "gray");
	$scope.items = ($.parseJSON(newsitems));
});

var proApp = angular.module('proApp', []);
proApp.controller('proController', function($scope, $http, $location, $state) {

	$scope.toPages = function(i) {
		gotop();
		window.location = "/src/#/index/product?p="+i;
		window.location.reload();
	}
});	

listApp.controller('listController', function($scope, $http, $location, $state) {
	var toPage = function(i) {
		//console.log(i);
		window.sessionStorage.setItem("PageNum", i);
		var PageNum = window.sessionStorage.getItem("PageNum");
		PageNum = PageNum ? PageNum : 1;
		$http({
			url: hosts + 'news/get',
			method: 'POST',
			data: {
				indexPage: PageNum,
			}
		}).success(function(data) {
			var d = data.record;
			var l = -1;
			for (var i in d) {
				l++;
			}
			for (var i in d) {
				if (i == 0) {
					if (i == l) {
						d[i].img = 'red_0';
					} else {
						d[i].img = 'red_1';
					}
				} else if (i == l) {
					d[i].img = 'red_3';
				} else {
					d[i].img = 'red_2';
				}
			}
			$scope.items = d;

			//将item缓存到session里
			window.sessionStorage.setItem("newsitems", JSON.stringify(d));
			var iPa = PageNum;
			iPa = iPa ? iPa : 1;
			var pager = '[';
			for (var i = 1; i < data.totalpage + 1; i++) {
				var hasClass = "";
				if (i == iPa) {
					hasClass = "am-active";
				}
				var tmp_p = '{"id":' + i + ',"class":"' + hasClass + '"}';
				if (i == data.totalpage) {
					pager += tmp_p;
				} else {
					pager += tmp_p + ',';
				}

			}
			pager += ']';
			//console.log(pager);
			$scope.pages = $.parseJSON(pager);
		}).error(function() {
			console.log("error");
		});
	}

	toPage(1);

	$scope.toPages = function(i) {
		gotop();
		toPage(i);
	}

	$scope.openDoc = function(page, id) {
		if (page == 'news') {
			window.sessionStorage.setItem("newsid", id);
			window.location = '#/index/trends/newsform?id=' + id;
			//$state.go('index.trends.newsform#id='+id,{data: id},{reload:true});   
		}
	}

	$scope.getDocById = function() {
		var l = $location.absUrl();
		var arr1 = l.split("?id=");
		var editid = arr1[1];
		$.ajax({
			type: "post",
			url: hosts + "news/getById",
			data: {
				id: editid
			},
			success: function(data) {
				$scope.data = data;
				//console.log(data[0].title);
				$('#title').html(data[0].title);
				$('#publishAt').html(new Date(data[0].publishAt).toLocaleString());
				$('#post').html(data[0].post);
			}
		});
	}
});

listApp.controller('noticeController', function($scope, $http, $location, $state) {
	var toPage = function(i) {
		//console.log(i);
		window.sessionStorage.setItem("PageNum", i);
		var PageNum = window.sessionStorage.getItem("PageNum");
		PageNum = PageNum ? PageNum : 1;
		$http({
			url: hosts + 'notice/get',
			method: 'POST',
			data: {
				indexPage: PageNum,
			}
		}).success(function(data) {
			var d = data.record;
			var l = -1;
			for (var i in d) {
				l++;
			}
			for (var i in d) {
				if (i == 0) {
					if (i == l) {
						d[i].img = 'red_0';
					} else {
						d[i].img = 'red_1';
					}
				} else if (i == l) {
					d[i].img = 'red_3';
				} else {
					d[i].img = 'red_2';
				}
			}
			$scope.items = d;
			var iPa = PageNum;
			iPa = iPa ? iPa : 1;
			var pager = '[';
			for (var i = 1; i < data.totalpage + 1; i++) {
				var hasClass = "";
				if (i == iPa) {
					hasClass = "am-active";
				}
				var tmp_p = '{"id":' + i + ',"class":"' + hasClass + '"}';
				if (i == data.totalpage) {
					pager += tmp_p;
				} else {
					pager += tmp_p + ',';
				}

			}
			pager += ']';
			console.log(pager);
			$scope.pages = $.parseJSON(pager);
		}).error(function() {
			console.log("error");
		});
	}

	toPage(1);

	$scope.toPages = function(i) {
		toPage(i);
	}

	$scope.openDoc = function(page, id) {
		if (page == 'notice') {
			window.sessionStorage.setItem("noticeid", id);
			window.location = '#/index/trends/noticeform?id=' + id;
			//$state.go('index.trends.newsform#id='+id,{data: id},{reload:true});   
		}
	}

	$scope.getDocById = function() {
		var l = $location.absUrl();
		var arr1 = l.split("?id=");
		var editid = arr1[1];
		$.ajax({
			type: "post",
			url: hosts + "notice/getById",
			data: {
				id: editid
			},
			success: function(data) {
				$scope.data = data;
				//console.log(data[0].title);
				$('#title').html(data[0].title);
				$('#publishAt').html(new Date(data[0].publishAt).toLocaleString());
				//公告内容需要做换行的转换
				var post = data[0].post;
				$('#post').html(post.replace(/\n/g, "<br/>"));
			}
		});
	}
});

var headerApp = angular.module('headerApp', []);
headerApp.controller('headerController', function($scope) {
	$scope.HeaderTo = function(i) {
		$('.nav_navigate a').removeClass('active');
		$('.nav_navigate a').eq(i).addClass('active');
		if (i == 0) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 热点新闻');
		} else if (i == 1) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 紧急公告');
		}
	}
	$scope.ServicesTo = function(i) {
		ServicesTo(i);
	}
	$scope.URLTo = function(page) {
		gotopQ();
		window.location = '#/index/' + page;
		window.location.reload();
	}
	$scope.toTop = function(i) {
		gotop();
	}
});

headerApp.controller('footerController', function($scope) {
	$scope.HeaderTo = function(i) {
		$('.nav_navigate a').removeClass('active');
		$('.nav_navigate a').eq(i).addClass('active');
		if (i == 0) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 热点新闻');
		} else if (i == 1) {
			$('#pathinfo').html('<a href="#/index">首页</a> > 行业动态 > 紧急公告');
		}
	}
	$scope.ServicesTo = function(i) {
		ServicesTo(i);
	}
	$scope.URLTo = function(page) {
		gotopQ();
		window.location = '#/index/' + page;
		window.location.reload();
	}
	$scope.toTop = function(i) {
		gotop();
	}
});

headerApp.controller('homeController', function($scope, $http, $sce) {
	setBD(1);
	setFW(1);
	/*计算行程周历*/
	var d = new Date;
	var w = d.getDay();
	var n = (w == 0 ? 7 : w) - 1;
	var str1 = "一;二;三;四;五;六;日";
	var tmp1 = str1.split(";");
	var html = "";
	$http({
		url: hosts + 'notice/getcalAll',
		method: 'POST'
	}).success(function(data) {
		d.setDate(d.getDate() - n);
		for (i = 0; i < 7; i++) {
			//var y = (d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.getDay() + '<br>');
			if(w==0){
				w = 7;
			}
			if(i == (w - 1)){
				html += "<li class='active'>";
			}else{
				html += "<li>";
			}
			html += "<div class='line_left'>" + d.Format("yyyy-MM-dd") + "<br/>周" + tmp1[i] + "</div>";
			html += "<div class='line_right line_cruise'>";
			var c_color = "5C5C5C";
			for(var j in data){
				if(data[j].datestart == d.Format("yyyy-MM-dd")){
					switch(data[j].cruiseName){
					case "蓝宝石公主号":
								  c_color = "72C7E1";
								  break;
								case "海洋水手号":
								  c_color = "293E92";	
								  break;
								case "赛琳娜号":
								  c_color = "FEA52F";	
								  break;
								case "海洋量子号":
								  c_color = "293E92";	
								  break;
								case "歌诗达幸运号":
								  c_color = "FEA52F";	
								  break;
								case "天海新世纪号":
								  c_color = "8FC31F";	
								  break;
								case "千禧年号":
								  c_color = "BDA2CD";	
								  break;
								case "维多利亚号":
								  c_color = "FEA52F";	
								  break;
								}
					html += "<p style='font-weight:bold;color:#"+c_color+"'>● "+data[j].cruiseName+"</p>";
				}
			}
			html += "</div>";
			html += "<div class='line_rightr'>";
			for(var j in data){
				if(data[j].datestart == d.Format("yyyy-MM-dd")){
					html += "<p>"+data[j].txtLine+"</p>";
				}
			}
			html += "</div>";
			html += "</li>";
			d.setDate(d.getDate() + 1);
		}
		$scope.lineitem = $sce.trustAsHtml(html);
	}).error(function() {
		console.log("error");
	});

	$http({
		url: hosts + 'notice/getemergency',
		method: 'POST'
	}).success(function(data) {
		var publishAt = data[0].publishAt;
		var d = new Date(publishAt);
		publishAt = d.Format("yyyy-MM-dd");
		//console.log(publishAt);
		var today = new Date();
		today = today.Format("yyyy-MM-dd");
		//console.log(today);
		$scope.emergency_notice = $sce.trustAsHtml('<marquee behavior="scroll" contenteditable="false">' + data[0].post + '</marquee>');
		if(publishAt != today){
			$(".notice_div").css("display","none");
		}
	}).error(function() {
		console.log("error");
	});
	/*今日航班*/
	$http({
		url: hosts + 'notice/getcal',
		method: 'POST'
	}).success(function(data) {
		$scope.cals = data;
	}).error(function() {
		console.log("error");
	});
	/*新闻*/
	$http({
		url: hosts + 'news/get',
		method: 'POST'
	}).success(function(data) {
		var o = data.record;
		var arr = [];
		var arr1 = [];
		for (var i in o) {
			var title = o[i].title;
			if (title.length > 18) {
				title = title.substring(0, 18) + '...';
			}
			arr.push($sce.trustAsHtml((o[i].publishAt + '').substring(0, 10) + '<br/>' + title));
			arr1.push(o[i].id);
		}
		$scope.newsarray = arr;
		$scope.id = arr1;
		//$scope.news1 = $sce.trustAsHtml((data.record[0].publishAt).substring(0,10) + '<br/>' + data.record[0].title);
	}).error(function() {
		console.log("error");
	});
	$http({
		url: hosts + 'notice/getemergencyhome',
		method: 'POST'
	}).success(function(data) {
		var o = data;
		var _list = "";
		var d = new Date();
		for (var i in o) {
			var title = o[i].title;
			if (title.length > 20) {
				title = title.substring(0, 20) + '...';
			}
			//_list += '<p>【'+(o[i].publishAt+'').substring(0,10) + '】' + title + '</p>';
			o[i].title = title;
			if(o[i].publishAt > d){
				o[i].class="A"
			}
		}
		$scope.notice_list = o;
	}).error(function() {
		console.log("error");
	});
	$scope.changQuery = function(i) {
		$('.query_d').addClass('none');
		$('#query_' + i).removeClass('none');
	}
	$scope.openDoc = function(page, id) {
		if (page == 'news') {
			window.sessionStorage.setItem("newsid", id);
			window.location = '#/index/trends/newsform?id=' + id;
			//$state.go('index.trends.newsform#id='+id,{data: id},{reload:true});   
		} else if (page == 'notice') {
			window.sessionStorage.setItem("noticeid", id);
			window.location = '#/index/trends/noticeform?id=' + id;
			//$state.go('index.trends.newsform#id='+id,{data: id},{reload:true});   
		}
	}
	$scope.URLTo = function(page) {
		gotopQ();
		window.location = '#/index/' + page;
		window.location.reload();
	}
	$scope.ServicesTo = function(i) {
		ServicesTo(i);
	}
	$scope.toTop = function(i) {
		gotop();
	}
	$scope.booking = function() {
		var bk_name = $("#bk_name").val();
		var bk_email = $("#bk_email").val();
		if (!bk_name) {
			alert("您的姓名没有填写!");
			return false;
		}
		if (!bk_email) {
			alert("您的Email地址没有填写!");
			return false;
		}
		if (!checkEmail(bk_email)) {
			return false;
		}
		alert("订阅成功!");
		$("#bk_name").val("");
		$("#bk_email").val("");
	}
	$scope.linkus = function() {
		var l_name = $("#l_name").val();
		var l_email = $("#l_email").val();
		var l_post = $("#l_post").val();
		if (!l_name) {
			alert("您的姓名没有填写!");
			return false;
		}
		if (!l_email) {
			alert("您的电子邮箱没有填写!");
			return false;
		}
		if (!l_post) {
			alert("您的留言内容没有填写!");
			return false;
		}
		if (!checkEmail(l_email)) {
			return false;
		}
		alert("提交成功！我们会尽快通过邮件和您联系！");
		$("#l_name").val("");
		$("#l_email").val("");
		$("#l_post").val("");
	}
});

function checkEmail(str) {
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	if (!re.test(str)) {
		alert("E-mail格式错误！");
		return false;
	}
	return true;
}

function ServicesTo(i) {
	gotop();
	$('.nav_navigate a').removeClass('active');
	$('.nav_navigate a').eq(i).addClass('active');
	if (i == -1) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 船票查询');
		$('.nav_navigate a').removeClass('active');
	} else if (i == 10) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 航班查询');
	} else if (i == 4) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 边检政策');
	} else if (i == 5) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 海关政策');
	} else if (i == 6) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 检验检疫政策');
	} else if (i == 7) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 旅游局政策');
	} else if (i == 11) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 港口交通');
	} else if (i == 12) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 停车服务');
	} else if (i == 13) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 贵宾服务');
	} else if (i == 14) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > WIFI租赁');
	} else if (i == 15) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 行李服务');
	} else if (i == 16) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 外币兑换');
	} else if (i == 8) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 巴士服务');
	} else if (i == 9) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 保险服务');
	} else if (i == 3) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 登离船流程');
	} else if (i == 2) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 港口指南');
	} else if (i == 1) {
		$('#pathinfo').html('<a href="#/index">首页</a> > 邮轮服务 > 游客注意事项');
	}
}

function gotop() {
	$('body,html').animate({
		scrollTop: 0
	}, 500);
}

function gotopQ() {
	scroll(0, 0);
}

function setBD(i) {
	$('#BD li').removeClass('active');
	$('#BD li').eq(i).addClass('active');
	if (i == 0) {
		var s1 = "皇家加勒比;歌诗达邮轮;丽星邮轮;公主邮轮;挪威邮轮;地中海邮轮";
		var s2 = "1;2;3;4;5;6";
		var s3 = "RCCL;COSTA;STAR;PRINCESS;NCL;MSC";
		var s4 = "Royal Caribbean;Costa Cruises;Star Cruises;Princess Cruises;Norwegian Cruises;MSC Cruises";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for (var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/curisecompany?page=%2Fc_curisecompany_sec%3Fpid*V0" + tmp2[i] + "\"'>";
			html += "<img src='http://www.youlunshidai.com/databaseimages/" + tmp3[i] + "_md.jpg'/>";
			html += "<hgroup>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<h2>" + tmp4[i] + "</h2>";
			html += "</hgroup>";
			html += "</li>";
		}
	} else if (i == 1) {
		var s1 = "地中海;欧洲;加勒比海;阿拉斯加;澳洲新西兰;日韩";
		var s2 = "1;2;3;4;5;6";
		var s3 = "MED;EUR;CAB;ALSK;AUZ;JK";
		var s4 = "Mediterranean;Europe;Caribbean;Alaska;Aotea Aust;Japan | South Korea";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for (var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/destination?page=%2Fc_destination_sec%3Fpid*hq" + tmp2[i] + "\"'>";
			html += "<img src='http://www.youlunshidai.com/databaseimages/" + tmp3[i] + "_md.jpg'/>";
			html += "<hgroup>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<h2>" + tmp4[i] + "</h2>";
			html += "</hgroup>";
			html += "</li>";
		}
	} else if (i == 2) {
		var s1 = "皇家加勒比;歌诗达邮轮;丽星邮轮;公主邮轮;挪威邮轮;地中海邮轮";
		var s2 = "1;2;3;4;5;6";
		var s3 = "RCCL;COSTA;STAR;PRINCESS;NCL;MSC";
		var s4 = "Royal Caribbean;Costa Cruises;Star Cruises;Princess Cruises;Norwegian Cruises;MSC Cruises";
		var tmp1 = s1.split(";");
		var tmp2 = s2.split(";");
		var tmp3 = s3.split(";");
		var tmp4 = s4.split(";");
		var html = "";
		for (var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"" + "#/index/curisecompany?page=%2Fc_curisecompany_sec%3Fpid*V0" + tmp2[i] + "\"'>";
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

function setFW(i) {
	$('#FW li').removeClass('active');
	$('#FW li').eq(i).addClass('active');
	if (i == 0) {
		var s1 = "天海新世纪号;歌诗达赛琳娜号;歌诗达大西洋号;歌诗达幸运号;歌诗达维多利亚号";
		var tmp1 = s1.split(";");
		var s2 = "qn_1;qn_2;AT;FO;vi";
		var tmp2 = s2.split(";");
		var html = "";
		for (var i = 0; i < tmp1.length; i++) {
			html += "<li onclick='window.location=\"#/index/services/note\"'>";
			html += "<figure>";
			html += "<img src='../../src/image/" +tmp2[i]+ ".jpg'/>";
			html += "<div>";
			html += "<h1>" + tmp1[i] + "</h1>";
			html += "<img src='../../src/image/go.png' />";
			html += "</div>";
			html += "<p>" + tmp1[i] + "登轮须知</p>";
			html += "</figure>";
			html += "</li>";
		}
	}
	$(".qn").html(html);
}

Date.prototype.Format = function(fmt) {
	var d = this;
	var o = {
		"M+": d.getMonth() + 1, //月份
		"d+": d.getDate(), //日
		"h+": d.getHours(), //小时
		"m+": d.getMinutes(), //分
		"s+": d.getSeconds(), //秒
		"q+": Math.floor((d.getMonth() + 3) / 3), //季度
		"S": d.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}