define([
	'./Module'
], function(module) {
	return module.factory('CloudView.Services.AccountServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:8081/';
			
			service.login = function(credentials) {
				return $http({
					method: 'POST',
					url: url + 'login',
					data: credentials
				});
			}
			
			service.signup = function(userAccount) {
				return $http({
					method: 'POST',
					url: url + 'signup',
					data: userAccount
				});
			}

			service.addGoogleDriveAccount = function(googleDriveCredentials) {
				return $http({
					method: 'POST',
					url: url + '',
					data: googleDriveCredentials
				}); 
			}

			service.addDropboxAccount = function(dropboxCredentials) {
				return $http({
					method: 'POST',
					url: url + '',
					data: dropboxCredentials
				});
			}

			service.addOneDriveAccount = function(oneDriveCredentials) {
				return $http({
					method: 'POST',
					url: url + '',
					data: oneDriveCredentials
				});
			}
			
			return service;
		}
	]);
});