angular.module('core.configuracoes')

    .controller("ConfiguracoesCtrl", function ($scope, $http, $timeout, $ionicModal, User, configService, APP_CONFIG, PushConfig, Notificacoes, gvmMessagesService, AppModulos, dialogo, localStorage, gvPermissionService) {

        var me = angular.extend($scope, {
            //feedbackEmail: APP_CONFIG.feedbackEmail,
            reminders: configService.getReminderConfig(),
            changePushOption: changePushOption,
            toggleModalVersao: toggleModalVersao,
            toggleModalFeedback: toggleModalFeedback,
            toggleModalDevMode: toggleModalDevMode,
            // Dados para a modal de sobre
            appName: APP_CONFIG.name,
            appVersion: APP_CONFIG.version,
            openUrl: openUrl,
            isChecked: isChecked,
            enviar: enviar,
            devLogin: devLogin,
            activeDevMode: activeDevMode
        });
        $scope.mv = me;

        User.getUserData().then(function (data) {
            me.nome = data.nome;
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', destroy);

        PushConfig.create().query({}, function (data) {
            var tipos = [];
            var registeredTypes = Notificacoes.getTypes();
            for (var prop in data) {
                var typeObj = registeredTypes[prop.toLowerCase()];

                if (prop.charAt(0) !== '$' && prop.charAt(1) !== '$' && (!!typeObj)) {
                    tipos.push({
                        tipoId: prop,
                        value: data[prop],
                        desc: (!!typeObj && typeObj.desc) ? typeObj.desc : prop
                    });
                }
            }
            me.tiposPush = tipos;
        }, function (data) {
            gvmMessagesService.info('Problemas ao efetuar a consulta.');
            window.gaPlugin && window.gaPlugin.trackEvent(
                function () { },
                function () { },
                "Conteúdo",
                "Sem resultado",
                "Sem resultados na exibição das configurações de push.",
                1
                );
        });

        // -----------------------------------------------------------------------------------------------------
        function enviar() {
            return sendFeedback(me.mensagem)
                .finally(function () {
                    me.mensagem = '';
                    toggleModalFeedback();
                    dialogo.toast("Feedback enviado com sucesso!");
                });
        }

        var atempts = 0;
        var devTimeOut;
        function activeDevMode() {
            $timeout.cancel(devTimeOut);
            devTimeOut = $timeout(function () {
                atempts = 0;
            }, 1000);
            atempts++;
            if (atempts == 7) {
                var isDev = !!localStorage.get("devId");
                if (isDev) {
                    dialogo.confirm("Deseja fazer logoff de desenvolvedor?", function (buttonIndex) {
                        if (buttonIndex == 1) {
                            localStorage.del("devId");
                            dialogo.alert("Logoff! Feche o aplicativo e abra novamente!");
                        }
                    }, "Desenvolvedor", ["Sim", "Não"]);
                } else {
                    toggleModalDevMode();
                }
            }
        }

        function devLogin() {
            var data = "grant_type=password&username=" + me.developerLogin + "&password=" + me.developerPassword + "&client_id=portal";
            $http.post(APP_CONFIG.urlApiPortal + "token", data, {
                ignoreAuthInterceptor: true
            }).then(function (tokenResponse) {
                $http.get(APP_CONFIG.urlApiPortal + "api/Account/UserInfo", {
                    ignoreAuthInterceptor: true,
                    headers: {
                        Authorization: "Bearer " + tokenResponse.data.access_token
                    }
                }).then(function (infoResponse) {
                    !!infoResponse.data.developerId && localStorage.set("devId", infoResponse.data.developerId);
                    me.developerLogin = me.developerPassword = "";
                    dialogo.alert("Desenvolvedor logado! Feche o aplicativo e abra novamente!");
                    toggleModalDevMode();
                }, function (err) {
                    dialogo.toast(err.data.error_description);
                    checkDevLoginAtempts();
                });
            }, function (err) {
                dialogo.toast(err.data.error_description);
                checkDevLoginAtempts();
            });
        }

        var devLoginAtempts = 0;
        function checkDevLoginAtempts() {
            devLoginAtempts++;
            if (devLoginAtempts > 2) {
                dialogo.toast("Máximo de tentativa de login atingido!");
                toggleModalDevMode();
            }
        }

        function toggleModalDevMode() {
            if (!me.modalDevMode) {
                $ionicModal.fromTemplateUrl('core/configuracoes/dev-modal.html', {
                    scope: me,
                    animation: 'slide-in-up'
                }).then(function (modalDevMode) {
                    me.modalDevMode = modalDevMode;
                    modalDevMode.show();
                });
            } else if (me.modalDevMode.isShown()) {
                me.modalDevMode.hide();
            } else {
                me.modalDevMode.show();
            }
        };

        function sendFeedback(text) {

            return gvPermissionService.getContextFeatures().then(function (ctxFeatures) {
                var contextData = AppModulos.getContextData();
                delete contextData.aluno.foto;
                contextData.perfil.data.alunos.map(function (a) {
                    delete a.foto;
                    return a;
                });
                var user = User.getCurrent();
                
                // features utilizadas pelo usuario 
                contextData.allowedFeatures = localStorage.get("allowedFeatures");
                contextData.contextFeatures = ctxFeatures;

                var data = {
                    usuarioLogadoId: user.codigoPessoa,
                    usuarioLogadoNome: user.nome,
                    mensagemFeedback: text,
                    appVersion: APP_CONFIG.version,
                    urlApiCliente: APP_CONFIG.urlApiCliente,
                    contextData: contextData
                };
                return $http.post(APP_CONFIG.urlApiPortal + "api/app/feedback", data);
            });
        }

        function destroy() {
            me.modalVersao && me.modalVersao.remove();
            me.modalFeedback && me.modalFeedback.remove();
            me.modalDevMode && me.modalDevMode.remove();
        }

        function isChecked(values) {
            // Ao menos um dos itens agrupados pela descrição é true;
            return (values || []).filter(function (tipo) {
                return tipo.value;
            }).length > 0;
        }

        function changePushOption(values, event) {
            event.preventDefault();
            var tipos = values || [];
            var newState = !isChecked(values);

            $timeout(function () {
                tipos.map(function (tipo) {
                    tipo.value = newState;
                });
            }, 200);

            var data = tipos.reduce(function (a, b) {
                a[b.tipoId] = newState;
                return a;
            }, {});

            $http.post('~/api/push/config/', data, {
                ignoreInterceptor: true
            });
        };

        function toggleModalVersao() {
            if (!me.modalVersao) {
                $ionicModal.fromTemplateUrl('core/configuracoes/sobre-modal.html', {
                    scope: me,
                    animation: 'slide-in-up'
                }).then(function (modalVersao) {
                    me.modalVersao = modalVersao;
                    modalVersao.show();
                });
            } else if (me.modalVersao.isShown()) {
                me.modalVersao.hide();
            } else {
                me.modalVersao.show();
            }
        };

        function toggleModalFeedback() {
            if (!me.modalFeedback) {
                $ionicModal.fromTemplateUrl('core/configuracoes/feedback-modal.html', {
                    scope: me,
                    animation: 'slide-in-up'
                }).then(function (modalFeedback) {
                    me.modalFeedback = modalFeedback;
                    modalFeedback.show();
                });
            } else if (me.modalFeedback.isShown()) {
                me.modalFeedback.hide();
            } else {
                me.modalFeedback.show();
            }
        };

        function openUrl(url) {
            window.open(url, '_system', 'location=yes,closebuttoncaption=Voltar,toolbar=no,presentationstyle=pagesheet');
        };
    });