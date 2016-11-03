define([
	'./Application',
], function (app) {
    'use strict';
    return app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('main', {
					url:			'/main',
					templateUrl:	'Views/_main.html',
					controller:		'Groupr.Controllers.Main',
					controllerAs: 	'vm'
				})
				.state('login', {
					url:			'/login',
					templateUrl:	'Views/_login.html',
					controller:		'Groupr.Controllers.Login',
					controllerAs:	'vm'
				})
				.state('signup', {
					url:			'/signup',
					templateUrl:	'Views/_signup.html',
					controller:		'Groupr.Controllers.Signup',
					controllerAs: 	'vm'
				})
				.state('home', {
					url:			'/home',
					templateUrl:	'Views/_home.html',
					controller:		'Groupr.Controllers.Home',
					controllerAs:  	'vm',
				})
				.state('groupindiv', {
					url:			'/groupindiv/:groupID',
					templateUrl:	'Views/_groupindiv.html',
					controller:		'Groupr.Controllers.IndividualGroup',
					controllerAs:  	'vm',
					params: {
						groupID: ""
					}
				})
				.state('groups', {
					url:			'/groups',
					templateUrl:	'Views/_group.html',
					controller:		'Groupr.Controllers.Group',
					controllerAs:   'vm',
				});
			$urlRouterProvider.otherwise('main');
		}
	]);
});
