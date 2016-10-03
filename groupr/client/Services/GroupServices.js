define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.GroupServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/';
			
			service.createGroup = function(credentials) {
				return $http({
					method: 'POST',
					url: url + 'create_group',
					data: credentials
				});
			}

            service.getGroups = function(id) {
				return $http({
					method: 'GET',
					url: url + 'get_groups'
				});
			}
			return service;
		}
	]);
});