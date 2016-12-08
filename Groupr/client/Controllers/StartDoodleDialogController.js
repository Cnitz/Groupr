define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.StartDoodleDialog', [
        '$scope',
        '$mdDialog',
        'Groupr.Services.CalendarServices',
        'groupID',
        function StartDoodleDialogController($scope, $mdDialog, CalendarServices, groupID) {

            $scope.create = function() {
                CalendarServices.startDoodle($scope.eventName, $scope.eventDescription, $scope.eventLocation, groupID)
                .then(
                    function(res) {
                        $mdDialog.cancel();
                    },
                    function(res) {
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
