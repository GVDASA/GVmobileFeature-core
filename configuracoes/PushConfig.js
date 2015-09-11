angular.module('core.configuracoes')

.factory('PushConfig', function($resource) {
    return {
        create: function() {
            return $resource("~/api/push/config/", {}, {
                "update": {
                    method: "PUT"
                },
                'query': {
                    method: 'GET',
                    isArray: false,
                    cache: true
                }
            });
        }
    };
});