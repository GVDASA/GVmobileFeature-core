// ----------------------------------------------------------------------------------------------
// menuService - Serviço de controle do menu e desktop
// ----------------------------------------------------------------------------------------------
angular.module('core.MenuProvider', [
    'core.localStorage',
    'core.dialogo',
    'core.utils',
    'core.FeatureProvider'
])
.run(function($rootScope, Menu){
    $rootScope.$on('CONTEXT_FORMED', function(e, val) {
        Menu.resetMenu();
    });
})

/**
* @ngdoc service
* @name core.service:MenuProvider
*
* @description
* Configura o serviço de menu.
*/
.provider("Menu", function MenuProvider($stateProvider, AppFeaturesProvider, FEATURES_MAP) {
    var menulist = [];
    return {
        addMenuItem: addMenuItem,
        $get: MenuService
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
	* @ngdoc method
	* @methodOf core.service:MenuProvider
	* @name addMenuItem
	* @description Adiciona um item ao menu.
	* @param {object} value Objeto de configuração do item do menu.
    * @param {string} value.name Nome que será exibido no item de menu.
    * @param {string} value.module Nome do módulo a qual este item pertence.
    * @param {string} value.url Url referente ao item de menu.
    * @param {string} value.icon Ícone que será exibido no menu.
    * @param {string} value.feature Nome da feature atrelada a este item de menu.
    * @param {boolean=} value.desktop Indica se irá ser exibido no desktop ou não.
    * @param {number=} value.order Ordem do item de menu no menu.
    * @param {object} value.cfg Configuração que será passada ao objeto $state do ui.router.
	*/
    function addMenuItem(value) {
        var args = angular.isArray(value) ? value : [value];
        angular.forEach(args, function(menuItem) {
            menuItem.alwaysShow = !!menuItem.alwaysShow; 
            !!menuItem.feature && AppFeaturesProvider.addAppFeature(menuItem.feature);
            menulist.push(menuItem);
            if (menuItem.cfg) {
                $stateProvider.state('main' + menuItem.cfg.url.replace('/', '.'), menuItem.cfg);
            };
        });
    };

    /**
    * @ngdoc service
    * @name core.service:MenuService
    *
    * @description
    * Realiza o gerenciamento do menu do aplicativo.
    */
    function MenuService($timeout, $gvmUtil, $rootScope, $q, localStorage, dialogo, gvPermissionService) {
        
        var userDefinedMenus;
        return {
            get: getMenus,
            desktop: changeDesktopOption,
            resetMenu: resetMenu
        };

        /**
        * @ngdoc method
        * @methodOf core.service:MenuService
        * @name resetMenu
        * @description Volta o menu ao estado original.
        */
        function resetMenu() {
            userDefinedMenus = null;
            localStorage.del('userMenus');
        };

        /**
        * @ngdoc method
        * @methodOf core.service:MenuService
        * @name getMenus
        * @description Carrega os menus que o usuário possui permissão.
        */
        function getMenus() {
            var deferred = $q.defer();

            // Obtem os menus conforme configuração do usuário
            var userMenus = localStorage.get('userMenus') || [];
            if (!userDefinedMenus) {
                // somente os campos {name:string,desktop:bool} são salvos
                // Realiza um left join pela propriedade 'name', copiando apenas a propriedade que o usuário pode alterar "desktop";
                userDefinedMenus = $gvmUtil.merge(menulist, userMenus, 'name', function inner(menuItem, userMenuItem) {
                    menuItem.desktop = userMenuItem.desktop;
                    return menuItem;
                }, function left(menuItem) {
                    return menuItem;
                });

                gvPermissionService.getContextFeatures().then(function (ctxFeatures) {
                    userDefinedMenus = userDefinedMenus.filter(function (menu) {
                        return menu.alwaysShow || ctxFeatures.filter(function (feature) {
                            return menu.feature == feature;
                        }).length > 0;
                    });
                    deferred.resolve(userDefinedMenus);
                });
            } else {
                deferred.resolve(userDefinedMenus);
            }
            return deferred.promise;
        };

        /**
        * @ngdoc method
        * @methodOf core.service:MenuService
        * @name changeDesktopOption
        * @description Altera o item do menu para que seja exibido no desktop ou não.
        * @param {object} menu Menu.
        * @param {boolean} shouldAdd Indica se deve ou não adicionar o item ao desktop.
        */
        function changeDesktopOption(menu, shouldAdd) {
            if (menu.desktop && shouldAdd) {
                dialogo.alert('Este menu já existe em seu desktop.');
                return;
            } else if (menu.desktop && !shouldAdd) {
                dialogo.confirm('Deseja remover este atalho do desktop?', function(opcao) {
                    if (opcao == 1) {
                        $timeout(function() {
                            menu.desktop = false;
                            saveOnStorage(); // Update user definitions on storage; 
                        }, 100);
                    };
                }, 'Aviso', ['Sim', 'Não']);
            } else if (!menu.desktop && shouldAdd) {
                $timeout(function() {
                    menu.desktop = true;
                    saveOnStorage(); // Update user definitions on storage;
                }, 100);
            }
        };

        /**
        * @ngdoc method
        * @methodOf core.service:MenuService
        * @name saveOnStorage
        * @description Salva as configurações do menu no storage do dispositivo.
        */
        function saveOnStorage() {
            // Update user definitions on storage;
            // somente os campos {name:string,desktop:bool} são salvos
            if (!!userDefinedMenus) {
                localStorage.set('userMenus', userDefinedMenus.map(function (mi) {
                    return {
                        name: mi.name,
                        desktop: mi.desktop
                    };
                }));
            } else {
                getMenus().then(function (menus) {
                    localStorage.set('userMenus', menus.map(function (mi) {
                        return {
                            name: mi.name,
                            desktop: mi.desktop
                        };
                    }));
                });
            }            
        };
    };
});