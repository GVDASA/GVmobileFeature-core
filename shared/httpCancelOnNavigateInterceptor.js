angular.module('core.httpCancelOnNavigateInterceptor', [
    'ionic'
])

.constant('HTTP_CANCELED', "http-canceled")

.service('httpCancelationService', function($q, HTTP_CANCELED) {
    var httpCancelationService = {
        cancel: cancel,
        configureRequest: configureRequest
    };
    return httpCancelationService;
    //-----------------------------------
    function cancel() {
        if (httpCancelationService._httpCancelationToken) {
            httpCancelationService._httpCancelationToken.resolve(HTTP_CANCELED);
        };
        httpCancelationService._httpCancelationToken = $q.defer();
    };

    function configureRequest(config) {
        if (config && httpCancelationService._httpCancelationToken && !config.ignoreInterceptor) {
            config.timeout = httpCancelationService._httpCancelationToken.promise;
        };
        return config;
    }
})

.factory('httpCancelationInterceptor', function($q, httpCancelationService) {
    return {
        'request': function(config) {
            httpCancelationService.configureRequest(config)
            return config || $q.when(config);
        },
    }
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('httpCancelationInterceptor');
})

// Cancela requisições em andamento ao trocar de página.
.run(function($rootScope, httpCancelationService) {
    $rootScope.$on('$stateChangeSuccess', function() {
        httpCancelationService.cancel();
    });
});