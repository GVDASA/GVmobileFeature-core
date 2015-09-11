angular.module('core')

.service('ajudaService', function(AppModulos, $q) {
	var ajudaItens = [];
	return {
		addSecao: function(modulo, secao) {
			var secoes = angular.isArray(secao) ? secao : [secao];
			angular.forEach(secoes, function(item) {
				item.modulo = modulo;
				ajudaItens.push(item);
			});
		},
		get: function() {
			var deferred = $q.defer();

			AppModulos.getModulos().then(function(modulos) {
				deferred.resolve(ajudaItens.filter(function(item) {
					return modulos.filter(function(m) {
						return item.modulo == "gvmobile" || m.modulo == item.modulo;
					}).length > 0;
				}));
			});
			return deferred.promise;
		}
	}
});