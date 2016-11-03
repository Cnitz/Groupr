define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		'Groupr.Services.GroupServices',
		'Groupr.Services.CalendarServices'
		function HomeController($scope, $state, AccountServices, GroupServices, CalendarServices) {
			var vm = this;
			vm.goHome = goHome;
			vm.navigateToGroups = navigateToGroups;
			vm.logout = logout;
			vm.goToGroup = goToGroup;
			vm.activate = activate;
			vm.addEvent = addEvent;
			vm.editEvent = editEvent;
			vm.deleteEvent = deleteEvent;
			$scope.currentNavItem = "home";

			vm.user = {};
			vm.events = [];

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

			function addEvent() {
				
			}

			function deleteEvent() {
				
			}

			function editEvent() {
				
			}

			function activate(){
				AccountServices.getUser()
				.then(
					function(result) {
						vm.user = result.data;
						console.log(vm.user);
						CalendarServices.getPersonalCalendar(vm.user._id)
						.then(
							function(result) {
								console.log(result.data);
								vm.events = result.data.events;
								console.log(vm.events);
						}, 
							function(result) {
								console.log('failed to get personal calendar events');
							}
						)
					},
					function(result) {
						console.log('failed to get user object');
					}
				)
			}

			activate();

			function formatDate(date) {
				var date = date.startTime.getMonth() + '/' + date.startTime.getDate();
			}

		}
	]);
});
