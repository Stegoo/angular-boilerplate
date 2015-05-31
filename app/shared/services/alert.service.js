(function () {
    'use strict';
    /**
     * Shared service to generate dynamic alerts.
     * This is just a wrapper relying on the bootstrap-ui directive.
     *
     *  How to use this service :
     *
     *  1. BY DEFAULT ALREADY PRESENT IN THE layout.phtml
     *  _ Add this directive in your html : <alert class="alert" ng-repeat="alert in alerts" type="{{alert.type}}" close="alert.close()">{{alert.msg}}</alert>
     *
     *  2.In your controller, inject the 'Alert' service as a dependency :
     * .controller('ExampleCtrl', ['$scope', 'Alert', function($scope, Alert) {
     *
     *  //Add an Alert wherever it pleases you
     *  Alert.add('success',  t('Data received.'));
     *
     * }]);
     *
     * Stylized type are : 'success', 'danger', 'info', 'warning'.
     * Just overload these styles or add some if you want to handle and customize more types.
     */
    var alertServiceFactory = function ($rootScope, $timeout) {

        //Add an array of alerts to the application's root scope (all others scopes are children of the root scope).
        $rootScope.alerts = [];

        var alertService = {};

        /*
         * Public method to add an alert to the alerts array.
         * @type : used to stylize the alert
         * @msg : content of the alert
         * @name (optional): identifier of the alert (useful if you want to retrieve it later)
         * @timeout (optional) : parameter to set the timeout of the alert (in milliseconds). If you want the alert to persist, set 0. Default value is 3s.
         */
        alertService.add = function (type, msg, name, timeout) {
            if (!name)
                name = Math.round(Math.random() * 100000); // generate a random id
            $rootScope.alerts.push({'type': type, 'msg': msg, 'close': closeAlert, 'name': name});
            if (typeof timeout === 'undefined' || timeout === null)
                closeAlertTimeOut(3000, name);
            else if (timeout > 0)
                closeAlertTimeOut(timeout, name);
            return {
                'close': function () {
                    alertService.close(name);
                }
            };
        };

        /*
         * Public method to remove a specific alert from the alerts array.
         * This method is only needed when you want to close an alert open somewhere else (e.g: httpinterceptor.service.js where we open an alert where we receive a request but we close it once the request has been completed)
         * @name : the name set when you added the alert
         */
        alertService.close = function (name) {
            if (name) {
                for (var i = 0; i < $rootScope.alerts.length; i++) {
                    if ($rootScope.alerts[i] && $rootScope.alerts[i].name === name) {
                        closeAlert($rootScope.alerts[i]);
                    }
                }
                //console.log($rootScope.alerts);
            }
            else
                closeAlert();
        };

        /*
         * Private method deleting the alert from the alerts array
         */
        var closeAlert = function (alert) {
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        };

        /*
         * Private method deleting the alert after 'timeout' seconds
         */
        var closeAlertTimeOut = function (timeout, name) {
            //Use the angular $timeout and never the old javascript setTimeout
            $timeout(function () {
                alertService.close(name);
            }, timeout);
        };

        return alertService;
    };

    angular.module('app.service').factory('Alert', [ '$rootScope', '$timeout', alertServiceFactory]);

})();