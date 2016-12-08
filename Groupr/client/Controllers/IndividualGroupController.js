define([
    './Module'
], function (module) {
    return module.controller('Groupr.Controllers.IndividualGroup', [
        '$scope',
        '$state',
        'Groupr.Services.GroupServices',
        'Groupr.Services.AccountServices',
        '$stateParams',
        'Groupr.Services.CalendarServices',
        '$mdSidenav',
        '$log',
        '$mdDialog',
        '$sce',
        '$filter',
        'ngToast',
        function IndividualGroupController($scope, $state, GroupServices, AccountServices, $stateParams, CalendarServices, $mdSidenav, $log, $mdDialog, $sce, $filter, ngToast) {
            var vm = this;
            {
                vm.groups = [];
                vm.tasks = [];
            }
            vm.goHome = goHome;
            vm.navigateToGroups = navigateToGroups;
            vm.groupCalendar = groupCalendar;
            vm.groupChat = groupChat;
            vm.groupTasks = groupTasks;
            vm.logout = logout;
            vm.printDate = printDate;
            vm.printTimes = printTimes;
            vm.navigateToScheduleAssistant = navigateToScheduleAssistant;
            $scope.currentNavItem = "indiv";
            $scope.customFullscreen = false;
            $scope.title = "";
            $scope.description = "";
            $scope.duedate = "";
            $scope.users = [];
            $scope.myDate = new Date();
            vm.currGroup = "";
            vm.events = [];
            $scope.pendingEvents = [];
            $scope.checkBoxData = [];
            $scope.toggleLeft = buildDelayedToggler('left');
            $sce.trustAsResourceUrl("http://lh3.ggpht.com/_LOoKjxVTcbc/Snzl2ZTp6DI/AAAAAAAAGn0/OG3FBZrF_N4/6.png");

            vm.leaveGroup = leaveGroup;
            vm.groupID = $stateParams.groupID;

            $scope.openEditDialog = function (task) {
                var d = new Date(task.dueDate),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();


                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                $scope.realDueDate = $filter("date")(new Date(year, month, day), 'yyyy-MM-dd');
                if (task.dueDate == null)
                    $scope.realDueDate = "";
                $mdDialog.show({
                    controller: DialogController,
                    template:
                    '<md-dialog aria-label="Edit Task">' +
                    '   <form ng-cloak>' +
                    '       <md-toolbar>' +
                    '           <div class="md-toolbar-tools">' +
                    '               <h2>Edit Task</h2>' +
                    '               <span flex></span>' +
                    '               <md-button class="md-icon-button" ng-click="cancel()">' +
                    '                   <md-icon aria-label="Close dialog">X</md-icon>' +
                    '               </md-button>' +
                    '           </div>' +
                    '       </md-toolbar>' +
                    '   <md-dialog-content>' +
                    '       <div class="md-dialog-content" layout="column">' +
                    '           <md-input-container>' +
                    '               <label>Task Name</label>' +
                    '               <input ng-model="formdata.title" type="text" name="formdata.title" placeholder="New Task Title" ng-init="formdata.title=\'' + task.title + '\'">' +
                    '           </md-input-container>' +
                    '           <md-input-container>' +
                    '               <label>Task Description</label>' +
                    '               <input ng-model="formdata.desc" type="text" name="formdata.desc" placeholder="New Task Description" ng-init="formdata.desc=\'' + task.description + '\'">' +
                    '           </md-input-container>' +
                    '           <md-input-container>' +
                    '               <label>Due Date (optional)</label>' +
                    '               <input ng-model="formdata.dd" type="text" name="formdata.dd" placeholder="yyyy-MM-dd" ng-init="formdata.dd=\'' + $scope.realDueDate + '\'">' +
                    '           </md-input-container>' +
                    '   </md-dialog-content>' +
                    '   <md-dialog-actions layout="row">' +
                    '       <md-button ng-click="answer(formdata)" class="md-primary">' +
                    '           Save Changes' +
                    '       </md-button>' +
                    '       <md-button ng-click="answer(\'cancel\')" class="md-primary" style="color:darkred">' +
                    '           Cancel' +
                    '       </md-button>' +
                    '   </md-dialog-actions>' +
                    '</md-dialog>',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true
                })
                    .then(function (answer) {
                        console.log("New Title: " + answer.title + "; New Desc: " + answer.desc + "; New Due Date: " + answer.dd);
                    }, function () {
                        console.log('You cancelled the dialog.');
                    });

            };

            function DialogController($scope, $mdDialog) {
                $scope.title = {};

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }


            $scope.addTask = function (data) {
                if ($scope.title == "" || $scope.description == "")
                    return;
                var task = { group: vm.currGroup._id, title: $scope.title, description: $scope.description, dueDate: $scope.duedate };
                GroupServices.addTask(task)
                    .then(function (res) {
                        console.log(res.data);
                        vm.tasks.push(task);

                        var g = { group: vm.currGroup._id };
                        GroupServices.getTasks(g)
                            .then(function (res) {
                                vm.tasks = res.data;
                            }, function (res) {
                                ngToast.danger(res.data.message);
                            });
                    })
            };
            $scope.removeTask = function (data) {
                for (var i = 0; i < vm.tasks.length; i++) {
                    if (vm.tasks[i].title == data) {
                        var task = { taskId: vm.tasks[i]._id };
                        console.log(task);
                        GroupServices.removeTask(task)
                            .then(function (res) {
                                console.log("Success!");
                                console.log(res.data);
                                vm.tasks.splice(i, 1);
                            }, function (res) {
                                ngToast.danger(res.data.message);
                            });

                        break;
                    }
                }
            };

            $scope.addUserToTask = function (task) {
                AccountServices.getUser()
                    .then(function (result) {
                        var user = result.data;
                        var data = { user: user.name, taskId: task._id };
                        GroupServices.addUserToTask(data)
                            .then(function (res) {
                                console.log("Success!");
                                console.log(res.data);
                                var g = { group: vm.currGroup._id };
                                GroupServices.getTasks(g)
                                    .then(function (res) {
                                        vm.tasks = res.data;
                                    }, function (res) {
                                        ngToast.danger(res.data.message);
                                    })
                            }, function (res) {
                                ngToast.danger(res.data.message);
                            });
                    });
            };

            $scope.statusChanged = function (task) {
                console.log(task);

                GroupServices.updateStatus(task._id)
                    .then(function (res) {
                        console.log("update status success!");
                        console.log(res);
                    }, function (res) {
                        console.log("update status failure!");
                        console.log(res);
                    });


            };

            function leaveGroup() {
                GroupServices.leaveGroup(vm.groupID)
                    .then(function (res) {
                        console.log("success:");
                        console.log(res.data);
                        console.log(group);;
                    }, function (res) {
                        ngToast.danger(res.data.message);
                    });
                $state.go('home');
            }

            function navigateToGroups() {
                $state.go('groups');
            }

            /*Navigates to Group Calendar sub-page*/
            function groupCalendar() {
                console.log("groupID: " + vm.groupID);
                $state.go('groupCalendar', { groupID: vm.groupID });
            }

            function groupChat() {
                $state.go('groupChat', { groupID: vm.groupID });
            }

            function groupTasks() {
                $state.go('groupindiv', { groupID: vm.groupID });
            }

            function activate() {
                if ($stateParams.groupID != null) {
                    GroupServices.getGroupInfo($stateParams.groupID)
                        .then(function (resOne) {
                            vm.currGroup = resOne.data;
                            var g = { group: vm.currGroup._id };

                            GroupServices.getTasks(g)
                                .then(function (resTwo) {
                                    vm.tasks = resTwo.data;
                                }, function (resTwo) {
                                    console.log(resTwo.data);
                                });
                            CalendarServices.getGroupCalendar($stateParams.groupID)
                                .then(
                                function (resultThree) {
                                    console.log(resultThree.data.events);
                                    vm.events = resultThree.data.events;
                                    console.log(vm.events);
                                },
                                function (resultThree) {
                                    console.log(resultThree);
                                }
                                )

                        }, function (resOne) {
                            ngToast.danger(resOne.data.message);
                        });



                }
            }

            activate();

            for (var i = 0; i < vm.tasks.length; i++) {
                $scope.checkBoxData[i] = vm.tasks[i].status;
            }
            console.log($scope.checkBoxData);

            /**
            * Supplies a function that will continue to operate until the
            * time is up.
            */
            function debounce(func, wait, context) {
                var timer;

                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }

            /**
            * Build handler to open/close a SideNav; when animation finishes
            * report completion in console
            */
            function buildDelayedToggler(navID) {
                return debounce(function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }

            function goHome() {
                $state.go('home');
            }

            function logout() {
                AccountServices.logout();
                $state.go('main');
            }

            /* if there is no current vote, navigate to the schedule assistant page to create a new "doodle" */
            function navigateToScheduleAssistant() {
                $state.go('scheduleAssistant', { groupID: $stateParams.groupID });
            }

            function printDate(event) {
                var newDate = new Date(event.startTime);
                return (newDate.getMonth() + 1) + '/' + newDate.getDate();
            }

            function printTimes(event) {
                var newStartTime = new Date(event.startTime);
                var newEndTime = new Date(event.endTime);

                return newStartTime.getHours() + ':' + newStartTime.getMinutes() + ' - ' + newEndTime.getHours() + ':' + newEndTime.getMinutes()
            }

            return vm;
        }
    ])
        .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
            $scope.close = function () {
                // Component lookup should always be available since we are not using 'ng-if'
                $mdSidenav('left').close()
                    .then(function () {
                        $log.debug("close LEFT is done");
                    });
            };
        });

});
