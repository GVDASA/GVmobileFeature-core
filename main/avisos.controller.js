angular.module('core.main')

.controller('AvisosCtrl', function($scope, $state, Notificacoes) {
	Notificacoes.get($state.params.noticeId).then(function(data) {
		$scope.notice = data;
	});
});