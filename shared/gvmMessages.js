// Elemento para exibir informações relativas a erros de conexão.
angular.module('core.gvmMessages', [
    'ionic'
])

.directive('gvmMessages', function(gvmMessagesService) {
    return {
        restrict: 'E',
        replace: false,
        scope: {},
        template: '<div class="list list-inset datamsg datamsg-{{name}} datamsg-{{gvmMessagesService.cls}}" ng-if="gvmMessagesService.msg"><div class="item text-center item-text-wrap">{{gvmMessagesService.msg}}</div></div>',
        link: function(scope, element, attr) {
            var name = attr.name || 'default';
            scope.gvmMessagesService = gvmMessagesService.get(name);
            scope.name = name;
        }
    }
})

.factory('gvmMessagesService', function() {
    var innerServices = {};
    return new MessageService();
    // --------------------------------------------------------------
    function MessageService(name) {
        var service = {
            clear: function() {
                service.msg = undefined;
            },
            info: function(message) {
                service.msg = message;
                service.cls = 'info';
            },
            error: function(message) {
                service.msg = message;
                service.cls = 'error';
            },

            get: function(name) {
                if (innerServices[name]) {
                    return innerServices[name];
                }
                return new MessageService(name);
            }
        };
        innerServices[name || 'default'] = service;
        return service;
    };
})

.run(function($rootScope, $timeout, gvmMessagesService) {
    // Remove a mensagem sempre que houver troca de estado da aplicação
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        gvmMessagesService.clear();
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $timeout(function() {
            gvmMessagesService.clear();
        }, 0);
    });
});