// Serviço para requisição de notificações
angular.module('core')

.factory('controleAcesso', function($http, $rootScope, $timeout, loginService, AppModulos, User, APP_CONFIG) {
    var timer;
	return {
		logarAcesso: function() {

			if (loginService.isLoggedIn()) {
				User.getUserData().then(function(dadosUsuario) {
					
                    // Google Analytics Track User ID
                    dadosUsuario && dadosUsuario.codigoPessoa && window.analytics && window.analytics.setUserId(dadosUsuario.codigoPessoa);
                    
					// Se não esta logado ainda, precisa retornar algo!
					if (!dadosUsuario) dadosUsuario = {
						codigoPessoa: 0,
						alunos: [{
							id: 0
						}]
					};

                    var servicoDefinicaoAtual = AppModulos.getServicoDefinicaoAtual();

					var data = {
						codigoUsuario: dadosUsuario.codigoPessoa
					};
					
                    if(!!servicoDefinicaoAtual.getAlunoSelecionado){
                        data.codigoAlunos = [servicoDefinicaoAtual.getAlunoSelecionado().id];
                    }

					// adicionado timeout para nao efetuar requisições desnecessarias
                    $timeout.cancel(timer);
                    timer = $timeout(function(){
						// console.log(data);
						$http.post(APP_CONFIG.urlApiPortal + "api/app/acesso", data, {
							ignoreInterceptor: true
						});
					}, 10000);
				});
			}
		}
	};
});