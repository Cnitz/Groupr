define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.ComplaintBox', [
		'$scope',
		'$state',
		function MainController($scope, $state) {
			var vm = this;


            activate();

			return vm;


            function activate(){}

		}
	]);
});
