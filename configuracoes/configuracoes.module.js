angular.module('core.configuracoes', [])

.config(function($stateProvider, MenuProvider) {

	$stateProvider.state('main.ajuda', {
		url: "/ajuda",
		views: {
			'menuContent': {
				templateUrl: 'core/configuracoes/ajuda.html',
				controller: 'AjudaCtrl'
			}
		}
	})

	MenuProvider.addMenuItem({
		name: "Configurações",
		url: "/main/configuracoes",
		icon: "ion-gear-b",
		desktop: false,
		alwaysShow: true,
		order: 999,
		cfg: {
			url: "/configuracoes",
			views: {
				'menuContent': {
					templateUrl: 'core/configuracoes/configuracoes.html',
					controller: "ConfiguracoesCtrl"
				}
			}
		}
	});
})

.run(function(localStorage) {
	var eventTimeAlert = localStorage.get("eventTimeAlert");
	if (!!!eventTimeAlert) {
		localStorage.set("eventTimeAlert", 10);
	}
});