angular.module('core.connectionStatus', [
    'ionic',
    'core.gvmMessages'
])

.run(function($ionicPlatform, gvmMessagesService) {
    function isOffline() {
        return navigator.connection && navigator.connection.type === "none";
    }

    $ionicPlatform.on('online', function() {
        gvmMessagesService.get('connectionStatus').clear();
    });
    $ionicPlatform.on('offline', function() {
        gvmMessagesService.get('connectionStatus').info("Verifique sua conexão de rede e tente novamente.");
    });
    $ionicPlatform.on('resume', function() {
        // No iOS o evento de online não é disparado após o resume da aplicação caso
        // ele tenha ocorrido com a aplicação minimizada. Portanto é verificado a conexão
        // e disparado os handlers como se fosse o evento de online para execução imediata dos 
        // handlers
        if (!isOffline()) {
            // Esta seção resolve um problema do iOS o qual não notifica a aplicação se 
            // ela estiver minimizada sobre a alteração de conectividade.
            gvmMessagesService.get('connectionStatus').clear();
        }
    });
});