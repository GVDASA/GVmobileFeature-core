// HOOK PARA CONTROLE DO BACKBUTTON
// Obs.: Implementado fora do angular, pois é necessário que o listener do backbutton seja adicionado antes do Ionic

window.gvm = window.gvm || {};
angular.extend(window.gvm, {
    _backButtonActionState: false,
    setBackButtonActionState: function setBackButtonActionState() {
        window.gvm._backButtonActionState = true;
    }
});
ionic.Platform.ready(function () {
    document.addEventListener('backbutton', window.gvm.setBackButtonActionState, false);
});

// Serviço de controle de navegação
angular.module('core.navigation', [
    'ionic'
])


/**
 * @ngdoc service
 * @name core.service:navigationService
 *
 * @description
 * Serviço para controle de navegação
 *
 */
    .factory('navigationService', function ($location, $state, $ionicHistory, $ionicSideMenuDelegate) {
        var me = this;
        return {
           
            go: go,
            back: back,
            disallowBackButton: disallowBackButton,
            getData: getData
        };
        ////////////////////////////////////////////////////////////////////////
        /**
         * @ngdoc method
         * @methodOf core.service:navigationService
         * @name go
         * @description Navega para uma determinada página
         * @param {string} url Url da página para navegar
         * @param {object=} data Dados a serem enviados ao navegar
         */
        function go(url, data) {
            // Devido a problema no histórico de navegação ao utilizar a diretiva 'close-menu'
            // foram adicionados o fechamento dos menus laterias de forma explicita
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.toggleRight(false);

            $location.path(url);
            data && setData(data);
        };
        /**
         * @ngdoc method
         * @methodOf core.service:navigationService
         * @name back
         * @description Volta para a página anterior
         */
        function back() {
            var currentView = $ionicHistory.currentView();
            console.log(currentView.url);
            if (currentView.url === "/login" || currentView.url == "/main/inicial") {
                navigator.app.exitApp();
            };
        }

        function disallowBackButton(event, toState) {
            try {
                if (($state.current.data || {}).disallowBack && window.gvm._backButtonActionState) {
                    event.preventDefault();
                }
            } finally {
                window.gvm._backButtonActionState = false;
            }
        };

        function setData(data) {
            me._navigationData = data;
        }
        /**
        * @ngdoc method
        * @name getData
        * @methodOf core.service:navigationService
        * @description Obtém dado que foi armazenado ao navegar para esta página.
        * @param {bool=} persist Se deve remover o dados do serviço de navegação ou manter
        * @returns {object} Dado armazenado no serviço caso exista
        */
        function getData(persist) {
            var aux = me._navigationData
            if (!persist) delete me._navigationData;
            return aux;
        }
    })

// Configura controle de navegação
    .run(function ($rootScope, navigationService) {

        // Controle do botão voltar físico
        document.addEventListener('backbutton', navigationService.back, false);
        $rootScope.$on('$stateChangeStart', navigationService.disallowBackButton);

    });