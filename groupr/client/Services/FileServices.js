define([
	'./Module'
], function(module) {
	return module.factory('CloudView.Services.FileServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:8081/';
			
			service.getFiles = function(credentials) {
				return $http({
					method: 'POST',
					url: url + '',
					data: credentials
				});
			}
			
			return service;
		}
	]);
});