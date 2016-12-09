
define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.ForgotPassword', [
        '$scope',
        '$state',
        '$mdDialog',
        'Groupr.Services.AccountServices',
        'Groupr.Services.EmailService',
        function ForgotPasswordController($scope, $state, $mdDialog, AccountServices, EmailService) {
            $scope.email = '';
              $scope.sendPassword = function(){
                AccountServices.randomPassword($scope.email).then(
                    function (result) {
                      EmailService.sendPasswordEmail($scope.email);

                      $state.go('newPassword');
                    },
                    function (result) {
                        console.log(result.data);
                    }
                )

              }
        }
    ]);
});
