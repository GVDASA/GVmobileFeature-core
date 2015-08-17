angular.module('core.contato')

.factory('CanaisDeContato', function($resource) {

    return {
        create: function(params, success, error) {
            var Resource = $resource("~/api/setores", {}, {
                "update": {
                    method: "PUT"
                },
                'query': {
                    method: 'GET',
                    isArray: false,
                    cache: true
                }
            });
            Resource.query(params, success, error);;
        }
    };
});