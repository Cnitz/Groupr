define([
	'./Module'
], function(module) {
	return module.controller('CloudView.Controllers.Folder', [
		'$scope',
		'$state',
		'$mdSidenav',
		function FolderController($scope, $state, $mdSidenav) {
			console.log($state.params);
			$scope.user = {
				hasName:	false,
				username:	'',
				name:		'',
				accounts: []
			};
			$scope.folder = {
				title: '',
				account: '', //TODO: Bacakend guy figure out datatype
				path:	[],
				subfolders: [],
				files:	[]
			}
			$scope.toggleSidenav = function() {
				$mdSidenav('left').toggle();
			};
		}
	]);
});
