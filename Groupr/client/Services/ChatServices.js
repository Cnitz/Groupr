define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.MessagingServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/chat/';
			
			service.getMessages = function() {
				return $http({
					method: 'GET',
					url: url + '',
				});
			}

			service.sendMessage =  function() {
				return $http({
					method: 'POST',
					url: url + '',
				});
			}

			return service;
		}
	]);
});