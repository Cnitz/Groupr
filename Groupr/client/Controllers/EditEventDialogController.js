define([
	'./Module'
], function(module) {
	return module.controller('Groupr.Controllers.EditEventDialog', [
		'$scope',
		'$mdDialog',
		'Groupr.Services.CalendarServices',
		'groupID',
        'calendarType',
        'event',
		function EditEventDialogController($scope, $mdDialog, CalendarServices, groupID, calendarType, event) {

			console.log(event);
			$scope.eventName = event.name;
			$scope.eventDescription = event.description;
			$scope.eventLocation = event.location;
			$scope.startTime = event.startTime;
			$scope.endTime = event.endTime;
			$scope.myDate = new Date(event.startTime);
			
			$scope.editEvent = function() {
				if (calendarType == 'group') {
					CalendarServices.editGroupEvent(event, groupID)
	                .then(
	                    function (result) {
	                        $mdDialog.cancel();
	                    },
	                    function (result) {
	                        console.log(result.data);
	                    }
	                )
				}
				else {
					CalendarServices.editEvent(event)
					.then(
						function(result) {
							$mdDialog.cancel();
						},
						function(result) {
							console.log(result.data);
						}
					)
				}
				
			}

			$scope.deleteEvent = function() {
				if (calendarType == 'group') {
					CalendarServices.deleteGroupEvent(event, groupID)
	                .then(
	                    function (result) {
	                        $mdDialog.cancel();
	                    },
	                    function (result) {
	                        console.log(result.data);
	                    }
	                )
				}
				else {
					CalendarServices.deleteEvent(event)
					.then(
						function(result) {
							$mdDialog.cancel();
						},
						function(result) {
							console.log(result.data);
						}
					)
				}
			}

            $scope.close = function() {
                $mdDialog.cancel();
            }
		}
	]);
});
