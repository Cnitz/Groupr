define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'$window',
		'$location',
		'Groupr.Services.AccountServices',
		function HomeController($scope, $state, $window, $location, AccountServices) {



		}

	]);
});
