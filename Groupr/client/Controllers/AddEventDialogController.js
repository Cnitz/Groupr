define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.AddEventDialog', [
        '$scope',
        '$mdDialog',
        'Groupr.Services.CalendarServices',
        'groupID',
        'calendarType',
        function AddEventDialogController($scope, $mdDialog, CalendarServices, groupID, calendarType) {

            $scope.addEvent = function() {
                var event = {
                    name: $scope.eventName,
                    description: $scope.eventDescription,
                    location: $scope.eventLocation,
                    startTime: $scope.myDate,
                    endTime: $scope.myDate
                }
                console.log(event);

                //Now reading in the time strings and setting times. Remove when better time picker is made
                var newStartDate = new Date($scope.myDate);
                var newEndDate = new Date($scope.myDate);

                var time = $scope.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newStartDate.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
                newStartDate.setMinutes(parseInt(time[2]) || 0);

                var time2 = $scope.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newEndDate.setHours(parseInt(time2[1]) + (time2[3] ? 12 : 0));
                newEndDate.setMinutes(parseInt(time2[2]) || 0);

                event.startTime = newStartDate;
                event.endTime = newEndDate;
                //End Time Reading Hack
                console.log(event);

                if (calendarType == 'group') {
                    CalendarServices.addGroupEvent(event, groupID)
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
                    CalendarServices.addEvent(event)
                    .then(
                        function (result) {
                            $mdDialog.cancel();
                        },
                        function (result) {
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
