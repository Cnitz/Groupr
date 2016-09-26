define([
    './Module'
], function(module) {
    return module.controller('CloudView.Controllers.Folder', [
        '$scope',
        '$state',
        '$mdSidenav',
        function FolderController($scope, $state, $mdSidenav) {
			$scope.ui = {
				fab: {
					isOpen: false
				},
				sideNav: {
					toggleSidenav: function() {
		                $mdSidenav('left').toggle();
					}
	            },
				folder: {
					go: function(path) {
						//TODO: go-to folder
					},
					new_folder: function() {
						//TODO: new folder dialogue
					},
				},
				file: {
					open: {
						//TODO: open file?
					},
					new_file: function() {
						//TODO: new file dialogue
					}
				}
			};
            $scope.user = {
                hasName: true,
                username: 'john.doe123',
                name: 'John Doe',
                accounts: [{
                    type: 'Google',
                    username: 'john.doe123@googlemail.com',
                    active: true,
                    space: {
                        used: 1024,
                        available: 15 * 1024 * 1024 * 1024
                    }
                }, {
                    type: 'Google',
                    username: 'John.Doe@work.com',
                    active: true,
                    space: {
                        used: 960 * 1024 * 1024,
                        available: 5 * 1024 * 1024 * 1024
                    }
                }, {
                    type: 'Dropbox',
                    username: 'john.doe123',
                    active: false,
                    space: {
                        used: 14.5 * 1024 * 1024 * 1024,
                        available: 15 * 1024 * 1024 * 1024
                    }
                }],
				account_toggle: function(index) {
	                $scope.user.accounts[index].active = !$scope.user.accounts[index].active;
	            }
            };
            $scope.folder = {
                title: 'New Folder',
                account: 'Gmail', //TODO: Bacakend guy figure out datatype
                path: [{
                    name: 'Party',
                    pid: 1
                }, {
                    name: 'Suplies',
                    pid: 2
                }],
                subfolders: [],
                files: []
            }
            for (var i = 0; i < 13; i++) {
                $scope.folder.subfolders.push({
					name: 'Folder ' + (i + 1),
					pid: i+3
				});
            }
            for (var i = 0; i < 100; i++) {
                $scope.folder.files.push({
                    name: 'File  ' + (i + 1),
                    type: 'word',
                    account: i % $scope.user.accounts.length,
					pid: i
                });
            }
        }
    ]);
});
