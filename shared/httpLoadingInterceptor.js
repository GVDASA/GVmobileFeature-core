angular.module('core.httpLoadingInterceptor', [
    'ionic'
])

.constant('$ionicLoadingConfig', {
    template: '<div class="text-center"><ion-spinner icon="crescent"></ion-spinner><p>Aguarde</p></div>',
    hideOnStateChange: true
})

.constant('START_REQUEST', '_START_REQUEST_')

.constant('END_REQUEST', '_END_REQUEST_')

.factory('httpLoadingInterceptor', function($rootScope, $q, START_REQUEST, END_REQUEST) {
    var openRequests = 0;

    var begin = function(config) {
        //console.log('begin','config.url', config.url);
        if (config.url && /\.html$/.test(config.url)) {
            //console.log('begin','config.url', config.url);
            config.ignoreInterceptor = true;
        };

        //console.log('begin','config.ignoreInterceptor', config.ignoreInterceptor);
        if (!config.ignoreInterceptor) {
            $rootScope.$broadcast(START_REQUEST);
            openRequests++;
            //console.log('begin:'+config.url, openRequests);
            //console.log(START_REQUEST, openRequests);
        }
    };

    var end = function(config) {
        if (!config.ignoreInterceptor) {
            openRequests--;
            //console.log(config.url, openRequests);
        }
        if (openRequests <= 0) {
            openRequests = 0;
            $rootScope.$broadcast(END_REQUEST);
            //console.log('end:' + config.url, openRequests);
        };
    };

    return {
        // optional method
        'request': function(config) {
            // do something on success
            // send notification a request has started
            begin(config);

            return config || $q.when(config);
        },
        'requestError': function(rejection) {
            //console.log('loading:requestError:',(rejection || {}).config || rejection);
            end((rejection || {}).config || rejection);
            return $q.reject(rejection);
        },
        // optional method
        'response': function(response) {
            //console.log('loading:response:',(response || {}).config || response);
            // do something on success
            end((response || {}).config || response);
            return response || $q.when(response);
        },
        // optional method
        'responseError': function(rejection) {
            //console.log('loading:responseError:',(rejection || {}).config || rejection);
            // do something on error
            end((rejection || {}).config || rejection);
            return $q.reject(rejection);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('httpLoadingInterceptor');
})

.run(function($rootScope, $timeout, $ionicLoading, START_REQUEST, END_REQUEST) {
    var showTimer = null;
    var hideTimer = null;

    function showLoadingIndicator() {
        hideTimer && $timeout.cancel(hideTimer);
        showTimer && $timeout.cancel(showTimer);
        hideTimer = null;
        showTimer = $timeout(function() {
            $ionicLoading.show();
        }, 300);
    };

    function hideLoadingIndicator() {
        showTimer && $timeout.cancel(showTimer);
        hideTimer && $timeout.cancel(hideTimer);
        showTimer = null;
        hideTimer = $timeout(function() {
            $ionicLoading.hide();
        }, 300);
    };

    $rootScope.$on(
        "$destroy",
        function(event) {
            hideTimer && $timeout.cancel(hideTimer);
            showTimer && $timeout.cancel(showTimer);
        }
    );

    $rootScope.$on(START_REQUEST, function(a) {
        showLoadingIndicator();
    });

    $rootScope.$on(END_REQUEST, function() {
        hideLoadingIndicator();
    });
});