angular.module('core.configuracoes')

.service('configService', function(localStorage) {

    var configs = {
        reminders: [],
        reminderDefaultOptions: [{
            value: 5,
            desc: "5 minutos"
        }, {
            value: 10,
            desc: "10 minutos"
        }, {
            value: 15,
            desc: "15 minutos"
        }, {
            value: 20,
            desc: "20 minutos"
        }, {
            value: 30,
            desc: "30 minutos"
        }, {
            value: 60,
            desc: "1 hora"
        }, {
            value: 120,
            desc: "2 horas"
        }, {
            value: 1440,
            desc: "1 dia"
        }, {
            value: 2880,
            desc: "2 dias"
        }],
        getReminderConfig: function() {

            var eventTimeAlert = localStorage.get("eventTimeAlert");

            return configs.reminders.map(function(r) {
                var reminder = {
                    name: r.name,
                    time: localStorage.get("timeTo_" + r.name.replace(/(\w+)\s/g, "$1") + "_alert") || eventTimeAlert,
                    alterTimeToShow: function(reminder) {
                        localStorage.set("timeTo_" + r.name.replace(/(\w+)\s/g, "$1") + "_alert", parseInt(reminder.time));
                    },
                    options: r.options || configs.reminderDefaultOptions
                };
                return reminder;
            });
        }
    };

    return configs;
});