var routerApp = angular.module('routerApp', ['ui.router', 'listApp','headerApp','ngGrid', 'ftitApp', 'adminApp', 'resApp', 'navApp', 'expanderModule', 'applyApp', 'repeatApp', 'directiveapp', 'factoryApp', 'tanktest', 'httptest', 'locationtest', 'BookListModule', 'BookDetailModule']);
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
		.state('index.trends', {
			url: '/trends',
			views: {
				'main@index': {
					templateUrl: 'tpls/trends.html',
					controller: function($scope, $location,$sce) {
						var url = $location.absUrl();
						//console.log(url);
						if (url.indexOf('news') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 行业动态 > 热点新闻');
							$scope.class1 = "active";
						} else if (url.indexOf('notice') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 行业动态 > 紧急公告');
							$scope.class2 = "active";
						}
					}
				},
				'nav@index.trends': {
					templateUrl: 'tpls/nav.html'
				}
			}
		})
		.state('index.trends.news', {
			url: '/news',
			templateUrl: 'tpls/trends/news.html'
		})
		.state('index.trends.notice', {
			url: '/notice',
			templateUrl: 'tpls/trends/notice.html'
		})
		.state('index.trends.newsform', {
			url: '/newsform',
			templateUrl: 'tpls/trends/newsform.html'
		})
		.state('index.trends.noticeform', {
			url: '/noticeform',
			templateUrl: 'tpls/trends/noticeform.html'
		})
		.state('index.services', {
			url: '/services',
			views: {
				'main@index': {
					templateUrl: 'tpls/services.html',
					controller: function($scope, $location,$sce) {
						var url = $location.absUrl();
						if (url.indexOf('query') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 船票查询');
							$('.nav_navigate a').removeClass('active');
						}else if (url.indexOf('cal') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 航班查询');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(10).addClass('active');
						}else if (url.indexOf('immigration') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 边检政策');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(4).addClass('active');
						}else if (url.indexOf('customs') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 海关政策');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(5).addClass('active');
						}else if (url.indexOf('inspection') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 检验检疫政策');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(6).addClass('active');
						}else if (url.indexOf('tourism') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 旅游局政策');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(7).addClass('active');
						}else if (url.indexOf('traffic') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 港口交通');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(11).addClass('active');
						}else if (url.indexOf('parking') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 停车服务');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(12).addClass('active');
						}else if (url.indexOf('vip') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 贵宾服务');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(13).addClass('active');
						}else if (url.indexOf('wifi') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > WIFI租赁');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(14).addClass('active');
						}else if (url.indexOf('luggage') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 行李服务');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(15).addClass('active');
						}else if (url.indexOf('currency') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 外币兑换');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(16).addClass('active');
						}else if (url.indexOf('bus') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 巴士服务');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(8).addClass('active');
						}else if (url.indexOf('insurance') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 保险服务');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(9).addClass('active');
						}else if (url.indexOf('boarding') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 登离船流程');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(3).addClass('active');
						}else if (url.indexOf('guide') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 港口指南');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(2).addClass('active');
						}else if (url.indexOf('note') != -1) {
							$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > 邮轮服务 > 游客注意事项');
							$('.nav_navigate a').removeClass('active');
							$('.nav_navigate a').eq(1).addClass('active');
						}
					}
				},
				'nav@index.services': {
					templateUrl: 'tpls/nav.html'
				}
			}
		})
		.state('index.services.query', {
			url: '/query',
			templateUrl: 'tpls/services/query.html'
		})
		.state('index.services.cal', {
			url: '/cal',
			templateUrl: 'tpls/services/cal.html'
		})
		.state('index.services.immigration', {
			url: '/immigration',
			templateUrl: 'tpls/services/immigration.html'
		})
		.state('index.services.customs', {
			url: '/customs',
			templateUrl: 'tpls/services/customs.html'
		})
		.state('index.services.inspection', {
			url: '/inspection',
			templateUrl: 'tpls/services/inspection.html'
		})
		.state('index.services.tourism', {
			url: '/tourism',
			templateUrl: 'tpls/services/tourism.html'
		})
		.state('index.services.traffic', {
			url: '/traffic',
			templateUrl: 'tpls/services/traffic.html'
		})
		.state('index.services.parking', {
			url: '/parking',
			templateUrl: 'tpls/services/parking.html'
		})
		.state('index.services.vip', {
			url: '/vip',
			templateUrl: 'tpls/services/vip.html'
		})
		.state('index.services.wifi', {
			url: '/wifi',
			templateUrl: 'tpls/services/wifi.html'
		})
		.state('index.services.luggage', {
			url: '/luggage',
			templateUrl: 'tpls/services/luggage.html'
		})
		.state('index.services.currency', {
			url: '/currency',
			templateUrl: 'tpls/services/currency.html'
		})
		.state('index.services.bus', {
			url: '/bus',
			templateUrl: 'tpls/services/bus.html'
		})
		.state('index.services.insurance', {
			url: '/insurance',
			templateUrl: 'tpls/services/insurance.html'
		})
		.state('index.services.boarding', {
			url: '/boarding',
			templateUrl: 'tpls/services/boarding.html'
		})
		.state('index.services.guide', {
			url: '/guide',
			templateUrl: 'tpls/services/guide.html'
		})
		.state('index.services.note', {
			url: '/note',
			templateUrl: 'tpls/services/note.html'
		})
		.state('index.destination', {
			url: '/destination',
			views: {
				'main@index': {
					templateUrl: 'tpls/canon/destination.html',
					controller: function($scope, $location,$sce) {
						$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > <a onclick="window.location.reload();" href="#/index/destination">邮轮度假目的地</a>');
						var url = $location.absUrl();
						var arr = url.split('?page=');
						$scope.srcPage = arr[1]?arr[1].replace(/%2F/g,'/').replace('%3F','?').replace('*','='):'/c_destination';
					}
				},
				'nav@index.destination': {
					templateUrl: 'tpls/nav.html'
				}
			}
		})
		.state('index.curisecompany', {
			url: '/curisecompany',
			views: {
				'main@index': {
					templateUrl: 'tpls/canon/curisecompany.html',
					controller: function($scope, $location,$sce) {
						$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > <a onclick="window.location.reload();" href="#/index/curisecompany">邮轮公司荟萃</a>');
						var url = $location.absUrl();
						var arr = url.split('?page=');
						var src ="/c_curisecompany";
					    if(arr[1]){
					    	src = arr[1].replace(/%2F/g,'/').replace('%3F','?').replace('*','=');
					    }
						$scope.srcPage = src;
					}
				},
				'nav@index.curisecompany': {
					templateUrl: 'tpls/nav.html'
				}
			}
		})
		.state('index.theme', {
			url: '/theme',
			views: {
				'main@index': {
					templateUrl: 'tpls/canon/theme.html',
					controller: function($scope, $location,$sce) {
						$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > <a onclick="window.location.reload();" href="#/index/theme">邮轮度假主题</a>');
						var url = $location.absUrl();
						var arr = url.split('?page=');
						var src ="/c_theme";
					    if(arr[1]){
					    	src = arr[1].replace(/%2F/g,'/').replace('%3F','?').replace('*','=');
					    }
						$scope.srcPage = src;
					}
				},
				'nav@index.theme': {
					templateUrl: 'tpls/nav.html'
				}
			}
		})
		.state('index.share', {
			url: '/share',
			views: {
				'main@index': {
					templateUrl: 'tpls/canon/share.html',
					controller: function($scope, $location,$sce) {
						$scope.path = $sce.trustAsHtml('<a href="#/index">首页</a> > <a onclick="window.location.reload();" href="#/index/share">邮轮生活分享</a>');
						var url = $location.absUrl();
						var arr = url.split('?page=');
						var src ="/c_share";
					    if(arr[1]){
					    	src = arr[1].replace(/%2F/g,'/').replace('%3F','?').replace('*','=');
					    }
						$scope.srcPage = src;
					}
				},
				'nav@index.share': {
					templateUrl: 'tpls/nav.html'
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
		.state('management', {
			url: '/management',
			views: {
				'': {
					templateUrl: 'tpls/admin/home.html'
				},
				'header@management': {
					templateUrl: 'tpls/admin/header.html'
				},
				'nav@management': {
					templateUrl: 'tpls/admin/nav.html'
				},
				'main@management': {
					templateUrl: 'tpls/admin/homepage.html'
				}
			}
		})
		.state('management.view_news', {
			url: '/view_news',
			views: {
				'main@management': {
					templateUrl: 'tpls/admin/view_news.html'
				}
			}
		})
		.state('management.news', {
			url: '/news',
			views: {
				'main@management': {
					templateUrl: 'tpls/admin/news.html'
				}
			}
		})
});