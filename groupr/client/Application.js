define([
    'angular',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'ngCookies',
    'ngToast',
    'pascalprecht.translate',
    'ui.router',
    'ui.tree',
    'validation.match',
    //our components
    'Controllers/Index',
    'Services/Index',
], function(ng) {
    'use strict';
    return ng.module('Groupr', [
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ngSanitize',
        'ngCookies',
        'ngToast',
        'pascalprecht.translate',
        'ui.router',
        'ui.tree',
        'validation.match',
        //our modules
        'Groupr.Controllers',
        'Groupr.Services'
    ]).config([
        '$mdThemingProvider',
        function($mdThemingProvider) {
            $mdThemingProvider.theme('GrouprTheme')
                .primaryPalette('indigo')
                .accentPalette('pink');
            $mdThemingProvider.theme('GrouprTheme-Dark')
                .primaryPalette('indigo')
                .accentPalette('pink')
                .dark();
            $mdThemingProvider.theme('grey')
                .primaryPalette('blue-grey')
				.accentPalette('grey');
            $mdThemingProvider.enableBrowserColor({
                theme: 'GrouprTheme'
            });
            $mdThemingProvider.setDefaultTheme('GrouprTheme');
        }
    ])
});
