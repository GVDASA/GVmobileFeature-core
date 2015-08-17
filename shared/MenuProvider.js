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
.provider("Menu", function MenuProvider($stateProvider, AppFeaturesProvider, FEATURES_MAP) {
    var menulist = [];
    return {
        addMenuItem: addMenuItem,
        $get: MenuService
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////

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

    function MenuService($timeout, $gvmUtil, $rootScope, $q, localStorage, dialogo, gvPermissionService) {
        var userDefinedMenus;
        return {
            get: getMenus,
            desktop: changeDesktopOption,
            resetMenu: resetMenu
        };

        ///////////////////////////////////////////////////////////////////////////////////////////////

        function resetMenu() {
            userDefinedMenus = null;
            localStorage.del('userMenus');
        };

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