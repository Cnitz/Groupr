define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.CalendarServices', [
		'$http',
		function($http) {
			var service = {};

			var url = 'http://localhost:3000/api/calendar/';


			service.addEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'add_event',
					data: calendarEvent
				});
			}

			service.deleteEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'delete_event',
					data: calendarEvent
				});
			}

			service.editEvent = function(calendarEvent) {
				return $http({
					method: 'POST',
					url: url + 'edit_event',
					data: calendarEvent
				});
			}

			service.getEvents = function(calendar) {
				return $http({
					method: 'POST',
					url: url + 'get_events',
					data: calendar
				});
			}

			return service;
		}
	]);
});