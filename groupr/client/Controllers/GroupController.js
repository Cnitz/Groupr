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

            activate();
            
            return this;

            function activate(){
                GroupServices.getGroups()
                    .then(function(res){
                        vm.groups = res.data;
                }, function(){

                });
            }

		}

	]);
});
