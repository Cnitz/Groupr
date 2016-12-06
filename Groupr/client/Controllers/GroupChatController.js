define([
    './Module'
], function (module) {
    return module.controller('Groupr.Controllers.GroupChatController', [
        '$scope',
        '$state',
        'Groupr.Services.GroupServices',
        'Groupr.Services.AccountServices',
        '$stateParams',
        function IndividualGroupController($scope, $state, GroupServices, AccountServices, $stateParams, CalendarServices, $mdSidenav, $log) {
            var vm = this;
            {
                vm.groups = [];
                vm.tasks = [];
            }
            vm.goHome = goHome;
            vm.groupCalendar = groupCalendar;
            vm.logout = logout;
            vm.addEvent = addEvent;
            vm.deleteEvent = deleteEvent;
            vm.editEvent = editEvent;
            vm.refresh = refresh;
            vm.navigateToScheduleAssistant = navigateToScheduleAssistant;
            vm.navigateToGroupChat = navigateToGroupChat;
            $scope.currentNavItem = "groups";
            $scope.customFullscreen = false;
            $scope.users = [];
            vm.currGroup = "";
            vm.events = [];
            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.user = {};

            vm.leaveGroup = leaveGroup;
            vm.groupID = $stateParams.groupID;

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

            /*Navigates to Group Calendar sub-page*/
            function groupCalendar(){
              $state.go('groupCalendar',{groupID: g._id});
            }

            /*Navigates to Chat Subpage*/
            function navigateToGroupChat(){
              $state.go('groupChat',{groupID: g._id});
            }

            function activate() {
                if ($stateParams.groupID != null) {
                    AccountServices.getUser()
                    .then(
                        function(res) {
                            $scope.user = res.data;
                            console.log($scope.user);
                            CalendarServices.getGroupCalendar($stateParams.groupID)
                            .then(
                                function(result) {
                                    $scope.votingEvents = result.data.schedule_assistant.events;

                                    $scope.votingEvents.forEach(function(event){
                                      event.selected = false;
                                    })

                                    $scope.votingActive = result.data.schedule_assistant.active;
                                    vm.events = result.data.events;
                                    vm.voters = result.data.schedule_assistant.voters;
                                     /*console.log(result);
                                     console.log(vm.events);
                                     console.log($scope.votingEvents);
                                     console.log(vm.voters);*/

                                    if (votingActive) {
                                        vm.voters.forEach(function(voter) {
                                            if (voter === $scope.user.username) {
                                                $scope.hasVoted = true;
                                            }
                                        })
                                    }

                                    //console.log($scope.hasVoted);

                                },
                                function(result) {
                                    console.log(res.data);
                                })
                        },
                        function(res) {
                            console.log(res.data);
                        }
                    )

                    GroupServices.getGroupInfo($stateParams.groupID)
                    .then(
                        function(resOne) {
                            vm.currGroup = resOne.data;
                            var g = { group: vm.currGroup._id };
                            GroupServices.getTasks(g)
                            .then(
                                function (resTwo) {
                                    vm.tasks = resTwo.data;
                                },
                                function (resTwo) {
                                    console.log(resTwo.data);
                                })
                        },
                        function (resOne) {
                            console.log(res.data);
                        }
                    )
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

            function navigateToScheduleAssistant() {
                $state.go('scheduleAssistant', { groupID: $stateParams.groupID });
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
