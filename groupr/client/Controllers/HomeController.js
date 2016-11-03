define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Home', [
		'$scope',
		'$state',
		'Groupr.Services.AccountServices',
		'Groupr.Services.GroupServices',
		'Groupr.Services.CalendarServices',
		'Groupr.Services.GoogleServices',
		function HomeController($scope, $state, AccountServices, GroupServices, CalendarServices, GoogleServices) {
			var vm = this;
			vm.goHome = goHome;
			vm.navigateToGroups = navigateToGroups;
			vm.logout = logout;
			vm.goToGroup = goToGroup;
			vm.activate = activate;
			vm.addEvent = addEvent;
			vm.deleteEvent = deleteEvent;
			vm.editEvent = editEvent;
			vm.refresh = refresh;
			$scope.currentNavItem = "home";

			vm.user = {};
			vm.events = [];

			function goHome(){
				$state.go('home');
			}
			function getGoogleCalEvents(){
				GoogleServices.login();
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
				var event = {
					name: $scope.title,
					description: $scope.description,
					location: $scope.location,
					startTime: Date.now(),
					endTime: Date.now()
				}
				console.log(event);
				CalendarServices.addEvent(event)
				.then(
					function(result) {
						console.log('success adding event');
						refresh();
					},
					function(result) {
						console.log(result.data);
					}
				)
			}

			function deleteEvent(event) {
				CalendarServices.deleteEvent(event)
				.then(
					function(result) {
						console.log('success deleting event');
						refresh();
					},
					function(result) {
						console.log(result.data);
					}
				)
			}

			function editEvent() {

			}

			function refresh() {
				CalendarServices.getPersonalCalendar(vm.user._id)
					.then(
						function(result) {
							vm.events = result.data.events;
							console.log(vm.events);
					},
						function(result) {
							console.log(result.data);
						}
					)
			}

			function activate(){
				AccountServices.getUser()
				.then(
					function(result) {
						vm.user = result.data;
						console.log(vm.user);
						CalendarServices.getPersonalCalendar(vm.user._id)
						.then(
							function(resultTwo) {
								console.log(resultTwo.data);
								vm.events = resultTwo.data.events;
								console.log(vm.events);
						},
							function(resultTwo) {
								console.log(resultTwo);
							}
						)
						GroupServices.getGroupByUser()
						.then(function(res) {
							vm.groups = res.data.data;
							console.log(res.data.data);
						}, function(res) {
							console.log(res.data);
							if (res.status == 450)
								$state.go('login');
						});
					},
					function(result) {
						console.log(result.data);
					}
				)
			}

			activate();

			return vm;
		}
	]);
});
