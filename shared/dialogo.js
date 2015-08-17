// serviço para exibir todas as mensagens ao usuário
angular.module('core.dialogo', [])

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

	this.alert = function(message, callback, title, buttonName) {
		if (title == undefined) {
			title = "Aviso";
		}
		if (buttonName == undefined) {
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