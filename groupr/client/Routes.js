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
				controllerAs:  	'vm'
			})
			.state('PersonalCalendar', {
				url:			'/PersonalCalendar',
				templateUrl:	'Views/_personalCalendar.html',
				controller:		'Groupr.Controllers.PersonalCalendar',
				controllerAs:  	'vm'
			})
			.state('GoogleCallBack', {
				url:			'/auth/google/callback',
				templateUrl:	'Views/_GoogleCallBackPage.html',
				controller:		'Groupr.Controllers.GoogleCallBack',
				controllerAs:  	'vm'
			})
			.state('groups', {
				url:			'/groups',
				templateUrl:	'Views/_group.html',
				controller:		'Groupr.Controllers.Group',
				controllerAs:   'vm'
			});

			$urlRouterProvider.otherwise('home');
		}
	]);
});
