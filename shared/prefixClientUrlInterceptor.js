angular.module('core.prefixClientUrlInterceptor', [])

.config(function($httpProvider) {
    $httpProvider.interceptors.push(['APP_CONFIG',
        function(APP_CONFIG) {
            return {
                request: function(httpConfig) {
                    if (httpConfig.url && httpConfig.url.indexOf("~/") == 0) {
                        httpConfig.url = httpConfig.url.replace(/~\//, APP_CONFIG.urlApiCliente);
                    };
                    return httpConfig;
                }
            }
        }
    ]);
});