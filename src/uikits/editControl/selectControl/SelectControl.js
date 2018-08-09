/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.editControl.SelectControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType, options) {
        this.appUtil = require('../../../Application');
        fastmap.uikit.editControl.EditControl.prototype.initialize.apply(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.selectMode = options.selectMode ? options.selectMode : 'point';
        this.geoLiveType = geoLiveType;
        this.options = options;
    },

    run: function () {
        // 注意:选择流程不需要切换场景
        this.setCurrentControl(this);

        var toolName = this.getToolName(this.selectMode);
        var success = this.toolController.resetCurrentTool(toolName, this.onSelectFinish, this.geoLiveType);
        if (!success) {
            swal('提示', '未能激活选择工具:' + toolName, 'info');
            return false;
        }

        this.status = 'Running';

        return true;
    },

    getToolName: function (selectMode) {
        // 暂时只支持点选和框选,其他选择方式用到时再添加
        switch (selectMode) {
            case 'point':
                return 'PointSelectTool';
            case 'rect':
                return 'RectSelectTool';
            case 'streetView':
                return 'StreetViewSelectTool';
            default:
                return 'PointSelectTool';
        }
    },

    onSelectFinish: function (features, event) {
        let ids = [];
        let systemIds = features.map(item => item.properties.systemId);
        if (features.length > 0) {
            if (this.appUtil.appUtil.getGolbalData().workType === 'static') {
                ids = features.filter(item => [0, 1].includes(item.properties.static));
            } else {
                ids = features.filter(item => [0, 1].includes(item.properties.dynamic));
            }
            this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: ids.map(item => item.properties.id), systemIds: systemIds, event: event, flag: 'update', sourceFlag: 3, toolType: 'point' });
        }
        // 支持连续选择
        this.run();
    }
});
