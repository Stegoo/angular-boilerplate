(function () {

    'use strict';

    /**
        In this file, we set the route for our pages.
        If it's getting too large, you can define a route file for each module
    **/
    angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('404'); //When no routes is found

        $stateProvider

        .state('root', {
            url: '/',
            views: {

                // the main template will be placed here (relatively named)
                '': {
                        templateUrl: baseUrl('template/layout.html')
                },
                'header': {
                    templateUrl: baseUrl('template/header.html')
                },
                 'footer': {
                    templateUrl: baseUrl('template/footer.html')
                }
            }
        })

        .state('root.user', {
            url: 'user',
            abstract: true, // abstract state, there is no way you could use ui-sref="state"
            templateUrl: baseUrl('user/user.html')
        }).state('root.user.list', {
            url: '', // default view for the state 'project' (/project)
            templateUrl: baseUrl('user/list.html'),
            resolve: {
                /** You can query data before accessing your controller. These resolves are injected in the controller. If this request fails, you won-t acces the page **/
                UsersResolve: ['Api', function(Api){
                    /** uncommeted this line when your api is ready **/
                    //return  Api.user.get();
                    return true;
                }]
            },
            controller: 'UsersCtrl'
        }).state('root.user.detail', {
            url: '/{id:[0-9]{1,8}}',
            templateUrl: baseUrl('user/detail.html'),
            resolve: {
                UserResolve: ['Api', '$stateParams', function(Api, $stateParams){
                    return Api.user.get({'id': $stateParams.id});
                }],
            },
            controller: 'UserCtrl'
        })

        .state('root.about', {
            url: 'about',
            templateUrl: baseUrl('template/about.html')
        })

        .state('404', {
            url: '/*path',
            templateUrl: baseUrl('template/404.html')
        });

    }]);

})();