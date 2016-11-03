define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.IndividualGroup', [
		'$scope',
		'$state',
		'Groupr.Services.GroupServices',
		'Groupr.Services.AccountServices',
		'$stateParams',
		function IndividualGroupController($scope, $state, GroupServices, AccountServices, $stateParams) {
			var vm = this;
			{
				vm.groups =[];
				vm.tasks =[];
			}
			vm.goHome = goHome;
			vm.logout = logout;
			vm.joinGroup = joinGroup;
			$scope.currentNavItem = "groups";
			$scope.customFullscreen = false;
			$scope.title= "";
			$scope.description= "";
			$scope.groupName = "";
			$scope.groupDescription = "";
			$scope.users = [];
			vm.currGroup = "";



			activate();
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
				GroupServices.getAllGroups()
				.then(function(res){
					vm.groups = res.data.data;
				}, function(res){
					console.log(res.data);
					if (res.status == 450)
					$state.go('login');
				});

				if($stateParams.groupID != null){
					GroupServices.getGroupInfo($stateParams.groupID)
					.then(function(res) {
						vm.currGroup = res.data;
						console.log("getgroupinfo success");
						console.log(res.data);

						var g = {group: vm.currGroup._id};
						console.log("g:");
						console.log(g.group);
						console.log("currGroup:");
						console.log(vm.currGroup);

						GroupServices.getTasks(g)
						.then(function(res){
							console.log("success");
							console.log(res.data);
							vm.tasks = res.data;
						}, function(res) {
							console.log("failure");
							console.log(res.data.message);
						});


					}, function(res) {
						console.log("getgroupinfo failure");
						console.log(res.data);
					});
				}



			}

			function goHome(){
				$state.go('home');
			}

			function logout(){
				AccountServices.logout();
				$state.go('main');
			}

			return vm;
		}
	]);
});
