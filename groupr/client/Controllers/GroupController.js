define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.Group', [
		'$scope',
		'$state',
        'Groupr.Services.GroupServices',
		function GroupController($scope, $state, GroupServices) {
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
