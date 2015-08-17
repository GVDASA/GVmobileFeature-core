angular.module('core.main')

.controller('MainCtrl', function($scope, $injector, $location, $ionicScrollDelegate, $ionicSideMenuDelegate, Menu, navigationService, sidemenuService, loginService, AppModulos, Notificacoes) {
	var me = angular.extend($scope, {
		sidemenuData: sidemenuService,
		logout: loginService.logout,
		scrollToEl: scrollToEl,
		selectTapFix: isWindowsPhone,
		currentModuleMenu: currentModuleMenu,
		currentModuleMenuInDesktop: currentModuleMenuInDesktop,
		currentProfileMenu: currentProfileMenu,
		dButton: dButton,
		noticeStats: Notificacoes.getStats(),
		isAndroid: ionic.Platform.isAndroid,
		go: navigationService.go
	});
	/////////////////////////////////////////////////////////////////////////////////////////
	if (loginService.isLoggedIn()) {
		Menu.get().then(function (menus) {
			$scope.newmenus = menus;
		});
	}
	
	function scrollToEl(el, scrollHandle) {
		scrollHandle = scrollHandle || 'content';
		$location.hash(el);
		var handle = $ionicScrollDelegate.$getByHandle(scrollHandle);
		handle.anchorScroll();
	};

	function isWindowsPhone() {
		return ionic.Platform.is('win32nt') || ionic.Platform.is('windows');
	};

	function currentModuleMenuInDesktop(menuItem) {
		var currentModule = AppModulos.getCurrent();
		return menuItem.desktop && (!menuItem.module || currentModule && menuItem.module === currentModule.modulo);
	};

	function currentModuleMenu(menuItem) {
		var currentModule = AppModulos.getCurrent();
		return !menuItem.module || currentModule && menuItem.module === currentModule.modulo;
	};

	function currentProfileMenu(menuItem) {
		var currentModule = AppModulos.getCurrent();

		if (!menuItem.modulo) {
			return true;
		} else if (currentModule) {
			if ((!menuItem.perfil && ((menuItem.modulo && menuItem.modulo.toLowerCase()) === (currentModule.modulo && currentModule.modulo.toLowerCase()))) || (menuItem.perfil && menuItem.perfil.toLowerCase()) === (currentModule.perfil && currentModule.perfil.toLowerCase())) {
				return true;
			}

			if (currentModule.perfil == 'professor' && menuItem.perfil == 'tutor') {
				var moduleService = $injector.get(currentModule.resolve[2]);
				var turmaSelecionada = moduleService.getTurmaSelecionada();
				return !!turmaSelecionada && !!turmaSelecionada.ead;
			}
		}

		return false;
	}

	function dButton(menu, state) {
		Menu.desktop(menu, state);

		$ionicSideMenuDelegate.toggleLeft(false);

		var gaLabel = "";
		if (!!state) {
			gaLabel = "Adiciona Menu ao Desktop";
		} else {
			gaLabel = "Remove Menu ao Desktop";
		}
		window.gaPlugin && window.gaPlugin.trackEvent(
			function() {},
			function() {},
			gaLabel,
			"ng-hold",
			menu.name,
			1
		);
	};
});