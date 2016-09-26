define([
	'./Application'
], function (app) {
    'use strict';
    return app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
			.state('home', {
				url:			'/home',
				templateUrl:	'Views/_home.html',
				controller:		'CloudView.Controllers.Home',
			})
			.state('login', {
				url:			'/login',
				templateUrl:	'Views/_login.html',
				controller:		'CloudView.Controllers.Login'
			})
			.state('signup', {
				url:			'/signup',
				templateUrl:	'Views/_signup.html',
				controller:		'CloudView.Controllers.Signup'
			})
			.state('folder', {
				url:			'/folder/:cloudViewToken',
				templateUrl:	'Views/_folder.html',
				controller:		'CloudView.Controllers.Folder',
			});
			$urlRouterProvider.otherwise('home');
		}
	]);
});
