define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.ScheduleAssistantDialog', [
        '$scope',
        '$mdDialog',
        'Groupr.Services.CalendarServices',
        'groupID',
        function ScheduleAssistantDialogController($scope, $mdDialog, CalendarServices, groupID) {

            $scope.submit = function() {
                
            }

            $scope.close = function() {
                $mdDialog.cancel();
            }
            
        }
    ]);
});
