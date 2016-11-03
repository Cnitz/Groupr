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
			$scope.users = [];




			activate();
			$scope.createGroup = function()
			{
				var groupName = prompt("Please enter the name of your new group.", "The Sausage Pilots");
				var groupDescription = prompt("Please enter the description of your new group.", "We pilot sausages for days.");
				if (groupName == null || groupDescription == null) {
					return;
				}
				var group = {name: groupName, description: groupDescription, isPublic: true}

				GroupServices.createGroup(group)
				.then(function(){
					vm.groups.push(group);
				})
			}
			$scope.addTask = function(data) {
				if($scope.title == "" || $scope.description == "")
				return;
				var task = {group: vm.currGroup._id, title: $scope.title, description: $scope.description};
				GroupServices.addTask(task)
				.then(function(res){
					console.log(res.data)
					vm.tasks.push(task);
				})
			};
			$scope.removeTask = function(data) {
				for(var i = 0; i < vm.tasks.length; i++){
					if(vm.tasks[i].title == data){
						vm.tasks.splice(i, 1);
						return;
					}
				}
			};

			return this;

			function activate(){
				var data = {
					token: AccountServices.userAccount.token,
					username: AccountServices.userAccount.user.username
				}
				GroupServices.getAllGroups(data)
				.then(function(res){
					vm.groups = res.data;

				}, function(res){
					console.log(res.data);
					if (res.status == 450)
					$state.go('login');
				});

				if($stateParams.groupID != null){
					GroupServices.getGroupInfo($stateParams.groupID)
					.then(function(res) {
						vm.currGroup = res.data;
						console.log(res.data);
					})
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
				console.log("hello");
				GroupServices.joinGroup(group._id)
				.then(function(res){
					console.log(res);
				}, function(res) {
					console.log(res);
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
