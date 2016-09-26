define([
    './Module',
    'xregexp'
], function(module, XRegExp) {
    'use strict';
    return module.directive('xregPattern', function patternTest($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                var regex = XRegExp(attrs.xregPattern)
                ctrl.$validators.xregPattern = function() {
                    return regex.test(ctrl.$viewValue) === true;
                };
            }
        };
    });
});
