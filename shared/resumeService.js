angular.module('core')

.factory('resumeService', function($exceptionHandler) {
	var ResumeService = {
		handlers: [],
		/*
		Executa sempre que estiver online e ocorrer evento de ready ou resume. 
		Se alguns destes eventos ocorrer e estiver offline, então será postergada a execução até que receba o evento de online.
		Caso multiplos eventos ocorram é garantido apenas uma execução.
		*/
		register: function(callback, scope) {
			return ResumeService.addHandler(callback, scope);
		},
		execHandlers: function() {
			for (var i = 0; i < ResumeService.handlers.length; i++) {
				try {
					ResumeService.handlers[i].apply(ResumeService.handlers[i], arguments);
				} catch (e) {
					$exceptionHandler(e);
				}
			};
		},
		addHandler: function(fnWorker, scope) {
			var handler = new Handler(fnWorker, scope);
			ResumeService.handlers.push(handler);
			return handler;
		}
	};
	return ResumeService;
	// --------------------------------------------------------------------
	function Handler(fnWorker, scope) {
		var me = this;
		me.fnWorker = fnWorker;
		me.isOffline = function() {
			// Se não tiver o plugin retornará sempre como online. Ajuda a debugar no browser;
			return navigator.connection && navigator.connection.type === "none";
		};
		me.handle = function(isOnOnlineCall) {
			if (!me.isOffline()) {
				if (isOnOnlineCall !== true || me.flag) {
					me.flag = false;
					me.fnWorker.call(scope || new Object);
				};
			} else {
				me.flag = true;
			}
		};
		return me.handle;
	}

})
.run(function($ionicPlatform, resumeService) {
	function isOffline() {
		return navigator.connection && navigator.connection.type === "none";
	}

	$ionicPlatform.on('online', function() {
		resumeService.execHandlers(true);
	});
	$ionicPlatform.on('resume', function() {
		if (!isOffline()) {
			resumeService.execHandlers();
		} else {
			resumeService.execHandlers(true);
		}
	});
	$ionicPlatform.ready(resumeService.execHandlers);
});