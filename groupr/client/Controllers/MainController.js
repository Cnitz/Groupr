define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Main', [
		'$scope',
		'$state',
		function MainController($scope, $state) {
			var vm = this;
			vm.goHome = goHome;

			$scope.login = function() {
				$state.go('login');
			};
			$scope.signup = function() {
				$state.go('signup');
			};
			function goHome(){
				$state.go('home');
			}



			return vm;
		}
	]);
});
