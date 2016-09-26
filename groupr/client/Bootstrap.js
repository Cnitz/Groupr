define([
    'require',
    'angular',
	'viewport-units-buggyfill',
	'viewport-units-buggyfill-hacks',
    './Application',
    './Routes'
], function(require, ng, vpubf, hacks) {
    'use strict';
	vpubf.init({hacks: hacks});
    require(['domReady!'], function(document) {
        ng.bootstrap(document, ['CloudView']);
    });
});
