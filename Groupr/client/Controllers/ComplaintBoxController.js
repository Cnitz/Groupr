define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.ComplaintBoxController', [
		'$scope',
		'$state',
		'Groupr.Services.GroupServices',
		'Groupr.Services.AccountServices',
		'$stateParams',
		'Groupr.Services.CalendarServices',
		'$mdSidenav',
		'$log',
		'$mdDialog',
		'$sce',
		'$filter',
		'ngToast',
		'Groupr.Services.ComplaintServices',
		function ComplaintBoxController($scope, $state, GroupServices, AccountServices, $stateParams, CalendarServices, $mdSidenav, $log, $mdDialog, $sce, $filter, ngToast, ComplaintServices) {
			var vm = this;
			{
					vm.groups = [];
					vm.tasks = [];
					vm.complaint = {'title' : null,
									'message': null,
									'urgency': null,
									'group': $stateParams.groupID};
					vm.complaints = [];
			}
			vm.goHome = goHome;
			vm.groupCalendar = groupCalendar;
			vm.groupComplaints = groupComplaints;
			vm.groupChat = groupChat;
			vm.groupTasks = groupTasks;
			vm.logout = logout;
			vm.refresh = refresh;
			vm.navigateToScheduleAssistant = navigateToScheduleAssistant;
			vm.navigateToGroupChat = navigateToGroupChat;
			vm.createComplaint = createComplaint;
			$scope.currentNavItem = "groups";
			$scope.customFullscreen = false;
			$scope.users = [];
			vm.currGroup = "";
			vm.events = [];
			$scope.toggleLeft = buildDelayedToggler('left');
			$scope.user = {};

			vm.leaveGroup = leaveGroup;
			vm.groupID = $stateParams.groupID;

			$scope.statusChanged = function (task) {
					console.log(task);

					GroupServices.updateStatus(task._id)
							.then(function (res) {
									console.log("update status success!");
									console.log(res);
							}, function (res) {
									console.log("update status failure!");
									console.log(res);
							});


			};


			function leaveGroup() {
					GroupServices.leaveGroup(vm.groupID);
					$state.go('home');
			}

			/*Navigates to Group Calendar sub-page*/
			function groupCalendar() {
					console.log("groupID: " + vm.groupID);
					$state.go('groupCalendar', { groupID: vm.groupID });
			}

			function groupComplaints() {
					console.log("groupID: " + vm.groupID);
					$state.go('groupComplaints', { groupID: vm.groupID });
			}

			function groupChat() {
					$state.go('groupChat', { groupID: vm.groupID });
			}

			function groupTasks() {
					$state.go('groupindiv', { groupID: vm.groupID });
			}

			/*Navigates to Chat Subpage*/
			function navigateToGroupChat(){
				$state.go('groupChat',{groupID: g._id});
			}

			function activate() {
					if ($stateParams.groupID != null) {
							GroupServices.getGroupInfo($stateParams.groupID)
									.then(function (resOne) {
											vm.currGroup = resOne.data;
											var g = { group: vm.currGroup._id };

											GroupServices.getTasks(g)
													.then(function (resTwo) {
															vm.tasks = resTwo.data;
															getAllComplaints($stateParams.groupID);
													}, function (resTwo) {
															console.log(resTwo.data);
													});
											CalendarServices.getGroupCalendar($stateParams.groupID)
													.then(
													function (resultThree) {
															console.log(resultThree.data.events);
															vm.events = resultThree.data.events;
															console.log(vm.events);
													},
													function (resultThree) {
															console.log(resultThree);
													}
													)

									}, function (resOne) {
											ngToast.danger(resOne.data.message);
									});



					}
			}

			activate();
	
			function createComplaint(complaint){
				if(complaint.title && complaint.message && complaint.urgency){
					
					return ComplaintServices.createComplaint(complaint).then(function(){
						complaint.title = null;
						complaint.message = null;
						complaint.urgency = null;
						getAllComplaints(vm.groupID);
					});
				}
				else{
					ngToast.danger('Please finish filling out complaint before submission.');
				}
		}


			/**
			* Supplies a function that will continue to operate until the
			* time is up.
			*/
			function debounce(func, wait, context) {
					var timer;

					return function debounced() {
							var context = $scope,
									args = Array.prototype.slice.call(arguments);
							$timeout.cancel(timer);
							timer = $timeout(function () {
									timer = undefined;
									func.apply(context, args);
							}, wait || 10);
					};
			}

			function getAllComplaints(id){
				return ComplaintServices.getAllComplaints(id).then(function(res){
						vm.complaints = res.data.complaints;
				});
			}

			/**
			* Build handler to open/close a SideNav; when animation finishes
			* report completion in console
			*/
			function buildDelayedToggler(navID) {
					return debounce(function () {
							// Component lookup should always be available since we are not using `ng-if`
							$mdSidenav(navID)
									.toggle()
									.then(function () {
											$log.debug("toggle " + navID + " is done");
									});
					}, 200);
			}

			function goHome() {
					$state.go('home');
			}

			function logout() {
					AccountServices.logout();
					$state.go('main');
			}

			function navigateToScheduleAssistant() {
					$state.go('scheduleAssistant', { groupID: $stateParams.groupID });
			}


			function refresh() {
					CalendarServices.getGroupCalendar($stateParams.groupID)
					.then(
							function (result) {
									vm.events = result.data.events;
									console.log(vm.events);
							},
							function (result) {
									console.log(result.data);
							}
					)
			}

			return vm;
	}
])
	.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
			$scope.close = function () {
					// Component lookup should always be available since we are not using 'ng-if'
					$mdSidenav('left').close()
							.then(function () {
									$log.debug("close LEFT is done");
							});
			};
	});
});
