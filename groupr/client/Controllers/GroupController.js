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
            }
			vm.goHome = goHome;

            activate();
			$scope.createGroup = function()
			{
				var groupName = prompt("Please enter the name of your new group.", "The Sausage Pilots");
				var groupDescription = prompt("Please enter the description of your new group.", "We pilot sausages for days.");
				if (groupName == null || groupDescription == null) {
					return;
				}
				var group = {name: groupName, description: groupDescription, isPublic: true}
				var data = {
                    token: AccountServices.userAccount.token, 
                    username: AccountServices.userAccount.user.username
                }
				GroupServices.createGroup(group, data)
					.then(function(){
						vm.groups.push(group);
					})
			}
			$scope.joinGroup = function(ele) {
							
			}

            return this;

            function activate(){
				var data = {
                    token: AccountServices.userAccount.token, 
                    username: AccountServices.userAccount.user.username
                }
                console.log(data);
                GroupServices.getGroups(data)
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
});
