angular.module('core.auth', [
    'gvmAppLoader.config',
    'ngBearerAuthInterceptor',
    'core.navigation'
])

.run(function($authProvider, APP_CONFIG, navigationService) {
    $authProvider.configure({
        name: "portal",
        url: APP_CONFIG.urlApiPortal,
        clientId: APP_CONFIG.portalClientId,
        clientSecret: APP_CONFIG.portalClientSecret,
        persistent: true
    });

    $authProvider.configure({
        clientId: "GVmobileApp",
        persistent: true,
        resourceOwnerCredentialsFn: function(config) {
            //loginService.logout();
            navigationService.go("/login");
        }
    });
})
