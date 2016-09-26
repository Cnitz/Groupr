define(['Application', 'angular', 'ngMocks', 'View.signup'], function(app, ng, mocks) {
    describe('testing signup view', function() {
        beforeEach(module('CloudView'));
		beforeEach(module('templates'));

        var $scope;
        var $templateCache;
        var $compile;
        var view;

		beforeEach(inject(function($rootScope, _$templateCache_, _$compile_) {
            $scope = $rootScope;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
			var html = $templateCache.get('Views/_home.html');
			view = $compile(angular.element(html))($scope);
			debugger;
        }));

        describe('testing buttons exit', function() {
            it('login button should exist', function() {
				$scope.$digest();
				expect(view.find('#login')).toBeDefined();
            });
            it('signup button should exist', function() {
				$scope.$digest();
				expect(view.find('#signup')).toBeDefined();
            });
        });
    });
});
