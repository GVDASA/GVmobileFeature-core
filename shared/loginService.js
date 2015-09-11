// Serviço para tratar todas as necessidades de login.
angular.module('core')

.factory('loginService', function($rootScope, $q, $http, APP_CONFIG, navigationService, $auth, User, gvPushService, pushService) {
    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout
    };
    // -------------------------------------------------------------------------------------------------------
    function login(user, success, error) {
        if (!$auth.options.url) {
            error && error();
            return $q.reject();
        }
        return $auth.authorize({
                username: user.login,
                password: user.senha
            })
            .then(success, error);
    }

    function isLoggedIn() {
        return $auth.isAuthenticated();
    }

    function releaseOAuthTokens() {
        var refreshToken = $auth.getRefreshToken();
        if (refreshToken) {
            return $http.get('~/api/auth', {
                    params: {
                        refreshToken: refreshToken
                    }
                })
                .finally(function() {
                    $auth.removeToken();
                });
        } else {
            $auth.removeToken();
        }
        return $q.when();
    }

    function releasePushDeviceToken() {
        var deviceToken = gvPushService.getDeviceToken();
        if (!!APP_CONFIG.urlApiCliente && deviceToken && isLoggedIn()) {
            return gvPushService.unregister();
        }
        return $q.when();
    }

    function logout() {
        return releasePushDeviceToken()
            .finally(function() {
                return $q.when(releaseOAuthTokens());
            })
            .finally(function() {
                User.clearUserData();
                $rootScope.notices = {};
                navigationService.go("/login");
                $rootScope.$broadcast('LOGOUT');
                window.gaPlugin && window.gaPlugin.trackEvent(
                    function() {},
                    function() {},
                    "Acesso",
                    "Logoff",
                    "Efetua logoff através do menu",
                    1
                );
            });
    }
});