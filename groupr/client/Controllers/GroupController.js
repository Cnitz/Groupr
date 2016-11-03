define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Group', [
		'$scope',
		'$state',
		'Groupr.Services.GroupServices',
		'Groupr.Services.AccountServices',
		'$stateParams',
		function GroupController($scope, $state, GroupServices, AccountServices, $stateParams) {
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
			$scope.createGroup = function()
			{
				var group = {name: $scope.groupName, description: $scope.groupDescription, isPublic: true}

				GroupServices.createGroup(group)
				.then(function(res){
					vm.groups.push(group);
				})
			}
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

			return vm;

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
			function joinGroup(group) {
				var id = 0;
				for(var i = 0; i < vm.groups.length; i++){
					if(vm.groups[i].name == group.name)
					var id = vm.groups[i]._id;
				}
				GroupServices.joinGroup(id)
				.then(function(res){
					console.log("success:");
					console.log(res.data);
				}, function(res) {
					console.log("failed: ");
					console.log(res.data);
				});
			}


		}

	]);

	function DialogController($scope, $mdDialog) {
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}

});
