define([
    'angular',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.router',
    'ui.tree',
    'validation.match',
    //our components
    'Controllers/Index',
    'Directives/Index',
    'Filters/Index',
    'Services/Index',
    './Localisation/BrowserLanguage',
    './Localisation/en',
    './Localisation/it'
], function(ng) {
    'use strict';
    return ng.module('CloudView', [
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'ngSanitize',
        'pascalprecht.translate',
        'ui.router',
        'ui.tree',
        'validation.match',
        //our modules
        'CloudView.Controllers',
        'CloudView.Directives',
        'CloudView.Filters',
        'CloudView.Services'
    ]).config([
        '$mdThemingProvider',
        function($mdThemingProvider) {
            $mdThemingProvider.theme('CloudViewTheme')
                .primaryPalette('teal')
                .accentPalette('amber');
            $mdThemingProvider.theme('CloudViewTheme-Dark')
                .primaryPalette('teal')
                .accentPalette('amber')
                .dark();
            $mdThemingProvider.theme('grey')
                .primaryPalette('blue-grey')
				.accentPalette('grey');
            $mdThemingProvider.enableBrowserColor({
                theme: 'CloudViewTheme'
            });
            $mdThemingProvider.setDefaultTheme('CloudViewTheme');
        }
    ]).config([
        '$translateProvider',
        function($translateProvider) {
            $translateProvider
                .translations('en', require('./Localisation/en'))
                .translations('it', require('./Localisation/it'));
            $translateProvider.fallbackLanguage('en');
            $translateProvider.use(require('./Localisation/BrowserLanguage'));
            $translateProvider.useSanitizeValueStrategy('escape');
        }
    ]);
});
