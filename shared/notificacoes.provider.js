// Serviço para requisição de notificações
angular.module('core')

.provider("Notificacoes", NotificacoesProvider);

function NotificacoesProvider() {
    var notificationTypes = {};
    return {
        addType: addNotificationType,
        $get: NotificacoesService
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function addNotificationType(value) {
        var args = angular.isArray(value) ? value : [value];
        angular.forEach(args, function(item) {
            notificationTypes[item.tipo] = item;
        });
    };

    function NotificacoesService($q, $http, $interval, AppFeatures, loginService, User) {
        var mappingFunctions = [],
            stats = {},
            runInterval = 15000,
            runner;

        addDefaultMappingFn();

        return {
            query: QueryFn,
            addMapFn: addMapFn,
            get: getNotification,
            setRead: setRead,
            run: run,
            stop: stop,
            getTypes: getTypes,
            getStats: function getStats() {
                return stats;
            }
        };
        ////////////////////////////////////////////////
        function getTypes(module) {
            var modulosDoUsuario = User.getCurrent().modulos.map(function(m) {
                return m.nome
            });
            var typesObj = {};
            Object.keys(notificationTypes).map(function(typeName) {
                var type = notificationTypes[typeName];
                if ((!type.modulo || modulosDoUsuario.indexOf(type.modulo) !== -1) && (!module || type.modulo === module)) {
                    return typesObj[typeName] = type;
                };
                return type;
            });
            return typesObj;
        };

        function run() {
            if (!runner && !!loginService.isLoggedIn()) {
                updateStatsFromServer();
                runner = $interval(updateStatsFromServer, runInterval);
                return true;
            }
            return false;
        };

        function stop() {
            if (!!runner) {
                $interval.cancel(runner);
                runner = undefined;
            };
        };

        function updateStatsFromServer() {
            return $http.get('~/api/notificacoes/stats', {
                cache: false,
                ignoreInterceptor: true
            }).then(function(response) {
                stats.info = response.data;
            });
        };

        function getNotification(param) {
            var deferred = $q.defer();
            var requestParams;

            // Se não for passado nenhum parametro obtem uma lista de notificações
            if (!!!param) {
                requestParams = {
                    limit: 10
                };
                // se for passado um inteiro, obtem somente a notificação de respectivo id
            } else if (!angular.isObject(param)) {
                requestParams = {
                    "$filter": "Id eq " + param
                };
            };

            if (requestParams) {
                $http.get('~/api/notificacoes/', {
                    ignoreInterceptor: true,
                    cache: false,
                    params: requestParams
                }).then(function(response) {
                    // Apply map functions
                    angular.forEach(response.data.items || [], getMapFunction());
                    setSeen();

                    if (!!!param) {
                        deferred.resolve(response.data);
                    } else {
                        var notification = response.data.items[0];
                        setRead([param]);
                        deferred.resolve(notification);
                    };

                });
            } else {
                // Apply map functions
                getMapFunction()(param);
                setRead([param.id]);
                deferred.resolve(param);
            }
            return deferred.promise;
        };

        function setSeen() {
            return $http.post('~/api/notificacoes/MarcarComoVisualizadas/', null, {
                ignoreInterceptor: true
            }).then(function() {
                if (!!stats.info) {
                    stats.info.naoVistas = 0;
                }
            });
        };

        function setRead(ids) {
            return $http.post('~/api/notificacoes/MarcarComoLidas/', ids, {
                ignoreInterceptor: true
            }).then(function() {
                updateStatsFromServer();
            });
        };

        function QueryFn(parameters, success, error) {
            var promise = $http.get('~/api/notificacoes/', {
                params: parameters,
                cache: false,
                ignoreInterceptor: true
            });
            promise.then(function(response) {
                // Apply map functions
                
                angular.forEach(response.data.items || [], getMapFunction());
                // debugger;
                response.data.items = response.data.items.filter(function(item) {
                    var res = AppFeatures.getAllowedFeatures().filter(function(userAllowedModule) {
                        return userAllowedModule == item.feature;
                    }).length > 0;
                    console.log(item);
                    return res;
                });
                setSeen();
            });
            promise.then(success, error);
            return promise;
        };

        function addMapFn(fn) {
            mappingFunctions.push(fn);
        };

        function getMapFunction() {
            // returns a function that applies all transformations;
            return function(notification) {
                angular.forEach(mappingFunctions, function(mapFn) {
                    mapFn(notification);
                });
                return notification;
            }
        }

        function addDefaultMappingFn() {
            addMapFn(function(notice) {
                var t = notice.tipo.toLowerCase();
                notice.getParam = function(key) {
                    var retorno = undefined;
                    (notice.parametros || []).map(function(n) {
                        if (n.chave == key) {
                            retorno = n.valor;
                        };
                    });
                    return retorno;
                };
                var notifType = notificationTypes[t];
                if (notifType) {
                    notice.classe = notifType.classe;
                    notice.feature = notifType.feature;
                    if (angular.isArray(notifType.params)) {
                        var urlParams = notifType.params.map(function(param) {
                            return notice.getParam(param);
                        });
                        notice.url = notifType.urlBase + urlParams.join('/');
                    } else {
                        notice.url = notifType.urlBase + notice.id;
                    };
                };
            });
        };
    };
};