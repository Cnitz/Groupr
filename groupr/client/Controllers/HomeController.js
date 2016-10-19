define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		function HomeController($scope, $state, AccountServices) {
			var vm = this;
			vm.goHome = goHome;
			vm.navigateToGroups = navigateToGroups;
			vm.logout = logout;
			$scope.currentNavItem = "home";

			return vm;
			function goHome(){
				$state.go('home');
			}

			function navigateToGroups(){
				$state.go('groups');
			}

			function logout(){
				AccountServices.logout();
				$state.go('main');
			}


		}
	]);
});
