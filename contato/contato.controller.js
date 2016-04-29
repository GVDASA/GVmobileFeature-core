angular.module('core.contato')

.controller('CanaisDeContatoCtrl', function($scope, gvmMessagesService, CanaisDeContato, AppModulos) {
	var unidade = AppModulos.getServicoDefinicaoAtual().getUnidadeSelecionada() || AppModulos.getServicoDefinicaoAtual().getPoloSelecionado();

	CanaisDeContato.create({
		$filter: "CodigoUnidade eq null or CodigoUnidade eq " + unidade.codUnidade + ' and CodigoEmpresa eq ' + unidade.codEmpresa,
		limit: 1000
	}, function(data) {

		var itensLen = data.items.length;

		if (!itensLen) {
			gvmMessagesService.info('Não há contatos cadastrados.');
		} else {
			gvmMessagesService.clear();
			$scope.data = data;
		}
	}, function(data) {
		gvmMessagesService.info('Problemas ao efetuar a consulta.');
		window.analytics && window.analytics.trackEvent(
			"Conteúdo",
			"Sem resultado",
			"Sem resultados na exibição de Telefones Uteis.",
			1
		);
	});

	$scope.openLink = function(contato) {
		window.open(
			getLink(contato),
			'_system',
			'location=yes,closebuttoncaption=Voltar,toolbar=no,presentationstyle=pagesheet'
		);
	};

	var getLink = function(contato) {
		var result;
		switch (contato.tipoContato.tipo) {
			case 0: // telefone
				result = "tel:" + contato.valor.replace(/\D/g, "");
				break;
			case 1: // email
				result = "mailto:" + contato.valor;
				break;
			case 2: // link
				result = "http://" + contato.valor.replace(/(http|https):\/\//gi, ""); // para garantir apenas um http://
				break;
				//            case 3: // outros
				//                result = contato.valor;
				//                break;
		}
		return result;
	};

	$scope.getIconClass = function(contato) {
		var result;
		switch (contato.tipoContato.tipo) {
			case 0: // telefone
				result = "ion-android-call";
				break;
			case 1: // email
				result = "ion-email";
				break;
			case 2: // link
				result = "ion-link"
				break;
		}
		return result;
	};

	$scope.getText = function(contato) {
		var result;
		switch (contato.tipoContato.tipo) {
			case 0: // telefone
				result = contato.valor;
				break;
			case 1: // email
				result = "Enviar email";
				break;
			case 2: // link
				result = contato.valor.replace(/(http|https):\/\//gi, "");
				break;
				//            case 3: // outros
				//                result = "Outros";
				//                break;
		}
		return result;
	};
});