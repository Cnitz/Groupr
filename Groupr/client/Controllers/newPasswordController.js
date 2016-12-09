
define([
    './Module'
], function(module) {
    return module.controller('Groupr.Controllers.NewPassword', [
        '$scope',
        '$state',
        '$mdDialog',
        'Groupr.Services.AccountServices',
        'Groupr.Services.EmailService',
        function NewPasswordController($scope, $state, $mdDialog, AccountServices, EmailService) {
            $scope.email = '';
            $scope.curPassword = '';
            $scope.newPassword = '';
            $scope.confirmPassword = '';
              $scope.changePassword = function(){
                  AccountServices.updatePassword($scope.newPassword, $scope.curPassword , $scope.email).then(
	                    function (result) {
	                        $state.go('login');
	                    },
	                    function (result) {
	                        console.log(result.data);
	                    }
	                )


              }
        }
    ]);
});
