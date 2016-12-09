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

			var url = 'http://localhost:3000/api/account/';

			service.login = function(credentials) {
				console.log(url+'login');
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

			service.getUser = function() {
				return $http({
					method: 'GET',
					url: url + 'get_user',
				});
			}

			service.updatePassword = function(newPassword, curPassword, email){
				var data = {
					email: email,
					newPassword: newPassword,
					curPassword: curPassword,
				}
				return $http({
					method: 'POST',
					url: url + 'updatePassword',
					data: data
				});
			}



			service.randomPassword = function(email){
				var length = 8,
				charset = "abcdefghijklmnopqrstuvwxyz@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
				retVal = "";
				for (var i = 0, n = charset.length; i < length; ++i) {
					retVal += charset.charAt(Math.floor(Math.random() * n));
				}
				var data = {
					email: email,
					newPassword : retVal
				}
				return $http({
					method: 'POST',
					url: url + 'randomizePassword',
					data: data
				});
			}
			return service;
		}
	]);
});
