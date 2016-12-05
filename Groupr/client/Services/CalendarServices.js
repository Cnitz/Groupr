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

			service.proposedMeetingTimes = function(events, name, location, description, groupId) {
				var data = {
					groupId: groupId,
					name: name,
					location: location,
					description: description,
					events: events
				}
				console.log(data);
				return $http({
					method: 'POST',
					url: url + 'propose_meeting_times',
					data: data
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

			service.getPersonalCalendar = function() {
				var data = {
					calendarType: 'personal'
				}
				return $http({
					method: 'POST',
					url: url + 'get_events',
					data: data
				});
			}

			service.getGroupCalendar = function(groupId) {
				var data = {
					groupId: groupId,
					calendarType: 'group'
				}
				console.log(data);
				return $http({
					method: 'POST',
					url: url + 'get_events',
					data: data
				});
			}

			service.addGroupEvent = function(calendarEvent, groupId) {
				var data = {
					event: calendarEvent,
					groupId: groupId
				}
				console.log(data);
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

			service.scheduleAssistant = function(day, startTime, endTime, length, groupId) {
				var data = {
					day: day,
					startTime: startTime,
					endTime: endTime,
					length: length,
					groupId: groupId
				}
				return $http({
					method: 'POST',
					url: url + 'schedule_assistant',
					data: data
				});
			}
			service.authenticateUser = function() {
				console.log("testing");
				return $http({
					method: 'get',
					url: "http://localhost:3000/api/calendar/auth/google",
				});
			}

			service.googleAuth = function() {
				console.log("googleAuth");
				return $http({
					method: 'get',
					url: url + 'auth/google',
					headers: {
						'Content-Type': 'application/json, text/plain, */*'
					},
				});
			}

			service.searchEvents = function(eventList, key) {
				var idx = -1;
    			eventList.forEach(function(event, index) {
			        if (event.name == key.name) {
			        	ind = index;
			        }
			    })
			    return idx;
			}

			return service;
		}
	]);
});
