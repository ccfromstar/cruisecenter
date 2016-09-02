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
				var s = data[0].source?data[0].source:"";
				$('#publishAt').html(new Date(data[0].publishAt).toLocaleString()+ " 来源:" + s);
				$('#post').html(data[0].post);
				if(data[0].front[0].title){
					$('#pfront').html('上一篇 : <span onclick="openDoc('+data[0].front[0].id+')">'+data[0].front[0].title+'</span>');
				}
				if(data[0].next[0].title){
					$('#pnext').html('下一篇 : <span onclick="openDoc('+data[0].next[0].id+')">'+data[0].next[0].title+'</span>');
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
	newsitems = newsitems.replace(/red/g,"gray");
	$scope.items = ($.parseJSON(newsitems));
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
				$('#post').html(data[0].post);
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
});

headerApp.controller('homeController', function($scope, $http, $sce) {
	$http({
		url: hosts + 'notice/getemergency',
		method: 'POST'
	}).success(function(data) {
		$scope.emergency_notice = $sce.trustAsHtml('<marquee behavior="scroll" contenteditable="false">' + data[0].post + '</marquee>');
	}).error(function() {
		console.log("error");
	});
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
		url: hosts + 'notice/get',
		method: 'POST'
	}).success(function(data) {
		var o = data.record;
		var _list = "";
		for (var i in o) {
			var title = o[i].title;
			if (title.length > 22) {
				title = title.substring(0, 22) + '...';
			}
			//_list += '<p>【'+(o[i].publishAt+'').substring(0,10) + '】' + title + '</p>';
			o[i].title = title;
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
});

function ServicesTo(i) {
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
	gotop();
}

function gotop() {
	$('body,html').animate({
		scrollTop: 0
	}, 500);
}