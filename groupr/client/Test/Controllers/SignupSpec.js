define(['Application', 'angular', 'ngMocks'], function(app, ng, mocks) {
    describe('testing signup controller', function() {
        beforeEach(module('CloudView'));

       var $controller;

        beforeEach(inject(function(_$controller_) {
			$controller = _$controller_;
        }));

        describe('form validation', function() {
            it('nonmatching password', function() {
                var $scope = {};
                var controller = $controller('CloudView.Controllers.Signup', { $scope: $scope });
                $scope.password = 'Correct';
                $scope.confirm_password = 'Incorrect';
                $scope.signup();
                expect($scope.error.exists).toEqual(true);
                expect($scope.error.passwordMessage).toEqual('The passwords provided do not match');
            });

            it('nonmatching email', function() {
                var $scope = {};
                var controller = $controller('CloudView.Controllers.Signup', { $scope: $scope });
                $scope.email = 'Correct';
                $scope.confirm_email = 'Incorrect';
                $scope.signup();
                expect($scope.error.exists).toEqual(true);
                expect($scope.error.emailMessage).toEqual('The email addresses provided do not match');
            });

            it('no error', function() {
                var $scope = {};
                var controller = $controller('CloudView.Controllers.Signup', { $scope: $scope });
                $scope.email = 'Correct';
                $scope.confirm_email = 'Correct';
                $scope.password = 'Correct';
                $scope.confirm_password = 'Correct';
                $scope.signup();
                expect($scope.error.exists).toEqual(false);
                expect($scope.error.emailMessage).toEqual('');
                expect($scope.error.passwordMessage).toEqual('');
            })
        });
    });
});