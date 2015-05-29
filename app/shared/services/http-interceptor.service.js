(function () {
    'use strict';

    /**
     * Intercept http calls.
     */
    angular.module('app.service').factory('HttpInterceptor', ['$q', '$injector', '$rootScope', '$cookieStore', 'User', function ($q, $injector, $rootScope, $cookieStore, User) {

        /**
         * Find identical requests in pending requests
         */
        function checkForDuplicates(requestConfig) {
            var $http = $injector.get('$http');
            var duplicated = $http.pendingRequests.filter(function (pendingReqConfig) {
                return (requestConfig.requestId && pendingReqConfig.requestId && pendingReqConfig.requestId === requestConfig.requestId);
            });
            return duplicated.length > 0;
        }

        /**
         * Cancel the http request to prevent multiple submissions of the same http requests at the same time
         */
        function buildRejectedRequestPromise(requestConfig) {
            var deferer = $q.defer();

            // The commented snippet below 'throw' a new error request
            /*// build response for duplicated request
             var response = {data: {'exception': t('trop de requêtes simultanées'), 'error': t('Merci d\'attendre de recevoir la réponse à votre précédente action avant de l\'effectuer à nouveau.')},
             headers: {},
             status: 429, //Too Many Requests
             config: requestConfig};
             console.info('Such request is already in progres, rejecting this one with', response);
             // reject promise with response above
             deferer.reject(response);*/

            return deferer.promise;
        }


        return {
            // On request success
            request: function (config) {
                //console.log(config); // Contains the data about the request before it is sent.

                var user = User.get();
                //If the user in session has an api_key, set it in the header of every http request
                if (user.api_key)
                    config.headers.Authorization = user.api_key;
                //If the user in session is logas someone else, set his id in the header of every http request
                if (user.logas && user.logas.id)
                    config.headers.Logas = user.logas.id;

                //console.log(checkForDuplicates(config));
                if (checkForDuplicates(config)) {
                    return buildRejectedRequestPromise(config);
                }
                //else
                //{
                /*if (config.waiter)
                 Alert.add("treatment", typeof config.waiter == "string" ? config.waiter : t("Traitement en cours"), config.url, 0);*/
                //}

                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                //console.log(rejection); // Contains the data about the error on the request.

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                //console.log(response); // Contains the data from the response.
                /*if (response.config && response.config.waiter)
                 Alert.close(response.config.url);*/
                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failure
            responseError: function (rejection) {
                //console.log('rejection', rejection); // Contains the data about the error.
                /*	if (rejection.config && rejection.config.waiter)
                 Alert.close(rejection.config.url);*/
                //Check whether the intercept param is set in the config array. If the intercept param is missing or set to true, we display a modal containing the error
                if ((rejection.config && typeof rejection.config.intercept === 'undefined' || rejection.config.intercept) &&
                    rejection.status !== 404 && rejection.data) {
                    if (rejection.data.detail)
                        rejection.data.error = rejection.data.detail;
                    console.info('emit event error modal');
                    $rootScope.$emit('errorModal', rejection.data);
                }

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }]);

})();