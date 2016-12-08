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

			var startDate1 = new Date(event.startTime);
			var endDate1 = new Date(event.endTime);

			$scope.startTime = "" + startDate1.getHours() + ":" + startDate1.getMinutes();
			$scope.endTime = "" + endDate1.getHours() + ":" + endDate1.getMinutes();

			$scope.myDate = new Date(event.startTime);

			$scope.editEvent = function() {

				//Now reading in the time strings and setting times. Remove when better time picker is made
				$scope.myDate.setSeconds(0);
				$scope.myDate.setMilliseconds(0);
				var newStartDate = new Date($scope.myDate);
				var newEndDate = new Date($scope.myDate);

				console.log($scope.startTime);
				console.log($scope.endTime);

				var time = $scope.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
				newStartDate.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
				newStartDate.setMinutes( parseInt(time[2]) || 0 );

				var time2 = $scope.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
				newEndDate.setHours( parseInt(time2[1]) + (time2[3] ? 12 : 0) );
				newEndDate.setMinutes( parseInt(time2[2]) || 0 );

				event.startTime = newStartDate;
				event.endTime = newEndDate;

				console.log(event.startTime);
				console.log(event.endTime);

				//End Time Reading Hack

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
