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
				.state('groupCalendar', {
					url:			'/groupCalendar/:groupID',
					templateUrl:	'Views/_groupCalendar.html',
					controller:		'Groupr.Controllers.GroupCalendar',
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
				})
				.state('scheduleAssistant', {
					url:			'/scheduleAssistant',
					templateUrl:	'Views/_shedule_assistant.html',
					controller:		'Groupr.Controllers.ScheduleAssistant',
					controllerAs:   'vm',
					params: {
						groupID: ""
					}
				});
			$urlRouterProvider.otherwise('main');
		}
	]);
});
