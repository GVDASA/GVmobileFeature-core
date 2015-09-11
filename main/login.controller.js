angular.module('core.main')

.controller("LoginCtrl", function($q, $rootScope, $scope, $timeout, $auth, gvmMessagesService, navigationService, loginService, User, AppModulos) {

    function readErrorFromServer(data) {
        var message = !!data && data.error_description;
        if (!message) {
            return 'Problemas ao efetuar a consulta.';
        } else {
            return message;
        }
    }

    function logar(user) {
        if (!user.login || !user.senha) {
            return $q.reject();
        };
        return loginService.login(user)
            .then(function(data) {
                User.clearUserData();
                return User.getUserData().then(function(userData) {
                    return AppModulos.selecionarModulo().then(function() {
                        navigationService.go('/main/inicial');
                        $rootScope.$broadcast('event_afterLogin', userData);
                        return data;
                    });
                }, function(data) {
                    if (data === undefined) {
                        $auth.removeToken();
                        return $q.reject('Acesso não liberado para o ano/semestre corrente.');
                    } else {
                        return $q.reject(readErrorFromServer(data));
                    }
                });
            }, function(data) {
                return $q.reject(readErrorFromServer(data));
            });
    }

    $scope.login = function(user) {
        if (!user) {
            return;
        };
        gvmMessagesService.clear();

        logar(user).catch(function(error_description) {
            gvmMessagesService.error(error_description);
        });
    };

    var initialHeight = window.innerHeight;
    window.addEventListener('orientationchange', function() {
        $timeout(function() { // necessario timeout para que aguarde a animacao de rotacao da tela
            initialHeight = window.innerHeight;
        }, 500);
    }, false);

    var formLogin = angular.element('form[name="loginForm"]');
    window.addEventListener("resize", function() {
        if (window.innerHeight < initialHeight) {
            formLogin.css('height', (initialHeight / 4) + 'px');
        } else {
            formLogin.css('height', 'auto');
        }
    }, false);
});