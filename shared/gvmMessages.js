angular.module('core.gvmMessages', [
    'ionic'
])

/**
 * @ngdoc directive
 * @name core.directive:gvmMessages
 * @scope
 * @restrict E
 *
 * @description
 * Região para exibir mensagens informativas ou de erros
 *
 */
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

/**
 * @ngdoc service
 * @name core.service:gvmMessagesService
 *
 * @description
 * Serviço utilizado para exibir mensagens informativas ou de erros em elementos gvm-messages
 *
 */
.factory('gvmMessagesService', function() {
    var innerServices = {};
    return new MessageService();
    // --------------------------------------------------------------
    function MessageService(name) {
        var service = {
            /**
            * @ngdoc method
            * @name clear
            * @methodOf core.service:gvmMessagesService
            * @description Remove a mensagem corrente
            */
            clear: function() {
                service.msg = undefined;
            },
            /**
            * @ngdoc method
            * @name info
            * @description Define uma mensagem informativa
            * @methodOf core.service:gvmMessagesService
            * @param {string} message Mensagem informativa a ser exibida
            */
            info: function(message) {
                service.msg = message;
                service.cls = 'info';
            },
            /**
            * @ngdoc method
            * @name error
            * @description Define uma mensagem de erro
            * @methodOf core.service:gvmMessagesService
            * @param {string} message Mensagem de erro a ser exibida
            */
            error: function(message) {
                service.msg = message;
                service.cls = 'error';
            },

            /**
            * @ngdoc method
            * @name get
            * @description Obtém uma instância do serviço de mensagens associado a um determinado elemento `gvm-messages`
            * @methodOf core.service:gvmMessagesService
            * @param {string} name Nome da instância a ser obtida
            * @returns {core.service:gvmMessagesService} Instância para exibir mensagens informativa ou de erro
            */
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