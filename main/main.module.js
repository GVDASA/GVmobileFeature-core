angular.module('core.main', [])

.config(function($stateProvider, $urlRouterProvider) {

	// Rotas padrões da aplicação
	$stateProvider.state("login", {
		url: "/login",
		templateUrl: 'core/main/login.html',
		controller: "LoginCtrl"
	})

	.state('main', {
		url: '/main',
		abstract: true,
		templateUrl: 'core/main/mainpage.html',
		controller: 'MainCtrl'
	})

	.state("modulos", {
		url: "/modulos",
		templateUrl: 'core/main/modulos.html',
		controller: "ModulosCtrl",
		data: {
			disallowBack: true
		}
	})

	.state('main.inicial', {
		url: "/inicial",
		views: {
			'menuContent': {
				templateUrl: 'core/main/inicial.html'
			}
		}
	})

	.state('main.avisos', {
		url: "/aviso/:noticeId",
		views: {
			'menuContent': {
				templateUrl: 'core/main/avisos.html',
				controller: "AvisosCtrl"
			}
		}
	});

	// Rotas padrões da aplicação
	$urlRouterProvider.otherwise('/main/inicial');
});