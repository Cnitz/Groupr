define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.GroupServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/';
			
			service.createGroup = function(group, credentials) {
				var data = { 
					name: group.name,
					description: group.description,
					isPublic: group.isPublic,
					token: credentials.token,
					username: credentials.username
				}
				console.log(data);
				return $http({
					method: 'POST',
					url: url + 'create_group',
					data: data
				});
			}

            service.getGroups = function(data) {
				return $http({
					method: 'POST',
					url: url + 'get_groups',
					data: data
				});
			}
			return service;
		}
	]);
});