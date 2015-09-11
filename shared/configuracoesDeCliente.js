angular.module('core')

.service('configuracoesDeCliente', function($q, $http, APP_CONFIG, localStorage, $authProvider) {
    function reconfigureDefaultAuthUrl(url) {
        if (url) {
            var defaultAuth = $authProvider.get('default');
            defaultAuth.options.url = url;
        };
    }

    // Caso a url estiver inserida no arquivo de configuração ela não será obtida do portal.
    // A ser utilizado para em desenvolvimento para fins de debug.
    var debugLocalUrl = APP_CONFIG.urlApiCliente;

    // Obtém a configuração da URL do portal da gvdasa.
    this.getUrlApiCliente = function() {
        var me = this;
        var deferred = $q.defer();

        if (debugLocalUrl) {
            me.setUrlApiCliente(debugLocalUrl);
            deferred.resolve(APP_CONFIG.urlApiCliente);
        } else {
            $http.get(APP_CONFIG.urlApiPortal + "api/config", {
                    ignoreInterceptor: true
                })
                .error(function() {
                    deferred.reject({
                        data: arguments[0],
                        status: arguments[1],
                        headers: arguments[2],
                        config: arguments[3],
                        statusText: arguments[4]
                    });
                })
                .then(function(response) {
                    var data = response.data;
                    if (!data) {
                        debugger;
                    };
                    me.setUrlApiCliente(data.urlApiCliente);
                    deferred.resolve(APP_CONFIG.urlApiCliente);
                });
        }
        return deferred.promise;
    };

    this.setUrlApiCliente = function(url) {
        if (url) {
            // Configura nova url
            APP_CONFIG.urlApiCliente = url;
            localStorage.set('urlApiCliente', APP_CONFIG.urlApiCliente);
            reconfigureDefaultAuthUrl(APP_CONFIG.urlApiCliente);
        };
    };

    this.loadSavedUrl = function() {
        // Sempre que alterada a URL deve-se reconfigurar a autenticação
        var urlApiCliente = localStorage.get('urlApiCliente');
        if (urlApiCliente) {
            this.setUrlApiCliente(urlApiCliente);
        } else if (APP_CONFIG.urlApiCliente) {
            this.setUrlApiCliente(APP_CONFIG.urlApiCliente);
        }
    };
});