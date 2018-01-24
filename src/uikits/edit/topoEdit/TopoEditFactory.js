/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.TopoEditFactory = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    createTopoEditor: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'RDTOLLGATE':
                return new fastmap.uikit.topoEdit.CopyToLineTopoEditor(map);
            default:
                return null;
        }
    },

    destroy: function () {
        fastmap.uikit.topoEdit.TopoEditFactory.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.topoEdit.TopoEditFactory.instance) {
                fastmap.uikit.topoEdit.TopoEditFactory.instance =
                    new fastmap.uikit.topoEdit.TopoEditFactory();
            }
            return fastmap.uikit.topoEdit.TopoEditFactory.instance;
        }
    }
});

