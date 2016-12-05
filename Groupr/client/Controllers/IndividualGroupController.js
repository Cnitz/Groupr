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
        function IndividualGroupController($scope, $state, GroupServices, AccountServices, $stateParams, CalendarServices, $mdSidenav, $log, $mdDialog, $sce, $filter) {
            var vm = this;
            {
                vm.groups = [];
                vm.tasks = [];
            }
            vm.goHome = goHome;
            vm.navigateToGroups = navigateToGroups;
            vm.groupCalendar = groupCalendar;
            vm.logout = logout;
            vm.addEvent = addEvent;
            vm.deleteEvent = deleteEvent;
            vm.editEvent = editEvent;
            vm.refresh = refresh;
            vm.printDate = printDate;
            vm.printTimes = printTimes;
            vm.navigateToScheduleAssistant = navigateToScheduleAssistant;
            vm.vote = vote;
            vm.submitVote = submitVote;
            vm.cancelVoting = cancelVoting;
            vm.endVoting = endVoting;
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

                if(month.length < 2) month = '0' + month;
                if(day.length < 2) day = '0' + day;

                $scope.realDueDate = $filter("date") (new Date(year, month, day), 'yyyy-MM-dd');
                if(task.dueDate == null)
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
                    '               <input ng-model="title" type="text" name="title" placeholder="New Task Title" ng-init="title=\'' + task.title + '\'">' +
                    '           </md-input-container>' +
                    '           <md-input-container>' +
                    '               <label>Task Description</label>' +
                    '               <input ng-model="description" type="text" name="description" placeholder="New Task Description" ng-init="description=\'' + task.description + '\'">' +
                    '           </md-input-container>' +
                    '           <md-input-container>' +
                    '               <label>Due Date (optional)</label>' +
                    '               <input ng-model="duedate" type="text" name="duedate" placeholder="yyyy-MM-dd" ng-init="duedate=\'' + $scope.realDueDate + '\'">' +
                    '           </md-input-container>' +
                    '   </md-dialog-content>' +
                    '   <md-dialog-actions layout="row">' +
                    '       <md-button ng-click="answer(\'save\')" class="md-primary">' +
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
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        $scope.status = 'You cancelled the dialog.';
                    });

            };

            function DialogController($scope, $mdDialog) {
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
                                console.log("failure");
                                console.log(res.data.message);
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
                                console.log("Failure.");
                                console.log(res.data);
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
                                        console.log("Failure");
                                        console.log(res.data.message);
                                    })
                            }, function (res) {
                                console.log("Failure.");
                                console.log(res.data);
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
                GroupServices.leaveGroup(vm.groupID);
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
                            console.log(res.data);
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

            /* Vote for one proposed time, front end only */
            function vote(index) {
                $scope.checkBoxData[index] = true;
            }

            /* submit all votes and store in back end database */
            function submitVote() {

            }

            /* cancel the voting, back end to clear schedule assistant fields */
            function cancelVoting() {

            }

            /* back end, take current highest, send the index of the event */
            function endVoting() {

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

            function addEvent() {
                var event = {
                    name: $scope.eventName,
                    description: $scope.eventDescription,
                    location: $scope.eventLocation,
                    startTime: $scope.myDate,
                    endTime: $scope.myDate
                }

                //Now reading in the time strings and setting times. Remove when better time picker is made
                var newStartDate = new Date($scope.myDate);
                var newEndDate = new Date($scope.myDate);

                var time = $scope.startTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newStartDate.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
                newStartDate.setMinutes(parseInt(time[2]) || 0);

                var time2 = $scope.endTime.match(/(\d+)(?::(\d\d))?\s*(p?)/);
                newEndDate.setHours(parseInt(time2[1]) + (time2[3] ? 12 : 0));
                newEndDate.setMinutes(parseInt(time2[2]) || 0);

                event.startTime = newStartDate;
                event.endTime = newEndDate;
                //End Time Reading Hack


                console.log(event);
                CalendarServices.addGroupEvent(event, $stateParams.groupID)
                    .then(
                    function (result) {
                        console.log('success adding event');
                        refresh();
                    },
                    function (result) {
                        console.log(result.data);
                    }
                    )
            }

            function deleteEvent(event) {
                CalendarServices.deleteGroupEvent(event, $stateParams.groupID)
                    .then(
                    function (result) {
                        console.log('success deleting event');
                        refresh();
                    },
                    function (result) {
                        console.log(result.data);
                    }
                    )
            }

            function editEvent() {
                CalendarServices.editGroupEvent(event, $stateParams.groupID)
                .then(
                    function (result) {
                        refresh();
                    },
                    function (result) {
                        console.log(result.data);
                    }
                )
            }

            function refresh() {
                CalendarServices.getGroupCalendar($stateParams.groupID)
                .then(
                    function (result) {
                        vm.events = result.data.events;
                        console.log(vm.events);
                    },
                    function (result) {
                        console.log(result.data);
                    }
                )
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
