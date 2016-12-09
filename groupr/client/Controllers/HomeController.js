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
		'$mdDialog',
		'Groupr.Services.EmailService',
		function HomeController($scope, $state, AccountServices, GroupServices, CalendarServices, GoogleServices, $mdDialog, EmailService) {
			var vm = this;
			vm.goHome = goHome;
			vm.navigateToGroups = navigateToGroups;
			vm.logout = logout;
			vm.goToGroup = goToGroup;
			vm.activate = activate;
			vm.addEvent = addEvent;
			vm.openSettingsDialog = openSettingsDialog;
			vm.deleteEvent = deleteEvent;
			vm.editEvent = editEvent;
			vm.googleAuth = googleAuth;
			vm.printDate = printDate;
			vm.printTimes = printTimes;
			vm.openAddEventDialog = openAddEventDialog;
      vm.openEditEventDialog = openEditEventDialog;
      vm.goToTaskGroup = goToTaskGroup;
			$scope.currentNavItem = "home";
			$scope.myDate = new Date();
			$scope.user = {};
			$scope.events = [];



			function goHome(){
				$state.go('home');
			}
			function printDate(event){
				var newDate = new Date(event.startTime);
				return (newDate.getMonth()+1)+'/'+newDate.getDate();
            }

            function goToTaskGroup(t) {
                console.log(t);
                $state.go('groupindiv', { groupID: t.group });
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

				if (event.name === '') {
					return;
				}

				//Now reading in the time strings and setting times. Remove when better time picker is made
				$scope.myDate.setSeconds(0);
				$scope.myDate.setMilliseconds(0);
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

				CalendarServices.addEvent(event)
				.then(
					function(result) {
						$scope.events.push(event);
						console.log($scope.events);
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
						var index = CalendarServices.searchEvents($scope.events, event);
						$scope.events.splice(index, 1);
						console.log($scope.events);
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
						var index = CalendarServices.searchEvents($scope.events, event);
						$scope.events[index] = event;
						console.log($scope.events);
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
						$scope.user = result.data;
						// get the users calendar
						CalendarServices.getPersonalCalendar()
						.then(
							function(resultTwo) {
								console.log(resultTwo.data);
								$scope.events = resultTwo.data;
								console.log($scope.events);
							},
							function(resultTwo) {
								console.log(resultTwo);
							}
						);

                        // get the users groups
                        GroupServices.getGroupByUser()
                            .then(function (res) {
                                vm.groups = res.data.data;
                            },
                            function (res) {
                                console.log(res.data);
                                if (res.status == 450)
                                    $state.go('login');
                            }
                            );
                        AccountServices.getUser()
                            .then(function (result) {
                                var user = result.data;
                                var data = {};



                                // get the users tasks
                                GroupServices.getTasksByUser()
                                    .then(function (res) {
                                        vm.tasks = res.data;
                                        console.log(res);

                                    },
                                    function (res) {
                                        console.log(res.data)
                                        if (res.status == 450)
                                            $state.go('login');
                                    }
                                    );
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

			function openAddEventDialog(ev) {
                $mdDialog.show({
                    controller: 'Groupr.Controllers.AddEventDialog',
                    templateUrl: './Views/_add_event_dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals : {
                        groupID: null,
                        calendarType: 'personal'
                    },
                    onRemoving: function(element, removePromise) {
                        refresh();
                    }
                })
            }

            function openEditEventDialog(event, ev) {
                $mdDialog.show({
                    controller: 'Groupr.Controllers.EditEventDialog',
                    templateUrl: './Views/_edit_event_dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals : {
                        groupID: null,
                        calendarType: 'personal',
                        event: event
                    },
                    onRemoving: function(element, removePromise) {
                        refresh();
                    }
                })
            }

            function refresh() {
                CalendarServices.getPersonalCalendar()
                .then(
                    function (result) {
                        $scope.events = result.data;
                    },
                    function (result) {
                        console.log(result.data);
                    }
                )
            }

						function openSettingsDialog(ev) {
			                $mdDialog.show({
												controller: 'Groupr.Controllers.SettingDialog',
		                    templateUrl: './Views/_setting_dialog.html',
		                    parent: angular.element(document.body),
		                    targetEvent: ev,
		                    clickOutsideToClose: true,
		                    fullscreen: true,
		                    locals : {

		                    },
			                    onRemoving: function(element, removePromise) {
			                        refresh();
			                    }
			                })
			            }

			activate();

			return vm;
		}
	]);
});
