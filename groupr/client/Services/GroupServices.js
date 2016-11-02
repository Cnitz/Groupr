define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.GroupServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/';

			service.createGroup = function(group) {
				var data = {
					name: group.name,
					description: group.description,
					isPublic: group.isPublic
				}
				console.log(data);
				return $http({
					method: 'POST',
					url: url + 'groups/create',
					data: data
				});
			}

			service.getAllGroups = function(data) {
				return $http({
					method: 'GET',
					url: url + 'groups/all',
					data: data
				});
			}

			service.joinGroup = function(group) {

			}

			return service;
		}
	]);
});
