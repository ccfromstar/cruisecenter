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

var expanderModule=angular.module('expanderModule', []);
expanderModule.directive('expander', function() {
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        scope : {
            title : '=expanderTitle'
        },
        template : '<div>'
                 + '<div class="title" ng-click="toggle()">{{title}}</div>'
                 + '<div class="body" ng-show="showMe" ng-transclude></div>'
                 + '</div>',
        link : function(scope, element, attrs) {
            scope.showMe = false;
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
            }
        }
    }
});
expanderModule.controller('SomeController',function($scope) {
    $scope.title = '点击展开';
    $scope.text = '这里是内部的内容。';
});

var resApp = angular.module('resApp',[]);
resApp.controller('resCtrl',function($scope){
	$scope.ress = [
		{type:"视频",title:"AngularJS实战",url:"http://www.imooc.com/learn/156"},
		{type:"文章",title:"angularjs directive 实例 详解",url:"http://blog.51yip.com/jsjquery/1607.html"}
	];
});

var ftitAppModule = angular.module('ftitApp',[]);
ftitAppModule.controller('PostListController', function ($scope) {
        // 设置轮播图图片间隔
        $scope.myInterval = 5000;
        // 轮播图数据初始化
        var slides = $scope.slides = [];
        // 添加轮播图源
        slides.push({ image: '../../src/image/bg1.jpg', text: '亲爱的你，情人节快乐' });
        slides.push({ image: '../../src/image/bg1.jpg', text: '亲爱的你，情人节快乐' });
        slides.push({ image: '../../src/image/bg1.jpg', text: '亲爱的你，情人节快乐' });
});
