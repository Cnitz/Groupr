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
				return $http({
					method: 'POST',
					url: url + 'groups/create',
					data: data
				});
			}

			service.getAllGroups = function() {
				return $http({
					method: 'GET',
					url: url + 'groups/all'
				});
			}

			service.getGroupByUser = function() {
				return $http({
					method: 'GET',
					url: url + 'groups'
				});
			}

			service.getGroupInfo = function(gid) {
				return $http({
					method: 'GET',
					url: url + 'groups/' + gid
				});
			}

			service.addTask = function(data) {
				return $http({
					method: 'POST',
					url: url + 'tasks/add',
					data: data
				});
			}

			service.joinGroup = function(gid) {
				return $http({
					method: 'PUT',
					url: url + 'groups/join/' + gid
				});
			}

			service.leaveGroup = function(gid){
				return $http({
					method: 'PUT',
					url: url + 'groups/leave/' + gid
				});
			}

			service.getTasks = function(data) {
				return $http({
					method: 'POST',
					url: url + 'tasks/group',
					data: data
				});
			}

			service.removeTask = function(data) {
				return $http({
					method: 'POST',
					url: url + 'tasks/remove',
					data: data
				});
			}

			service.updateStatus = function(data) {
				return $http({
					method:  'POST',
					url: url + 'tasks/updateStatus',
					data: data
				});
			}

			return service;
		}
	]);
});
