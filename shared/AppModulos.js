angular.module('core')

.provider('AppModulos', function AppModulosProvider(AppFeaturesProvider) {
    var appModulos = [];
    return {
        addAppModule: addAppModule,
        $get: AppModulosService
    };
    //////////////////////////////////////////////////////////////////////
    function addAppModule(value) {
        var args = angular.isArray(value) ? value : [value];
        angular.forEach(args, function(modulo) {
            AppFeaturesProvider.addAppFeature(modulo.feature);
            appModulos.push(modulo);
        });
    };

    function AppModulosService($rootScope, $q, $injector, localStorage, User, navigationService, AppFeatures) {
        return {
            getModulos: getModulos,
            getModuloAtual: getModuloAtual,
            getUserSelected: getUserSelected,
            selecionarModulo: selecionarModulo,
            getCurrent: getCurrent,
            getCurrentPerfil: getCurrentPerfil,
            init: init,
            getServicoDefinicaoAtual: getServicoDefinicaoAtual,
            getContextData: getContextData
        };
        //////////////////////////////////////////////////////
        function getContextData() {
            var servicoDefinicaoAtual = getServicoDefinicaoAtual();
            var contextData = servicoDefinicaoAtual.getContextData && servicoDefinicaoAtual.getContextData();
            return angular.extend({
                perfil: getCurrentPerfil(),
            }, contextData || {});
        };

        function getServicoDefinicaoAtual() {
            var initSvcName = getCurrent().nome;
            initSvcName = 'serviceDefinicao' + initSvcName[0].toUpperCase() + initSvcName.substring(1);
            return $injector.get(initSvcName);
        };

        function init() {
            var moduleSvc = getServicoDefinicaoAtual();
            moduleSvc && moduleSvc.updateProfileData && moduleSvc.updateProfileData();
        };

        function getCurrent() {
            var moduloAtual = getModuloAtual();
            return moduloAtual;
        };

        function getCurrentPerfil() {
            var moduloAtual = getModuloAtual();
            var userData = User.getCurrent();
            if (!userData || !moduloAtual) {
                return;
            }
            var perfil = userData.modulos.filter(function(m) {
                return m.nome === moduloAtual.perfil;
            });
            if (!perfil[0]) {
                return;
            };
            return perfil[0];
        };

        function getUserSelected() {
            return User.getUserData().then(function(userData) {
                return getCurrent();
            });
        };


        /*
         * se receber true, irá forcar seleção
         * se receber um objeto irá setar o módulo
         * se não receber nada irá mostrar a tela para selecionar o módulo caso tenha mais de um
         */
        function selecionarModulo(modulo) {
            if (angular.isObject(modulo)) {
                localStorage.set('moduloSelecionado', modulo);
                $rootScope.$broadcast('PERFIL_SELECIONADO', modulo);
            } else {
                var deferred = $q.defer();
                var off = $rootScope.$on('PERFIL_SELECIONADO', function(e, modulo) {
                    deferred.resolve($q.when($injector.invoke(modulo.resolve)));
                    off();
                });

                // Seleciona o primeiro módulo ou manda para tela de seleção
                getModulos().then(function(modulos) {
                    if (modulo !== true && modulos.length === 1) {
                        selecionarModulo(modulos[0]);
                    } else {
                        navigationService.go('/modulos');
                    }
                });
                return deferred.promise;
            }
        };

        function getModuloAtual() {
            return localStorage.get('moduloSelecionado');
        };

        function getModulos() {
            return User.getUserData().then(function(userData) {
                
                return appModulos.filter(function(appModuloItem) {
                    var modulos = AppFeatures.getAllowedFeatures().filter(function(userAllowedModule) {
                        return userAllowedModule === appModuloItem.feature;
                    });
                    return !appModuloItem.modulo || modulos.length > 0;
                });
            });
        };
    };
});