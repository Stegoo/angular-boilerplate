(function () {

    'use strict';

    /**
     * File configuring every end point used by the client application
     *
     * Exemple :
     *
     *  apiProvider.endpoint('user'). //how you refer to your endpoint in your controller,
     route('user/:id/:action'). //The server route
     defaultConfig({"intercept": false}). // The configuration that's going to be used for every actions in this endpoint (in this case, we prevent displaying popup when we have errors)
     customAction("GET", "get" {}, {"isArray" : true}). //You can override an existing action is you want to override default parameters
     customAction("POST", "login" {}, {"intercept" : true}); //Or simply add a custom action

     How to use it in your controller :

     1. inject the 'api' dependancy
     2. Make your queries :
     api.user.get().then(function(){}); // Fetch all users
     api.user.get({id: 1}).then(function(){}); // Fetch the user with id 1
     api.user.post({}, {"name": newUser}).then(function(){}); // Create a new user
     api.user.login({"id": "login"}, {"email": "email@email.com", "password": "toto4242"}).then(function(){}); //Log in a user
     */

    angular.module('app.service').config(['ApiProvider', function (ApiProvider) {

        /** These are examples, replace them with your base route and your real api endpoints */
        ApiProvider.setBaseRoute(window.api_url + 'api/' + (window.api_version || '1.0') + '/');

        ApiProvider.endpoint('user').
            route('user/:id/:action').
            customAction('GET', 'token', {'id': 'token'}, {});

        ApiProvider.endpoint('auth').
            route('auth/');

    }]);
})();