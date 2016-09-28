define([
	'./Module'
], function(module) {
	return module.controller('CloudView.Controllers.Signup', [
		'$scope',
		'$state',
		'CloudView.Services.AccountServices',
		function SignupController($scope, $state, AccountServices) {
			$scope.name = '';
			$scope.username = '';
			$scope.email = '';
			$scope.confirm_email = '';
			$scope.password = '';
			$scope.confirm_password = '';

			$scope.warn = {
				exists: false,
				prefix:	'',
				message: ''
			};
			$scope.loading = false;

			$scope.error = {
				message: '',
				exists: ''
			};

			$scope.login = function() {
				$state.go('login');
			};
			$scope.signup = function() {
				var userAccount = {
						name: $scope.name,
						username: $scope.username,
						email: $scope.email,
						password: $scope.password
				};
				AccountServices.signup(userAccount)
					.then(
						function(result) {
							console.log(result.data);
						},
						function(result) {
							console.log(result.data);
						}
					);
			};
		}
	]);
});
