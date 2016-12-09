define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.SettingDialog', [
        '$scope',
        '$mdDialog',
        'Groupr.Services.AccountServices',
        'Groupr.Services.EmailService',
        function SettingDialogController($scope, $mdDialog, AccountServices, EmailService) {

             AccountServices.getUser()
             .then(
                 function(res) {
                   $scope.emailNotifications = res.data.emailNotifications;
                 }),
     						function(result) {
     							console.log(result.data);
     						}

              $scope.save = function(){
                EmailService.updateEmailNotifications($scope.emailNotifications);
                $mdDialog.cancel();
              }

              $scope.close = function() {
                EmailService.meetingsToday();
                  $mdDialog.cancel();
              }
        }
    ]);
});
