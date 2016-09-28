define([
	'./Application'
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
			})
			.state('login', {
				url:			'/login',
				templateUrl:	'Views/_login.html',
				controller:		'Groupr.Controllers.Login'
			})
			.state('signup', {
				url:			'/signup',
				templateUrl:	'Views/_signup.html',
				controller:		'Groupr.Controllers.Signup'
			})
			.state('home', {
				url:			'/home',
				templateUrl:	'Views/_home.html',
				controller:		'Groupr.Controllers.Home',
			});
			$urlRouterProvider.otherwise('main');
		}
	]);
});
