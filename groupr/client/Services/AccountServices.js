define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.AccountServices', [
		'$http',
		function($http) {
			var service = {};

			service.userAccount = {
				user: {},
				token: '',
			}

			var url = 'http://localhost:3000/api/';
			
			service.login = function(credentials) {
				return $http({
					method: 'POST',
					url: url + 'login',
					data: credentials
				});
			}

			service.login_success = function(data) {
				console.log(data);
				service.userAccount.token = data.token;
				service.userAccount.user = data.user;
				console.log(service.userAccount);

			}
			
			service.signup = function(userAccount) {
				return $http({
					method: 'POST',
					url: url + 'signup',
					data: userAccount
				});
			}

			service.logout = function() {
				service.userAccount.token = '';
			}

			return service;
		}
	]);
});