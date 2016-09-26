var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        //Bower Libraries
        'angular': './bower_components/angular/angular',
        'ngMocks': './bower_components/angular-mocks/angular-mocks',
        'ngAnimate': './bower_components/angular-animate/angular-animate',
        'ngAria': './bower_components/angular-aria/angular-aria',
        'ngMaterial': './bower_components/angular-material/angular-material',
        'ngMessages': './bower_components/angular-messages/angular-messages',
        'ngSanitize': './bower_components/angular-sanitize/angular-sanitize',
        'pascalprecht.translate': './bower_components/angular-translate/angular-translate',
        'ui.router': './bower_components/angular-ui-router/release/angular-ui-router',
        'ui.tree': './bower_components/angular-ui-tree/dist/angular-ui-tree',
        'validation.match': './bower_components/angular-validation-match/dist/angular-validation-match',
        'domReady': './bower_components/domReady/domReady',
        'underscore': './bower_components/underscore/underscore',
        'xregexp': './bower_components/xregexp/xregexp-all',
        'viewport-units-buggyfill': './bower_components/viewport-units-buggyfill/viewport-units-buggyfill',
        'viewport-units-buggyfill-hacks': './bower_components/viewport-units-buggyfill/viewport-units-buggyfill.hacks',
        //our code
        'Controllers': './Controllers/Static',
        'Directives': './Directives',
        'Filters': './Filters',
        'Libraries': './Libraries',
        'Services': './Services',
		//views
		'View.signup': './Views/_signup.html'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'ngMocks': {
            deps: ['angular'],
        },
        'ngAnimate': {
            deps: ['angular']
        },
        'ngAria': {
            deps: ['angular']
        },
        'ngMaterial': {
            deps: ['angular']
        },
        'ngMessages': {
            deps: ['angular']
        },
        'ngSanitize': {
            deps: ['angular']
        },
        'pascalprecht.translate': {
            deps: ['angular']
        },
        'ui.router': {
            deps: ['angular']
        },
        'ui.tree': {
            deps: ['angular']
        },
        'validation.match': {
            deps: ['angular']
        },
        'xregexp': {
            exports: "XRegExp",
        },
		//Views
		'View.signup': {
			deps: ['angular']
		}
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
