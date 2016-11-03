define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		'Groupr.Services.GroupServices',
		function HomeController($scope, $state, AccountServices, GroupServices) {
			var vm = this;
			vm.goHome = goHome;
			vm.navigateToGroups = navigateToGroups;
			vm.logout = logout;
			vm.goToGroup = goToGroup;
			$scope.currentNavItem = "home";

			GroupServices.getGroupByUser()
			.then(function(res) {
				vm.groups = res.data;
				console.log(res.data);
			}, function(res) {
				console.log(res.data);
				if (res.status == 450)
					$state.go('login');
			});

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
			function goToGroup(g) {
				$state.go('groupindiv', {groupID: g._id});
			}


		}
	]);
});
