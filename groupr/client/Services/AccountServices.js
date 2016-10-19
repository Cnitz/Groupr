define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.AccountServices', [
		'$http',
		'$cookies',
		function($http, $cookies) {
			var service = {};

			var cookie_token_key = 'grouprToken';

			service.userAccount = {
				user: {},
			}

			var url = 'http://localhost:3000/api/';
			
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

			service.logout = function() {
				$cookies.remove(cookie_token_key);
			}

			service.verifyToken = function() {
				return $http({
					method: 'GET',
					url: url + 'verify_token',
				});
			}
			return service;
		}
	]);
});