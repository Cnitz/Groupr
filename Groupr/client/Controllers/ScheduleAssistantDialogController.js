define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.ScheduleAssistantDialog', [
        '$scope',
        '$mdDialog',
        'Groupr.Services.CalendarServices',
        'groupID',
        function ScheduleAssistantDialogController($scope, $mdDialog, CalendarServices, groupID) {

            function submit() {
                var newStartDate = new Date($scope.myDate);
                var newEndDate = new Date($scope.myDate);

                var time = $scope.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newStartDate.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
                newStartDate.setMinutes(parseInt(time[2]) || 0);

                var time2 = $scope.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newEndDate.setHours(parseInt(time2[1]) + (time2[3] ? 12 : 0));
                newEndDate.setMinutes(parseInt(time2[2]) || 0);

                var duration = ($scope.durationHours * 60) + $scope.durationMinutes;
                console.log(newStartDate);
                console.log(newEndDate);

                newStartDate.setSeconds(0);
                newStartDate.setMilliseconds(0);
                newEndDate.setSeconds(0);
                newEndDate.setMilliseconds(0);

                CalendarServices.scheduleAssistant(newStartDate, newEndDate, duration, groupID)
                .then(
                    function(res){
                        $scope.pendingEvents.push(res.data);
                    },
                    function(res){
                        console.log("Failure");
                        console.log(res.data);
                    }
                )
            }

            $scope.close = function() {
                $mdDialog.cancel();
            }
            
        }
    ]);
});
