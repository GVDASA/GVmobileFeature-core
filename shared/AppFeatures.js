angular.module('core.FeatureProvider', [])

    .provider('AppFeatures', function AppFeaturesProvider(FEATURES_MAP) {
        var me = this;
        me.appFeatures = [];
        me.allowedFeatures = [];
        me.contextAllowedFeatures = [];

        return {
            addAppFeature: addAppFeature,
            $get: AppFeaturesService
        };
        //////////////////////////////////////////////////////////////////////
        function addAppFeature(feature) {
            me.appFeatures.push(feature);
        };

        function AppFeaturesService(localStorage) {

            return {
                setAllowedFeatures: setAllowedFeatures,
                getAllowedFeatures: getAllowedFeatures,
                features: me.appFeatures
            };

            function setAllowedFeatures(userFeatures) {
                var isDeveloperMode = !!localStorage.get("devId");
                me.allowedFeatures = me.appFeatures.filter(function (appFeatureItem) {
                    return isDeveloperMode || userFeatures.filter(function (feature) {
                        return FEATURES_MAP[feature.toUpperCase()] == appFeatureItem;
                    }).length > 0;
                });
                localStorage.set("allowedFeatures", me.allowedFeatures);
            }

            function getAllowedFeatures() {
                if (!!!me.allowedFeatures) {
                    me.allowedFeatures = localStorage.get("allowedFeatures");
                }
                return localStorage.get("allowedFeatures");
            }
        }
    });
