(function () {

    'use strict';

    /**
        In this file, we set the route for our pages.
        If it's getting too large, you can define a route file for each module
    **/
    angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('404'); //When no routes is found

        $stateProvider.state('root', {
            url: '/',
            templateUrl: baseUrl('template/layout.html'),
            authorization: { connected: true },
        });

        $stateProvider.state('user', {
            url: '/user',
            abstract: true, // abstract state, there is no way you could use ui-sref="state"
            authorization: { connected: true }
        }).state('user.list', {
            url: '', // default view for the state 'project' (/project)
            templateUrl: baseUrl('user/list.html'),
            authorization: { connected: true },
            resolve: {
                /** You can query data before accessing your controller. These resolves are injected in the controller. If this request fails, you won-t acces the page **/
                UsersResolve: ['Api', function(Api){
                    //return  Api.user.get();
                    return true;
                }]
            },
            controller: 'UsersCtrl'
        }).state('user.detail', {
            url: '/{id:[0-9]{1,8}}',
            templateUrl: baseUrl('user/user.html'),
            authorization: { connected: true },
            resolve: {
                UserResolve: ['Api', '$stateParams', function(Api, $stateParams){
                    return Api.user.get({'id': $stateParams.id});
                }],
            },
            controller: 'UserCtrl'
        });

        $stateProvider.state('404', {
            url: '/*path',
            templateUrl: baseUrl('template/404.html')
        });

    }]);

})();