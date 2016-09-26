define([
	'./Module'
], function(module) {
	return module.controller('CloudView.Controllers.Login', [
		'$scope',
		'$state',
		function LoginController($scope, $state) {
			$scope.username = '';
			$scope.password = '';

			$scope.warn = {
				exists: false,
				prefix:	'',
				message: ''
			};
			$scope.loading = false;

			$scope.login = function() {
				
			};
			$scope.signup = function() {
				$state.go('signup');
			};
		}
	]);
});
