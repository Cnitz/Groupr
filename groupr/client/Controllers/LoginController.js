define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Login', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		function LoginController($scope, $state, AccountServices) {
			$scope.username = '';
			$scope.password = '';

			$scope.warn = {
				exists: false,
				prefix:	'',
				message: ''
			};
			$scope.loading = false;

			$scope.login = function() {
				var credentials = {
					username: $scope.username,
					password: $scope.password
				};
				AccountServices.login(credentials)
					.then(
						function(result) {
							console.log(result.data);
							$state.go('home');
						},
						function(result) {
							console.log(result.data);
						}
					);
			};
			$scope.signup = function() {
				$state.go('signup');
			};
		}
	]);
});
