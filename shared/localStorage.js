angular.module('core.localStorage',[])

.factory('localStorage', function($window) {
		return {
			set: function(key, data) {
				$window.localStorage.setItem(key, angular.toJson(data));
				return true;
			},
			get: function(key) {
				var item = $window.localStorage.getItem(key);
				if (!item) {
					return item;
				}
				return JSON.parse(item);
			},
			del: function(key) {
				$window.localStorage.removeItem(key);
			},
			clear: function() {
				$window.localStorage.clear();
			}
		};
	});