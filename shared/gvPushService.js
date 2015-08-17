angular.module('core.gvPush', [])
    .service('gvPushService', GvPushService);
    // .factory('$cordovaPush', CordovaPush);
/*

events:
 - pushRegistered(deviceToken)
 - pushNotificationReceived(notification)

*/
function GvPushService($window, $rootScope, $timeout, $q, APP_CONFIG) {
    var me = this;
    me.deviceToken = undefined;
    me.pushService = undefined;

    function onPushRegistered(deviceToken) {
        $timeout(function() {
            $rootScope.$broadcast('pushRegistered', deviceToken);
        }, 0);
    }

    function onPushUnregistered(deviceToken) {
        $timeout(function() {
            $rootScope.$broadcast('pushUnregistered', deviceToken);
        }, 0);
    }

    function onNotification(notification) {
        $timeout(function() {
            $rootScope.$broadcast('pushNotificationReceived', notification);
        }, 0);
    }

    function onLiveNotification(notification) {
        $timeout(function() {
            $rootScope.$broadcast('pushLiveNotificationReceived', notification);
        }, 0);
    }

    function setCurrentPushInfo(deviceToken) {
        console.log('deviceToken = ' + deviceToken);
        if (!!me.deviceToken) {
            // Verifica se mudou o deviceToken
            if (me.deviceToken !== deviceToken) {
                // Se o deviceToken mudou então deve garantir que o velho seja desregistrado.
                console.log("Desregistro de deviceToken antigo solicitado!");
                onPushUnregistered(me.deviceToken);
            };
        }

        // Armazena o novo deviceToken do dispositivo.
        me.deviceToken = deviceToken;
        onPushRegistered(deviceToken);
    }

    $window.onPushNotificationReceived = function pushNotificationReceived(notification) {
        var notif = {
            id: notification.additionalData.notifId,
            tipo: notification.additionalData.notifTipo,
            getParam: function(key) {
                return notification.additionalData.notifParams[key];
            }
        };

        if (!notification.additionalData.foreground) {
            // Quando chegar o push e a aplicação estiver fechada
            onNotification(notif);
        } else {
            // Quando chegar o push e a aplicação estiver aberta
            onLiveNotification(notif);
        }
    };

    return {
        register: function register() {
            if (!ionic.Platform.isWebView()) {
                return; // Desktop Fallback
            };
            var pushInitConfig = {};
            if (ionic.Platform.isAndroid()) {
                console.log("registrando deviceId via plugin [android]!");
                var androidConfig = {
                    "senderID": APP_CONFIG.googleSenderID,
                    "ecb": "onPushNotificationReceived"
                };
                // $cordovaPush.register(androidConfig);
                pushInitConfig.android = androidConfig;

            } else if (ionic.Platform.isIOS()) {
                console.log("registrando deviceId via plugin [iOS]!");
                var iosConfig = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onPushNotificationReceived"
                };
                pushInitConfig.ios = iosConfig;
            }
            me.pushService = PushNotification.init(pushInitConfig);
            me.pushService.on('registration', function(data) {
                setCurrentPushInfo(data.registrationId);
            });
            me.pushService.on('notification', function(notification) {
                $window.onPushNotificationReceived(notification);
            });
        },
        unregister: function unregister() {
            var q = $q.defer();
            me.pushService.unregister(function(){
                console.log("Desregistro efetuado!");
                onPushUnregistered(me.deviceToken);
                q.resolve();
            }, function(){
                console.log("Erro ao desregistrar.");
                q.reject("Erro ao desregistrar.");
            });
            return q.promise;
            // var config;
            // if (platform.isAndroid()) {
            //     config = {
            //         "senderID": APP_CONFIG.googleSenderID,
            //         "ecb": "onPushNotificationReceived"
            //     };
            // } else if (platform.isIOS()) {
            //     config = {
            //         "badge": "true",
            //         "sound": "true",
            //         "alert": "true",
            //         "ecb": "onPushNotificationReceived"
            //     };
            // }
            // if (config) {
            //     return $cordovaPush.unregister(config);
            // } else {
            //     return $q.reject('platform not suported!');
            // }
        },
        getDeviceToken: function() {
            return me.deviceToken;
        }
    };
};

// function CordovaPush($q, $window, $rootScope) {
//     return {
//         onNotification: function(notification) {
//             $rootScope.$apply(function() {
//                 $rootScope.$broadcast('pushNotificationReceived', notification);
//             });
//         },

//         register: function(config) {
//             var q = $q.defer();

//             if (config !== undefined && config.ecb === undefined) {
//                 config.ecb = "angular.element(document.querySelector('[ng-app]')).injector().get('$cordovaPush').onNotification";
//             }

//             $window.plugins.pushNotification.register(
//                 function(token) {
//                     q.resolve(token);
//                 },
//                 function(error) {
//                     q.reject(error);
//                 },
//                 config);

//             return q.promise;
//         },

//         unregister: function(options) {
//             var q = $q.defer();
//             $window.plugins.pushNotification.unregister(
//                 function(result) {
//                     q.resolve(result);
//                 },
//                 function(error) {
//                     q.reject(error);
//                 },
//                 options);

//             return q.promise;
//         },

//         // iOS only
//         setBadgeNumber: function(number) {
//             var q = $q.defer();
//             $window.plugins.pushNotification.setApplicationIconBadgeNumber(
//                 function(result) {
//                     q.resolve(result);
//                 },
//                 function(error) {
//                     q.reject(error);
//                 },
//                 number);
//             return q.promise;
//         }
//     };
// };