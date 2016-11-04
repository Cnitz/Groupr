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
			vm.googleAuth = googleAuth;
			vm.printDate = printDate;
			vm.printTimes = printTimes;
			$scope.currentNavItem = "home";
			$scope.myDate = new Date();

			vm.user = {};
			vm.events = [];

			function goHome(){
				$state.go('home');
			}
			function printDate(event){
				var newDate = new Date(event.startTime);
				return (newDate.getMonth()+1)+'/'+newDate.getDate();
			}

			function printTimes(event){
				var newStartTime = new Date(event.startTime);
				var newEndTime   = new Date(event.endTime);

				return newStartTime.getHours()+':'+newStartTime.getMinutes()+' - '+newEndTime.getHours()+':'+newEndTime.getMinutes()
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
				console.log($scope.myDate);
				var event = {
					name: $scope.eventName,
					description: $scope.eventDescription,
					location: $scope.eventLocation,
					startTime: $scope.myDate,
					endTime: $scope.myDate,
				}

				//Now reading in the time strings and setting times. Remove when better time picker is made
				var newStartDate = new Date($scope.myDate);
				var newEndDate = new Date($scope.myDate);

				var time = $scope.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
				newStartDate.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
				newStartDate.setMinutes( parseInt(time[2]) || 0 );

				var time2 = $scope.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
				newEndDate.setHours( parseInt(time2[1]) + (time2[3] ? 12 : 0) );
				newEndDate.setMinutes( parseInt(time2[2]) || 0 );

				event.startTime = newStartDate;
				event.endTime = newEndDate;
				//End Time Reading Hack


				console.log(event);
				CalendarServices.addEvent(event)
				.then(
					function(result) {
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
						refresh();
					},
					function(result) {
						console.log(result.data);
					}
				)
			}

			function editEvent() {
				CalendarServices.editEvent(event)
				.then(
					function(result) {
						refresh();
					},
					function(result) {
						console.log(result.data);
					}
				)
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
								vm.events = resultTwo.data.events;
						},
							function(resultTwo) {
								console.log(resultTwo);
							}
						)
						GroupServices.getGroupByUser()
						.then(function(res) {
							vm.groups = res.data.data;
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

			function googleAuth(){
				GoogleServices.googleAuth();
			}

			activate();

			return vm;
		}
	]);
});
