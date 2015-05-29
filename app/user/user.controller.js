(function () {
    'use strict';

    angular.module('app').controller('UsersCtrl', ['$scope', 'Api', 'UsersResolve', 'Users', 'Alert', function ($scope, Api, UsersResolve, Users, Alert) {
        console.info('Users Ctrl');
        //Assign the users we have fetched in the resolve of our routing to our view
        $scope.users = Users.set(UsersResolve);

    }]);

    angular.module('app').controller('UserCtrl', ['$scope', 'Api', 'UserResolve', 'Alert', function ($scope, Api, UserResolve, Alert) {
        console.info('User Ctrl');
    }]);

})();
