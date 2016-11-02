define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Group', [
		'$scope',
		'$state',
		'Groupr.Services.GroupServices',
		'Groupr.Services.AccountServices',
		function GroupController($scope, $state, GroupServices, AccountServices) {
			var vm = this;
			{
				vm.groups =[];
				vm.tasks =[];
			}
			vm.goHome = goHome;
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
			$scope.joinGroup = function(ele) {

			}
			$scope.addTask = function(data) {
				if($scope.title == "" || $scope.description == "")
					return;
				var task = {title: $scope.title, description: $scope.description, dateCreated: Date.now(), completed: false };
				console.log(task);
				vm.tasks.push(task);
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
				console.log(data);
				GroupServices.getAllGroups(data)
				.then(function(res){
					vm.groups = res.data;

				}, function(res){
					console.log(res.data);
					if (res.status == 450)
					$state.go('login');
				});
			}

			function goHome(){
				$state.go('home');
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
