define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.MessagingServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/chat/';
			
			service.getMessages = function(groupID) {
				return $http({
					method: 'GET',
					url: url + groupID,
				});
			}

			service.sendMessage = function(message, groupID) {
				return $http({
					method: 'POST',
					url: url + groupID+'/send',
					data: message
				});
			}

			return service;
		}
	]);
});