define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Main', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		function MainController($scope, $state, AccountServices) {
			var vm = this;

			AccountServices.verifyToken()
				.then(
					function(result) {
						$state.go('home');
					},
					function(result) {}
				)
			
			$scope.login = function() {
				$state.go('login');
			};
			$scope.signup = function() {
				$state.go('signup');
			};

			return vm;
		}
	]);
});
