define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.EmailService', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/emailNotifications/';

			service.sendTestEmail = function() {
				return $http({
					method: 'GET',
					url: url + 'sendTestEmail',
				});
			}

			service.sendBasicEmail = function(passedEmail, passedSubject, passedText) {
				var data =  {
					tooEmail: passedEmail,
					subject: passedSubject,
					text: passedText,
				}
				return $http({
					method: 'POST',
					url: url + 'sendBasicEmail',
					data: data
				});
			}
			service.sendGroupEmail = function(subjectEmail, textMail, group_id) {
				var data =  {
					subjectEmail: subjectEmail,
					textMail: textMail,
					group_id: group_id,
				}
				return $http({
					method: 'POST',
					url: url + 'sendGroupEmail',
					data: data
				});
			}

			service.updateEmailNotifications = function(value) {
				var data =  {
					result: value
				}
				return $http({
					method: 'POST',
					url: url + 'updateEmailNotifications',
					data: data
				});
			}

			service.sendPasswordEmail = function(email) {
				var data =  {
					email: email
				}
				return $http({
					method: 'POST',
					url: url + 'sendPasswordEmail',
					data: data
				});
			}
			service.meetingsToday = function() {
			var	data = {

				}
				return $http({
					method: 'POST',
					url: url + 'meetingsToday',
					data: data
				});
			}

			return service;
		}
	]);
});
