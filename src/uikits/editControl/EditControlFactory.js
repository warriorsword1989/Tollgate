/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.EditControlFactory = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.currentControl = null;
    },

    selectControl: function (map, geoLiveType, options) {
        return new fastmap.uikit.editControl.SelectControl(map, geoLiveType, options);
    },

    startupToolControl: function (map, toolName, options) {
        return new fastmap.uikit.editControl.StartupToolControl(map, toolName, options);
    },

    copyLineControl: function (map, geoLiveType) {
        return new fastmap.uikit.editControl.CopyLineControl(map, geoLiveType);
    },

    BatchIndexGuideAutoControl: function (map, geoLiveType, options) {
        return new fastmap.uikit.editControl.BatchIndexGuideAutoControl(map, geoLiveType, options);
    },

    BatchIndexGuideManualControl: function (map, geoLiveType, options) {
        return new fastmap.uikit.editControl.BatchIndexGuideManualControl(map, geoLiveType, options);
    },

    destroy: function () {
        fastmap.uikit.editControl.EditControlFactory.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.editControl.EditControlFactory.instance) {
                fastmap.uikit.editControl.EditControlFactory.instance =
                    new fastmap.uikit.editControl.EditControlFactory();
            }
            return fastmap.uikit.editControl.EditControlFactory.instance;
        }
    }
});

