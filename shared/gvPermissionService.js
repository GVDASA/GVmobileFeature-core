angular.module('core.permission', [])
    .service('gvPermissionService', GvPermissionService);


function GvPermissionService($rootScope, $q, $http, APP_CONFIG, FEATURES_MAP, AppFeatures, AppModulos, localStorage) {

    return {
        getContextFeatures: getContextFeatures
    };

    function getContextFeatures() {
        var deferred = $q.defer();

        var context = AppModulos.getContextData();
        var features;
        var data = {
            idUsuarioLogado: context.perfil.data.codigoPessoa,
            euccp: {
                empresa: context.empresa,
                unidade: context.unidade,
                curso: context.curso,
                ciclo: context.ciclo,
                papeis: context.papeis
            }
        };

        $http.post("~/api/RegrasPermissoesFeature/Dispositivo", data, {
            ignoreInterceptor: true
        })
            .error(function (err) {
                console.log(err);
            })
            .then(function (response) {
                features = response.data;
            })
            .finally(function (data) {
                var isDeveloperMode = !!localStorage.get("devId");
                features = AppFeatures.getAllowedFeatures().filter(function (allowedFeature) {
                    return isDeveloperMode || features.filter(function (feature) {
                        return FEATURES_MAP[feature.toUpperCase()] == allowedFeature;
                    }).length > 0;
                });
                deferred.resolve(features);
            });

        return deferred.promise;
    }

}