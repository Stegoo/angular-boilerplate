(function () {

    'use strict';

    /** Declare the modules in our app **/
    angular.module('app.service', [
        'ngResource'
    ]);

    angular.module('app.directive', [
    ]);

	angular.module('app.filter', [
    ]);

    angular.module('app.templates', [
    ]);

	/** This is our main module (app), the second parameter is our dependencies **/
    angular.module('app', [
        /** AngularJS dependencies **/
        'ngCookies',
        'ngSanitize',

        /** 3rd party lib **/
        'ui.router',
        'ui.bootstrap',

        /** Our modules **/
        'app.directive',
        'app.service',
        'app.filter',
        'app.templates'
    ]);

})();