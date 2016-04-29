var AuthStorageAdapter = (function () {
    function AuthStorageAdapter($window, appStorage) {
        this.$window = $window;
        this.appStorage = appStorage;
    }
    AuthStorageAdapter.prototype.getItem = function (name) {
        var item = this.$window.sessionStorage.getItem(name) || this.appStorage.getItem(name);
        return item;
    };
    AuthStorageAdapter.prototype.removeItem = function (name, isPersistent) {
        var storage = isPersistent ? this.appStorage : this.$window.sessionStorage;
        return storage.removeItem(name);
    };
    AuthStorageAdapter.prototype.setItem = function (name, value, isPersistent) {
        var storage = isPersistent ? this.appStorage : this.$window.sessionStorage;
        return storage.setItem(name, value);
    };
    return AuthStorageAdapter;
})();

angular.module('core.localStorage', [])
    .service('$$storage', AuthStorageAdapter)
    .factory('localStorage', function ($window) {
        return {
            set: function (key, data) {
                $window.localStorage.setItem(key, angular.toJson(data));
                return true;
            },
            get: function (key) {
                var item = $window.localStorage.getItem(key);
                if (!item) {
                    return item;
                }
                return JSON.parse(item);
            },
            del: function (key) {
                $window.localStorage.removeItem(key);
            },
            clear: function () {
                $window.localStorage.clear();
            }
        };
    });

