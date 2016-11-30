define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.ScheduleAssistant', [
		'$scope',
		'$state',
		'$stateParams',
		function ScheduleAssistantController($scope, $state, $stateParams) {
			vm.proposeMeeting = proposeMeeting;

			function proposeMeeting() {

			}
		}
	]);
});
