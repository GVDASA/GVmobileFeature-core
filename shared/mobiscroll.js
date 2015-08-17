angular.module('core.mobiscroll', [
	'ionic'
])

.directive('mobiscroll', function() {
	return {
		restrict: 'A',
		scope: {
			scrollerTitle: '@mobiscrollTitle'
		},
		link: function(scope, elm, attrs, ctlr) {
			var theme = 'android-holo-light';
			if (ionic.Platform.is('win32nt') || ionic.Platform.is('windows')) {
				theme = 'wp-light';
			}else if (ionic.Platform.isIOS()) {
				theme = 'ios';
			};

			scope.scroller = {};
			var options = {
				onClose: function(valueText, btn, inst) {
					if (btn !== 'set') return;
					scope.scroller.valueText = valueText;
					scope.scroller.value = angular.copy(inst.getValue());
					//scope.scroller.values = angular.copy(inst.getValues());
					if (!scope.$$phase) scope.$apply();
					return true;
				},
				onBeforeShow: function(inst) {
					inst.option(scope.scroller.options);
					var dataAtual = $(this).val().split("/");
					inst.setValue([dataAtual[0], dataAtual[1] - 1, dataAtual[2]]);
				},
				onCancel: function(value, obj) {
					//$(this).val("");
				},
				type: 'date',
				rows: 3,
				accent: 'none',
				dayText: 'Dia',
				monthText: 'Mês',
				yearText: 'Ano',
				theme: theme,
				display: 'modal',
				cancelText: 'Cancelar',
				setText: 'OK',
				headerText: scope.scrollerTitle,
				mode: 'scroller',
				endYear: new Date().getFullYear(),
				dateFormat: 'dd/mm/yy',
				dateOrder: 'ddmmyy'
			};

			angular.extend(options, scope.scroller.options);
			elm.mobiscroll()[options.type](options);

			elm.on('$destroy', function() {
				elm.mobiscroll('destroy');
			});

			scope.scroller.call = function() {
				elm.mobiscroll.apply(elm, arguments);
			};
		}
	};
});