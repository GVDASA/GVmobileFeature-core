angular.module('core')

.factory('User', function User($http, $q, localStorage, Perfil, AppFeatures, FEATURES_MAP) {
	var userData, current;
	return {
		getUserData: getUserData,
		getCurrent: getCurrent,
		clearUserData: clearUserData,
	};
	////////////////////////////////////////////////////////////////
	function clearUserData() {
		userData = undefined;
		localStorage.del('userData');
	};

	/*
	 * Obtém as informações do usuário.
	 * Se inBackground  true, irá forçar uma requisição usando o ignoreInterceptor e retornará o objeto com a propriedade "changed" indicando se teve alteração.
	 */
	function getUserData(inBackground) {
		//Carrega do storage apenas na primeira vez
		if (!userData) {
			userData = localStorage.get('userData');
		}
		if (!userData || inBackground) {
			return $q.when(updateUserData(!!inBackground));
		} else {
			return $q.when(userData);
		}
	};

	function updateUserData(inBackground) {
		return $http.get("~/api/Perfil", {
			ignoreInterceptor: !!inBackground
		}).then(function(info) {
			var dataChanged = false;
			var pessoa = info.data == "null" ? null : info.data;
			var perfisObj = Perfil.getPerfis().reduce(function(a, b) {
				a[b.perfil] = true;
				return a;
			}, {});

			var allowedModules = !!pessoa && pessoa.modulos.filter(function(m) {
				return perfisObj[m.nome];
			});

			if (!pessoa || pessoa.modulos.length == 0 || allowedModules.length == 0) {
				//Se não tem informação 
				userData = null;
				saveUserDataOnStorage();
				return $q.reject();
			} else if (angular.toJson(pessoa) !== angular.toJson(userData)) {
				//Se os dados da pessoa foram alterados
				userData = pessoa;
				saveUserDataOnStorage();
				dataChanged = true;
			}
			
			AppFeatures.setAllowedFeatures(userData.features);

			return angular.extend({
				changed: dataChanged
			}, userData);
		});
	};

	function saveUserDataOnStorage() {
		localStorage.set('userData', userData);
	};

	function getCurrent() {
		return userData;
	}
});