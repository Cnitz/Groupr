define(['Application', 'angular', 'ngMocks', 'View.signup'], function(app, ng, mocks) {
    describe('testing signup view', function() {
        beforeEach(module('CloudView'));
		beforeEach(module('templates'));

        var $scope;
        var $templateCache;
        var $compile;
        var form;
		var view;

        beforeEach(inject(function($rootScope, _$templateCache_, _$compile_) {
            $scope = $rootScope;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
			$scope.username = '';
			$scope.email = '';
			$scope.confirm_email = '';
			$scope.password = '';
			$scope.confirm_password = '';
			$scope.warn = {
				exists: false,
				prefix:	'',
				message: ''
			};
			$scope.loading = false;
			$scope.signup = function() {};
			var html = $templateCache.get('Views/_signup.html');
			view = $compile(angular.element(html))($scope);
            form = $scope.signupForm;
			debugger;
        }));

        describe('testing username', function() {
            it('require should work for entered value', function() {
                form.username.$setViewValue('captantan');
                $scope.$digest();
                expect(form.username.$valid).toBe(true);
            });
            it('require should fail for empty value', function() {
				form.username.$setViewValue('');
                $scope.$digest();
                expect(form.username.$valid).toBe(false);
            });
			it('xregexp should fail for special chars', function() {
				form.username.$setViewValue('@#$%^&*');
                $scope.$digest();
                expect(form.username.$valid).toBe(false);
            });
			it('xregexp should work for chinese', function() {
				form.username.$setViewValue('粞絧絏');
                $scope.$digest();
                expect(form.username.$valid).toBe(true);
            });
        });
		describe('testing email', function() {
            it('require should work for entered value', function() {
                form.email.$setViewValue('a.b@c.com');
                $scope.$digest();
                expect(form.email.$valid).toBe(true);
            });
            it('require should fail for empty value', function() {
				form.email.$setViewValue('');
                $scope.$digest();
                expect(form.email.$valid).toBe(false);
            });
			it('xregexp should fail for not email value', function() {
				form.email.$setViewValue('canada');
                $scope.$digest();
                expect(form.email.$valid).toBe(false);
            });
        });
		describe('testing confirm email', function() {
            it('values should work if they match', function() {
                form.email.$setViewValue('a.b@c.com');
				form.confirm_email.$setViewValue('a.b@c.com');
                $scope.$digest();
                expect(form.confirm_email.$valid).toBe(true);
            });
            it('values should fail if they do not', function() {
				form.email.$setViewValue('a.b@c.com');
				form.confirm_email.$setViewValue('a.c@b.com');
                $scope.$digest();
                expect(form.confirm_email.$valid).toBe(false);
            });
        });
		describe('testing password', function() {
            it('require should work for entered value', function() {
                form.password.$setViewValue('1234badpass');
                $scope.$digest();
                expect(form.password.$valid).toBe(true);
            });
            it('require should fail for empty value', function() {
				form.password.$setViewValue('');
                $scope.$digest();
                expect(form.password.$valid).toBe(false);
            });
        });
		describe('testing confirm password', function() {
            it('values should work if they match', function() {
                form.password.$setViewValue('1234badpass');
				form.confirm_password.$setViewValue('1234badpass');
                $scope.$digest();
                expect(form.confirm_password.$valid).toBe(true);
            });
            it('values should fail if they do not', function() {
				form.password.$setViewValue('1234badpass');
				form.confirm_password.$setViewValue('12345badpass');
                $scope.$digest();
                expect(form.confirm_password.$valid).toBe(false);
            });
        });
    });
});
