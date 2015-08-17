angular.module('core', [
    'ionic',
    'ngResource',
    'angular.filter',
    'gvmAppLoader.config',
    'core.prefixClientUrlInterceptor', // Deve estar obrigatoriamente antes do interceptor de autenticação
    'ngBearerAuthInterceptor',
    'core.main',
    'core.httpLoadingInterceptor',
    'core.navigation',
    'core.gvmMessages',
    'core.httpCancelOnNavigateInterceptor',
    'core.MenuProvider',
    'core.connectionStatus',
    'core.configuracoes',
    'core.contato',
    'core.push',
    'core.auth',
    'core.permission'
    //'core.mobiscroll',
    //'core.gauge'
])
// registra a feature
.config(function(AppFeaturesProvider){
    AppFeaturesProvider.addAppFeature('core');
})
// No WP as urls de arquivos salvas são do genero '//view.html' o que não faz parte da mesma origem.
// Portanto deve-se habilitar o uso destas URL's;
.config(function($sceDelegateProvider, $compileProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        '**',
    ]);

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\/|\/?img\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0)|\/?app\//);
})

// Configura comportamento do IONIC FRAMEWORK
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.templates.maxPrefetch(0);
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle("center");

    if (ionic.Platform.is('win32nt') || ionic.Platform.is('windows')) {
        // Desabilita animações no Windows Phone
        ionic.Platform.setGrade('c');
        $ionicConfigProvider.views.transition('none');
    }
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (!ionic.Platform.isAndroid()) {
            ionic.Platform.fullScreen(true, false);
        }

        window.navigator && window.navigator.splashscreen && window.navigator.splashscreen.hide();
        console.log('Run: core');
    });
})

.run(function($http, resumeService, configuracoesDeCliente, User, $auth, AppModulos) {
    // Ao iniciar a aplicação deve obter a configuração da URL da API do Cliente  do localstorage caso ela tenha sido obtida em uma execução anterior do aplicativo.
    configuracoesDeCliente.loadSavedUrl();


    // Carrega dados referentes ao usuário
    resumeService.register(function() {
        if ($auth.isAuthenticated()) {
            User.getUserData(true).then(function(userData) {
                if (userData.changed) {
                    AppModulos.selecionarModulo().then(function() {
                        AppModulos.init();
                    });
                } else {
                    AppModulos.init();
                }
            });
        }
    });

    // Esta parte que irá enviar para a tela de login caso o usuário esteja deslogado.
    resumeService.register(function() {
        configuracoesDeCliente.getUrlApiCliente().then(function(data) {
            $http.get('~/api/version', {
                ignoreInterceptor: true
            }).then(function() {}, function() {
                // // Caso erro, efetuar logout imediatamente!
                // if (arguments[0] == "CREDENTIALS_NEEDED") {
                //     $rootScope.logout();
                // }
            });
        });
    });

})

.run(function($rootScope, AppModulos, sidemenuService, ajudaService) {
    var perfilMenuItem = {
        action: function() {
            AppModulos.selecionarModulo(true)
        },
        descricao: 'Mudar perfil',
        iconCls: 'ion-person-stalker',
        order: 1
    };

    function addProfileMenuItem() {
        AppModulos.getModulos().then(function(modulos) {
            if (modulos && modulos.length > 1) {
                sidemenuService.removeProfileMenus(perfilMenuItem);
                sidemenuService.addProfileMenus(perfilMenuItem);
            }
        });
    }
    $rootScope.$on('PERFIL_SELECIONADO', function() {
        addProfileMenuItem();
    });
    addProfileMenuItem();

    $rootScope.$on('LOGOUT', function() {
        sidemenuService.removeProfileMenus(perfilMenuItem);
    });

    ajudaService.addSecao('gvmobile', [{
        "title": "Perfil",
        "questoes": [{
            "title": "Como faço para visualizar dados de outro perfil?",
            "text": 'Se você tem mais de um perfil no aplicativo ( Aluno, professor, tutor), vá até o menu principal e clique na descrição do seu nome. Em seguida selecione a opção "Mudar perfil".'
        }]
    }, {
        "title": "Notificações Push ",
        "questoes": [{
            "title": "Como faço para receber notificações push?",
            "text": "Vá até o menu principal e acesse a opção Configurações. Marque as opções que você deseja receber notificações push."
        }, {
            "title": "Por que não estou recebendo notificações push?",
            "text": "Você deverá estar conectado a uma rede Wi-Fi, 3G ou 4G para receber as notificações. Você deverá configurar se deseja receber as notificações push."
        }]
    }]);
})

// Configura controle de acesso
.run(function($rootScope, resumeService, controleAcesso) {
    $rootScope.$on('event_afterLogin', function(event, userData) {
        if (userData.codigoPessoa) {
            controleAcesso.logarAcesso();
        };
    });
    resumeService.register(controleAcesso.logarAcesso, controleAcesso);
})

// Configura controle de notificações
.run(function($rootScope, resumeService, Notificacoes) {


    $rootScope.$on('LOGOUT', function() {
        Notificacoes.stop();
    });

    $rootScope.$on('event_afterLogin', function() {
        Notificacoes.run();
    });

    resumeService.register(function() {
        Notificacoes.stop();
        Notificacoes.run();
    });

    Notificacoes.run();
});