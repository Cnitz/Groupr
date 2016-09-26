define([
    'angular',
    'underscore'
], function(angular) {
    return angular.module('underscore', [])
        .factory('_', ['$window', function($window) {
            return $window._;
        }]);
});
