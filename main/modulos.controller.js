angular
	.module('core.main')
	.controller("ModulosCtrl", function($scope, $timeout, AppModulos) {
		AppModulos.getModulos().then(function(modulos) {
			$scope.modulos = modulos;
		});
		$scope.atual = AppModulos.getModuloAtual();

		$scope.loadModulo = function(modulo) {
			$scope.atual = modulo;
			$scope.$emit('module_selected', modulo.nome);
			$timeout(function() {
				AppModulos.selecionarModulo(modulo);
			}, 500);
		};
	});