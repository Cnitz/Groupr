define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.CalendarServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/';


			service.addEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'calendar/add_event',
					data: calendarEvent
				});
			}

			service.deleteEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'calendar/delete_event',
					data: calendarEvent
				});
			}

			service.editEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'calendar/edit_event',
					data: calendarEvent
				});
			}

			return service;
		}
	]);
});