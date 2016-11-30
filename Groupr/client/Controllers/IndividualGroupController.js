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
			vm.printDate = printDate;
			vm.printTimes = printTimes;
			vm.navigateToScheduleAssistant = navigateToScheduleAssistant;
			vm.vote = vote;
			vm.submitVote = submitVote;
			vm.cancelVoting = cancelVoting;
			vm.endVoting = endVoting;
			$scope.currentNavItem = "groups";
			$scope.customFullscreen = false;
			$scope.title= "";
			$scope.description= "";
			$scope.users = [];
			$scope.myDate = new Date();
			vm.currGroup = "";
			vm.events = [];
			$scope.pendingEvents = [];
			$scope.checkBoxData = [];

			vm.leaveGroup = leaveGroup;
			vm.groupID = $stateParams.groupID;



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
			$scope.statusChanged = function(task) {
				console.log(task);

				GroupServices.updateStatus(task._id)
				.then(function(res) {
					console.log("update status success!");
					console.log(res);
				}, function(res) {
					console.log("update status failure!");
					console.log(res);
				});


			};

			function leaveGroup(){
				GroupServices.leaveGroup(vm.groupID);
				$state.go('home');
			}

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

			for(var i = 0; i < vm.tasks.length; i++) {
				$scope.checkBoxData[i] = vm.tasks[i].status;
			}
			console.log($scope.checkBoxData);

			function goHome(){
				$state.go('home');
			}

			function logout(){
				AccountServices.logout();
				$state.go('main');
			}

			/* if there is no current vote, navigate to the schedule assistant page to create a new "doodle" */
			function navigateToScheduleAssistant() {
				$state.go('scheduleAssistant', {groupID: $stateParams.groupID;});
			}

			/* Vote for one proposed time, front end only */
			function vote(index) {
				$scope.checkBoxData[index] = true;
			}

			/* submit all votes and store in back end database */
			function submitVote() {

			}

			/* cancel the voting, back end to clear schedule assistant fields */
			function cancelVoting() {

			}

			/* back end, take current highest */
			function endVoting() {

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

			function addEvent() {
				var event = {
					name: $scope.eventName,
					description: $scope.eventDescription,
					location: $scope.eventLocation,
					startTime: $scope.myDate,
					endTime: $scope.myDate
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
				CalendarServices.addGroupEvent(event, $stateParams.groupID)
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
				CalendarServices.deleteGroupEvent(event, $stateParams.groupID)
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
				CalendarServices.editGroupEvent(event, $stateParams.groupID)
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
