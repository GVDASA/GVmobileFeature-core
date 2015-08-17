angular.module('core')

.service('calendario', function(localStorage) {

	this.createEvent = function(title, location, notes, startDate, endDate, success, error) {

		startDate = new Date(startDate.getTime() - (localStorage.get("eventTimeAlert") * 60 * 1000));

		if (this.useNotification()) {
			try {
				window.plugin.notification.local.add({
					id: startDate.getTime(),
					date: startDate,
					message: notes,
					title: title + " " + location,
					json: JSON.stringify({
						teste: 1
					}),
					autoCancel: true
				});
				success();
			} catch (e) {
				error(e);
			}
		} else {
			window.plugins.calendar.createEvent(
				title, location, notes, startDate,
				endDate, success, error
			);
		}
	};

	this.cancelAllEvents = function(scope) {
		if (!!window.plugin && this.useNotification()) {
			window.plugin.notification.local.cancelAll(function() {}, scope);
		}
	};

	this.useNotification = function() {
		if (window.device == undefined || (parseFloat(device.version) >= 3 && device.platform === "Android") || device.platform === "iOS" || device.platform === "WinCE") {
			return true;
		} else if (parseFloat(device.version) < 3 && device.platform === "Android") {
			return false;
		}
	};
});