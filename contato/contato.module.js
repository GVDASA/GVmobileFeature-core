angular.module('core.contato', [])

.config(function(MenuProvider) {

	MenuProvider.addMenuItem({
		name: "Canais de Contato",
		url: "/main/canais-de-contato",
		icon: "ion-android-call",
		alwaysShow: true,
		desktop: false,
		order: 10,
		cfg: {
			url: "/canais-de-contato",
			views: {
				'menuContent': {
					templateUrl: 'core/contato/contato.html',
					controller: "CanaisDeContatoCtrl"
				}
			}
		}
	});
});