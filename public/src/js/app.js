var routerApp = angular.module('routerApp', ['ui.router', 'ngGrid','ftitApp','resApp','expanderModule','applyApp','repeatApp','directiveapp','factoryApp','tanktest','httptest','locationtest', 'BookListModule', 'BookDetailModule']);
/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
routerApp.run(function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
routerApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/index');
	$stateProvider
		.state('index', {
			url: '/index',
			views: {
				'': {
					templateUrl: 'tpls/home.html'
				},
				'header@index': {
					templateUrl: 'tpls/header.html'
				},
				'footer@index': {
					templateUrl: 'tpls/footer.html'
				},
				'main@index': {
					templateUrl: 'tpls/homepage.html'
				}
			}
		})
		.state('index.api', {
			url: '/apilist',
			views: {
				'main@index': {
					templateUrl: 'tpls/apilist.html',
					controller: function($scope) {
						$scope.noanalysis_left = '{{';
					}
				}
			}
		})
		.state('index.api.filter', {
			url: '/filter',
			templateUrl: 'tpls/api/filter.html'
		})
		.state('index.api.http', {
			url: '/http',
			templateUrl: 'tpls/api/http.html'
		})
		.state('index.api.location', {
			url: '/location?foo&baz',
			templateUrl: 'tpls/api/location.html'
		})
		.state('index.api.animate', {
			url: '/animate',
			templateUrl: 'tpls/api/animate.html'
		})
		.state('index.api.factory', {
			url: '/factory',
			templateUrl: 'tpls/api/factory.html'
		})
		.state('index.api.ng-repeat', {
			url: '/ng-repeat',
			templateUrl: 'tpls/api/ng-repeat.html'
		})
		.state('index.api.apply', {
			url: '/apply',
			templateUrl: 'tpls/api/apply.html'
		})
		.state('index.api.directive', {
			url: '/directive',
			templateUrl: 'tpls/api/directive.html'
		})
		.state('index.resource', {
			url: '/resource',
			views: {
				'main@index': {
					templateUrl: 'tpls/resource.html'
				}
			}
		})
		.state('index.question', {
			url: '/question',
			views: {
				'main@index': {
					templateUrl: 'tpls/question.html'
				}
			}
		})
		.state('booklist', {
			url: '/{bookType:[0-9]{1,4}}',
			views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
				'': {
					templateUrl: 'tpls/bookList.html'
				},
				'booktype@booklist': {
					templateUrl: 'tpls/bookType.html'
				},
				'bookgrid@booklist': {
					templateUrl: 'tpls/bookGrid.html'
				}
			}
		})
		.state('addbook', {
			url: '/addbook',
			templateUrl: 'tpls/addBookForm.html'
		})
		.state('bookdetail', {
			url: '/bookdetail/:bookId', //注意这里在路由中传参数的方式
			templateUrl: 'tpls/bookDetail.html'
		})
});