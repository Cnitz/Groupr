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

			service.getEvents = function(calendarId) {
				return $http({
					method: 'POST',
					url: url + 'get_events',
					data: calendarId
				});
			}

			service.addGroupEvent = function(calendarEvent, groupId) {
				var data = {
					event: calendarEvent,
					groupId: groupId
				}
				return $http({
					method: 'POST',
					url: url + 'add_group_event',
					data: data
				});
			}

			service.deleteGroupEvent = function(calendarEvent, groupId) {
				var data = {
					event: calendarEvent,
					groupId: groupId
				}
				return $http({
					method: 'POST',
					url: url + 'delete_group_event',
					data: data
				});
			}

			service.editGroupEvent = function(calendarEvent, groupId) {
				var data = {
					event: calendarEvent,
					groupId: groupId
				}
				return $http({
					method: 'POST',
					url: url + 'edit_group_event',
					data: data
				});
			}

			return service;
		}
	]);
});