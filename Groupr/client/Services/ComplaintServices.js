define([
	'./Module'
], function(module) {
	return module.factory('Groupr.Services.ComplaintServices', [
		'$http',
		function($http) {
			var service = {};

			

			var url = 'http://localhost:3000/api/complaints/';
			
			service.createComplaint = function(complaint) {
				return $http({
					method: 'POST',
					url: url + 'create',
					data: complaint
				});
			}
			
			service.getAllComplaints = function(groupid) {
				return $http({
					method: 'GET',
					url: url + 'group/' + groupid
				});
			}

			service.getComplaintByID = function(complaintID) {
				return $http({
					method: 'GET',
					url: url + complaintID
				});
			}

			return service;
		}
	]);
});