angular.module('core.main')

.controller("NotificacoesCtrl", function($scope, $rootScope, $ionicSideMenuDelegate, navigationService, Notificacoes, PagingService, gvmMessagesService) {
	var paging = new PagingService({
		appendPages: true,
		onSuccess: onPagingSuccess,
		uniqueBy: 'id',
	});
	paging.setQueryFn(Notificacoes.query);

	var me = angular.extend($scope, {
		notices: {},
		noticeStats: Notificacoes.getStats(),
		readNotice: readNotice,
		setAllRead: setAllRead,
		paging: paging,
		hasPrevious: hasPrevious,
		prevPage: prevPage,
		pullRefresh: pullRefresh
	});


	$rootScope.$watch(function() {
		return $ionicSideMenuDelegate.isOpenRight();
	}, function(value) {
		if (value) {
			$scope.notices.items = [];
			paging.setPage(1);
		}
	});
	//-------------------------------------------------------------------------------------------------------------------------
	function hasPrevious() {
		return me.paging.hasPrevious();
	};

	function prevPage() {
		me.paging.previousPage();
	}

	function pullRefresh() {
		me.paging.pullRefresh();
		$scope.$broadcast('scroll.refreshComplete');
	}

	function readNotice(notice) {
		Notificacoes.get(notice).then(function(info) {
			navigationService.go(info.url);
		});
	}

	function setAllRead() {
		$scope.notices.items.map(function(noticia) {
			noticia.lida = true;
		});
		Notificacoes.setRead();

		window.gaPlugin && window.gaPlugin.trackEvent(
			function() {},
			function() {},
			"Funcionalidade",
			"Click",
			"Seta todas notificações como lidas",
			1
		);
	}

	function onPagingSuccess() {
		var types = Notificacoes.getTypes();
		$scope.notices.items = paging.items.filter(function(i) {
			// console.log(i.feature);
			if (!!types[i.tipo.toLowerCase()]) return true;
		});

		if ($scope.notices.items.length === 0) {
			gvmMessagesService.get('notificacoes').info("No momento, não existem notificações.");
		} else {
			gvmMessagesService.get('notificacoes').clear();
		}
		$scope.$broadcast('scroll.infiniteScrollComplete');
	}
});