define([
    './Module'
], function (module) {
    return module.controller('Groupr.Controllers.GroupChatController', [
        '$scope',
        '$state',
        'Groupr.Services.GroupServices',
        'Groupr.Services.AccountServices',
        'Groupr.Services.ChatServices',
        '$stateParams',
        'Groupr.Services.CalendarServices',
        '$mdSidenav',
        '$log',
        function GroupChatController($scope, $state, GroupServices, AccountServices, ChatServices, $stateParams, CalendarServices, $mdSidenav, $log) {
            var vm = this;
            {
                vm.groups = [];
                vm.tasks = [];
            }
            vm.goHome = goHome;

            vm.checkForMessages = checkForMessages;
            vm.chatRefresh = setInterval(checkForMessages, 1000);
            vm.lastMessageDate = new Date();

            vm.groupCalendar = groupCalendar;
            vm.groupChat = groupChat;
            vm.groupTasks = groupTasks;
            vm.groupComplaints = groupComplaints;
            vm.logout = logout;
            vm.sendMessage = sendMessage;

            vm.refresh = refresh;
            $scope.currentNavItem = "groups";
            $scope.customFullscreen = false;
            $scope.users = [];

            $scope.newMessage = "";
            $scope.messages = [];
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
                clearInterval(vm.chatRefresh);
                GroupServices.leaveGroup(vm.groupID);
                $state.go('home');
            }

            function printDate(res){
                  var newDate = new Date(res.dateCreated);
                  return (newDate.getMonth() + 1) + '/' + newDate.getDate() + newDate.getHours() + ":" + newDate.getMinutes();
            }

            /*Navigates to Group Calendar sub-page*/
            function groupCalendar() {
                clearInterval(vm.chatRefresh);
                console.log("groupID: " + vm.groupID);
                $state.go('groupCalendar', { groupID: vm.groupID });
            }

            function checkForMessages(){
              ChatServices.getLastMessage().then(
                function(res){
                  var date2 = new Date(res.data.date);
                  if(vm.lastMessageDate < date2){
                  ChatServices.getMessages($stateParams.groupID).then(
                      function(res2){
                        $scope.messages = res2.data;
                        vm.lastMessageDate = new Date();
                      }, function(res2){
                        console.log("Failing in res2");
                      }
                    )
                  }

                }, function(res){
                  console.log("Failing in res1");
                }
              )
            }

            function groupChat() {
                clearInterval(vm.chatRefresh);
                $state.go('groupChat', { groupID: vm.groupID });
            }

            function groupTasks() {
                clearInterval(vm.chatRefresh);
                $state.go('groupindiv', { groupID: vm.groupID });
            }

            function groupComplaints(){
                clearInterval(vm.chatRefresh);
                $state.go('groupComplaints', {groupID: vm.groupID});
            }

            function sendMessage(){
              console.log($scope.newMessage);
              ChatServices.sendMessage($scope.newMessage, vm.groupID);
            }

            function activate() {

              ChatServices.getMessages($stateParams.groupID).then(
                  function(res){
                    console.log(res);
                    $scope.messages = res.data;
                  }, function(res){
                    console.log(res);
                  }
                )

              }
            activate();

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
