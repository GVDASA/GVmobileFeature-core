angular.module('core.configuracoes')

.controller("AjudaCtrl", function($scope, ajudaService) {
    var me = angular.extend($scope, {
        filterFunction: filterFunction,
        busca: ""
    });

    ajudaService.get().then(function(secoes) {
        me.secoes = secoes;
        me.secoes.reduce(function(previousValue, currentValue) {
                return currentValue.questoes ? previousValue.concat(currentValue.questoes) : previousValue;
            }, [])
            .map(function(questao) {
                questao.slug = slugText(questao.title);
            });
    });

    $scope.mv = me;

    ////////////////////////////////////////////////////////////////////////////////////////
    function filterFunction(element) {
        if (!!me.busca) {
            var query = me.busca.toLowerCase();
            return !!element.questoes.filter(function(q) {
                return q.title.toLowerCase().indexOf(query) !== -1 || q.text.toLowerCase().indexOf(query) !== -1;
            }).length || element.title.toLowerCase().indexOf(query) !== -1;
        }
        return true;
    };

    function slugText(text) {
        return text.toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };
});