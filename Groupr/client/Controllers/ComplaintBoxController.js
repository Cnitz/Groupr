define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.ComplaintBox', [
		'$scope',
		'$state',
		function ComplaintBoxController($scope, $state) {
			var vm = this;


            activate();

			return vm;
            
            function activate(){}

		}
	]);
});
