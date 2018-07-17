/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.editControl.CopyLineControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, options) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);
        this.geoLiveType = options;
        this.complexEditor = fastmap.uikit.complexEdit.ComplexEditor.getInstance();
        this.topoEditor = this.topoEditFactory.createTopoEditor(this.geoLiveType, this.map);
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = this.topoEditor.getCopyResult();
        this.complexEditor.start(editResult, this.onFinish);

        return true;
    },

    abort: function () {
        fastmap.uikit.editControl.EditControl.prototype.abort.apply(this, arguments);
        this.complexEditor.abort();
    },

    onFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

      this.onUpdateSuccess(editResult);
    },

    onUpdateSuccess: function (editResult) {
        this.complexEditor.stop();
        let ids = editResult.links.map(item => item.properties.id);
        let systemIds = editResult.links.map(item => item.properties.systemId);
        this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: ids, systemIds: systemIds, event: event, flag:'insert',sourceFlag: 3 });
        console.log(editResult);
        this.run();
    }
});
