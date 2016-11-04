define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.IndividualGroup', [
		'$scope',
		'$state',
		'Groupr.Services.GroupServices',
		'Groupr.Services.AccountServices',
		'$stateParams',
		'Groupr.Services.CalendarServices',
		function IndividualGroupController($scope, $state, GroupServices, AccountServices, $stateParams, CalendarServices) {
			var vm = this;
			{
				vm.groups =[];
				vm.tasks =[];
			}
			vm.goHome = goHome;
			vm.logout = logout;
			vm.addEvent = addEvent;
			vm.deleteEvent = deleteEvent;
			vm.editEvent = editEvent;
			vm.refresh = refresh;
			$scope.currentNavItem = "groups";
			$scope.customFullscreen = false;
			$scope.title= "";
			$scope.description= "";
			$scope.users = [];
			vm.currGroup = "";
			vm.events = [];

			$scope.addTask = function(data) {
				if($scope.title == "" || $scope.description == "")
				return;
				var task = {group: vm.currGroup._id, title: $scope.title, description: $scope.description};
				GroupServices.addTask(task)
				.then(function(res){
					console.log(res.data);
					vm.tasks.push(task);

					var g = {group: vm.currGroup._id};
					GroupServices.getTasks(g)
					.then(function(res){
						vm.tasks = res.data;
					}, function(res) {
						console.log("failure");
						console.log(res.data.message);
					});
				})
			};
			$scope.removeTask = function(data) {
				for(var i = 0; i < vm.tasks.length; i++){
					if(vm.tasks[i].title == data){
						var task = {taskId: vm.tasks[i]._id};
						console.log(task);
						GroupServices.removeTask(task)
						.then(function(res) {
							console.log("Success!");
							console.log(res.data);
							vm.tasks.splice(i, 1);
						}, function(res) {
							console.log("Failure.");
							console.log(res.data);
						});

						break;
					}
				}
			};

			function activate(){
				if($stateParams.groupID != null){
					GroupServices.getGroupInfo($stateParams.groupID)
					.then(function(resOne) {
						vm.currGroup = resOne.data;
						var g = {group: vm.currGroup._id};

						GroupServices.getTasks(g)
						.then(function(resTwo){
							vm.tasks = resTwo.data;
						}, function(resTwo) {
							console.log(resTwo.data);
						});
						CalendarServices.getGroupCalendar($stateParams.groupID)
						.then(
							function(resultThree) {
								console.log(resultThree.data.events);
								vm.events = resultThree.data.events;
								console.log(vm.events);
							},
							function(resultThree) {
								console.log(resultThree);
							}
						)

					}, function(resOne) {
						console.log(res.data);
					});
				}
			}

			activate();

			function goHome(){
				$state.go('home');
			}

			function logout(){
				AccountServices.logout();
				$state.go('main');
			}

			function addEvent() {
				var event = {
					name: $scope.eventName,
					description: $scope.eventDescription,
					location: $scope.eventLocation,
					startTime: Date.now(),
					endTime: Date.now()
				}
				CalendarServices.addGroupEvent(event)
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
				CalendarServices.deleteGroupEvent(event)
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
				CalendarServices.editGroupEvent(event)
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
				CalendarServices.getGroupCalendar($stateParams.groupID)
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

			return vm;
		}
	]);
});
