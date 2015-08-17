angular.module('core.push', [
    'ionic',
    'core.navigation',
    'core.gvPush',
    'core.auth'
])

.factory('pushService', function($http, APP_CONFIG) {
    // Desregistra deviceId vinculado ao usuário do servidor da API do produto
    function unregisterOnClientApi(deviceToken) {
        console.log('Desregistrando deviceId na api do cliente:> ~/api/push/unregister');
        return $http.post('~/api/push/unregisterByApp', {
            deviceId: deviceToken,
            plataforma: ionic.Platform.isAndroid() ? 1 : 2,
            appKey: APP_CONFIG.portalClientId
        }, {
            cache: false,
            ignoreInterceptor: true
        }).error(function() {
            console.log('unregisterOnClientApi error : ', arguments);
        }).success(function() {
            console.log('unregisterOnClientApi success : ', arguments);
        });
    };

    function registerOnClientApi(deviceToken) {
        console.log("enviando deviceId para api cliente!");
        return $http.post('~/api/push/registerByApp', {
            deviceId: deviceToken,
            plataforma: ionic.Platform.isAndroid() ? 1 : 2,
            appKey: APP_CONFIG.portalClientId
        }, {
            cache: false,
            ignoreInterceptor: true
        }).error(function() {
            console.log('registerOnClientApi error : ', arguments);
        }).success(function() {
            console.log('registerOnClientApi success : ', arguments);
        });
    }
    return {
        unregisterOnClientApi: unregisterOnClientApi,
        registerOnClientApi: registerOnClientApi
    };
})

//////////////////////////////////////////////////
///////////////// CONFIGURA PUSH /////////////////
//////////////////////////////////////////////////
.run(function($rootScope, resumeService, loginService, gvPushService, pushService, Notificacoes, navigationService) {
    var _deviceToken = undefined;

    $rootScope.$on('pushNotificationReceived', function(event, notification) {
        console.log('Evento pushNotificationReceived');
        Notificacoes.get(notification).then(function(info) {
            console.log('redirecting to notification url: ', info.url);
            navigationService.go(info.url);
        });
    });

    /*$rootScope.$on('pushLiveNotificationReceived', function(event, notification) {
      console.log('Evento pushLiveNotificationReceived');
      // ### Colocar a logica do push quando a aplicação estiver aberta
      console.log(notification);
    });*/

    $rootScope.$on('pushUnregistered', function(event, deviceToken) {
        console.log('Evento pushUnregistered: ', deviceToken);
        pushService.unregisterOnClientApi(deviceToken);
    });

    $rootScope.$on('pushRegistered', function(event, deviceToken) {
        console.log('Evento pushRegistered: ', deviceToken);
        if (loginService.isLoggedIn()) {
            // Manda deviceToken para nosso server
            pushService.registerOnClientApi(deviceToken);
        } else {
            _deviceToken = deviceToken;
        }
    });

    resumeService.register(function() {
        gvPushService.register();
    });

    // $rootScope.$on('LOGOUT', function() {
    //     gvPushService.unregister();
    // });

    // $rootScope.$on('event_afterLogin', function(event, userData) {
    //     if (userData.pessoa) {
    //         gvPushService.register();
    //     };
    // });
    $rootScope.$on('event_afterLogin', function() {
        console.log("Evento de login capturado!");
        //se possui deviceToken
        if (_deviceToken) {
            // Manda deviceToken para nosso server
            pushService.registerOnClientApi(_deviceToken);
        } else {
            gvPushService.register();
        };
    });

    // $rootScope.$on('event_afterLogout', function(event, url) {
    //     debug("Evento de logout capturado:> " + url);
    //     if (gvPushService.currentPushDeviceOptions && !url.indexOf(APP_CONFIG.urlApiCliente)) { // Se fez logout na url do cliente
    //         // Desregistra no servidor do cliente
    //         gvPushService.unregisterDeviceForPushes(gvPushService.currentPushDeviceOptions)
    //     }
    // });
    console.log('Push configurado.');
});