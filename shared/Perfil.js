angular.module('core')

.provider('Perfil', function PerfilProvider() {
	var perfis = [];
	return {
		addPerfil: addPerfil,
		$get: PerfilService
	};
	//////////////////////////////////////////////////////////////////////
	function addPerfil(value) {
		var args = angular.isArray(value) ? value : [value];
		angular.forEach(args, function(val) {
			perfis.push(val);
		});
	};

	function PerfilService() {
		return {
			getPerfis: getPerfis
		};
		/////////////////////////////////////////////////////////////////////
		function getPerfis() {
			return perfis;
		};
	}
});