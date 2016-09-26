define([], function() {
	'use strict';
	var lang = "en";
	try {
		lang = navigator.language.substring(0,2);
	} catch(err) {}
	return lang;
});
