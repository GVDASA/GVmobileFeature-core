angular.module('core')

/**
 * @ngdoc service
 * @name core.service:ajudaService
 *
 * @description
 * Serviço utilizado para definir seções de ajuda do aplicativo
 */
	.service('ajudaService', function (AppModulos, AppFeatures, gvPermissionService, $q) {
		var ajudaItens = [];
		return {
			/**
            * @ngdoc method
            * @methodOf core.service:ajudaService
            * @name addSecao
            * @description Obtém uma instância do serviço de mensagens associado a um determinado elemento `gvm-messages`
            * @param {string} feature Nome da feature
            * @param {object|object[]} secao Objeto ou Array de Objetos que define as seções.
            * @param {string} secao.title Titulo da seção
            * @param {object[]} secao.questoes Questões de ajuda
            * @param {string} secao.questoes.title Titulo da questão
            * @param {string} secao.questoes.text Texto/resposta da questão
            */
			addSecao: function (feature, secao) {
				var secoes = angular.isArray(secao) ? secao : [secao];
				angular.forEach(secoes, function (item) {
					item.feature = feature;
					ajudaItens.push(item);
				});
			},
			
			get: function () {
				var deferred = $q.defer();

				// valida as features disponiveis para a aplicacao
				// deferred.resolve(ajudaItens.filter(function (item) {
				// 	return AppFeatures.getAllowedFeatures().filter(function (feature) {
				// 		return feature == item.feature;
				// 	}).length > 0;
				// })); 

				gvPermissionService.getContextFeatures().then(function (features) {
					deferred.resolve(ajudaItens.filter(function (item) {
						return features.filter(function (feature) {
							return feature == item.feature;
						}).length > 0;
					}));
				});

				return deferred.promise;
			}
		}
	});