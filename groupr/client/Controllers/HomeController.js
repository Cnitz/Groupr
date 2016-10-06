define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'$window',
		'Groupr.Services.AccountServices',
		function HomeController($scope, $state, $window, AccountServices) {

			function googleLogin(){
				$window.location.href = ('http://localhost:3000/api/auth/google');
			}
			googleLogin();
		}

	]);
});
