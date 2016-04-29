angular.module('core.main')
	.controller('AvisosCtrl', function ($scope, $state, $http) {
		$http.get('~/api/notificacoes/getAviso', {
			ignoreInterceptor: true,
			cache: false,
			params: {
				codigoNotificacao: $state.params.noticeId
			}
		}).then(function (response) {
			$scope.notice = response.data;
		});
		// Notificacoes.get($state.params.noticeId).then(function (data) {
		// $scope.notice = data;
		// });
	});