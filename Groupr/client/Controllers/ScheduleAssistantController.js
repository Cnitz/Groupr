define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.ScheduleAssistant', [
		'$scope',
		'$state',
		'$stateParams',
		function ScheduleAssistantController($scope, $state, $stateParams) {
			vm.proposeMeeting = proposeMeeting;
			vm.generateMeetingTimes = generateMeetingTimes;
			vm.submitProposedMeetingTimes = submitProposedMeetingTimes;
			vm.deleteProposedMeeting = deleteProposedMeeting;

			$scope.meetings = [];
			var groupID = $stateParams._id;

			/* manually propose a new meeting time, front end only */
			function proposeMeeting() {

			}

			/* us the scheduling assistant to generate meeting times 
			   This will require a back end call but will not be stored in the back end database */
			function generateMeetingTimes() {

			}

			/* submit all data to back end database */
			function submitProposedMeetingTimes() {

			}

			/* delete a meeting from the proposed meetings list, front end only */
			function deleteProposedMeeting(index) {
				$scope.meetings.splice(index, 1);
			} 
		}
	]);
});
