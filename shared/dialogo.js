// serviço para exibir todas as mensagens ao usuário
angular.module('core.dialogo', [])
/**
 * @ngdoc service
 * @name core.service:dialogo
 *
 * @description
 * Serviço para exibir mensagens em formato popup.
 */
.service('dialogo', function() {

	this.toastConst = {
		position: {
			TOP: 'top',
			CENTER: 'center',
			BOTTOM: 'bottom'
		},
		duration: {
			SHORT: 'short',
			LONG: 'long'
		}
	};
	/**
	* @ngdoc method
	* @methodOf core.service:dialogo
	* @name toast
	* @description Exibe uma mensagem informativa para o usuário que é ocultada após determinado tempo.
	* @param {string} message Conteúdo da mensagem.
	* @param {string} position Posição em que a mensagem será exibida.
	* @param {long} duration Tempo que a mensagem será exibida na tela.
	* @param {function} success Função de callback em caso de sucesso.
	* @param {function} error Função de callback em caso de erro.
	*/
	this.toast = function(message, position, duration, success, error) {
		// duration: 'short', 'long'
		// position: 'top', 'center', 'bottom'
		var duration = !!duration ? duration : 'long';
		var position = !!position ? position : 'center';
		var success = !!success ? success : function() {};
		var error = !!error ? error : function() {};
		if (window.plugins && window.plugins.toast) {
			window.plugins.toast.show(message, duration, position, success, error);
		} else {
			alert(message);
		}
	};
	/**
	* @ngdoc method
	* @methodOf core.service:dialogo
	* @name confirm
	* @description Exibe uma mensagem de confirmação para o usuário.
	* @param {string} message Conteúdo da mensagem.
	* @param {function} callback Função de callback.
	* @param {string} title Título da popup.
	* @param {string} buttonLabels Nome dos botões.
	*/
	this.confirm = function(message, callback, title, buttonLabels) {
		if (navigator.notification) {
			navigator.notification.confirm(
				message,
				callback,
				title,
				buttonLabels
			);
		} else {
			callback(confirm(message));
		}
	};
	/**
	* @ngdoc method
	* @methodOf core.service:dialogo
	* @name alert
	* @description Exibe uma mensagem informativa para o usuário.
	* @param {string} message Conteúdo da mensagem.
	* @param {function} callback Função de callback.
	* @param {string} title Título da popup.
	* @param {string} buttonLabels Nome do botão.
	*/
	this.alert = function(message, callback, title, buttonName) {
		if (!!title) {
			title = "Aviso";
		}
		if (!!buttonName) {
			buttonName = "Ok";
		}
		if (navigator.notification) {
			navigator.notification.alert(
				message,
				callback,
				title,
				buttonName
			);
		} else {
			alert(message);
		}
	};
});