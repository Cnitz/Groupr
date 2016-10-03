define(['Application', 'angular', 'ngMocks'], function(app, ng, mocks) {
    describe('testing group controller', function() {
        beforeEach(module('Groupr'));

       var $controller, controller;

        beforeEach(inject(function(_$controller_) {
            $controller = _$controller_;
            var $scope = {};
             controller = $controller('Groupr.Controllers.Group', { $scope: $scope });
        }));

        describe('when  create group', function() {

        });
    });
});