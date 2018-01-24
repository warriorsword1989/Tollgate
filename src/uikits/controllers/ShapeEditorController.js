/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class ShapeEditorController 单例
 */
fastmap.uikit.ShapeEditorController = (function () {
    var instantiated;
  /**
   * @param {Object} options options
   * @return {Object} Controller
   */
    function init(options) {
        var Controller = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
            options: {},
            /** *
             *
             * @param {Object}option options
             * @return {undefined}
             */
            initialize: function (option) {
                L.setOptions(this, option);
                this.map = null;
                this.editType = this.options.editType || '';
                this.editFeatType = null;
                this.currentEditinGeometry = {};
                this.currentTool = {
                    disable: function () {
                        return -1;
                    }
                };
                // this.shapeEditorResultFeedback = new fastmap.mapApi.ShapeEditResultFeedback({
                //     shapeEditor: this
                // });
                // this.shapeEditorResult = this.options.shapeEditorResult || new fastmap.mapApi.ShapeEditorResult();
            },
            /** *
             * 设置地图对象
             * @param {Object} map 地图
             * @return {undefined}
             */
            setMap: function (map) {
                this.map = map;
                this.toolsObjFac = fastmap.mapApi.ShapeEditorFactory({
                    shapeEditor: this
                });
            },
            /** *
             * 设置当前编辑的工具类型
             * @param {String}type 类型
             * @return {undefined}
             */
            setEditingType: function (type) {
                this.stopEditing();
                this.editType = type;
            },
            /** *
             * 设置当前编辑的要素类型
             * @param {String}type 类型
             * @return {undefined}
             */
            setEditFeatType: function (type) {
                this.editFeatType = type;
            },
            /** *
             * 当前编辑工具
             * @return {undefined}
             */
            getCurrentTool: function () {
                return this.currentTool;
            },
            /** *
             * 开始编辑
             * @param {fastmap.mapApi.Geometry}geometry 编辑的几何图形
             * @return {undefined}
             */
            startEditing: function () {
                // this.shapeEditorResult = shapeEditorResult;
                this.currentEditinGeometry = this.shapeEditorResult.getFinalGeometry();
                this._tools(this.editType);
            },
            /** *
             * 结束编辑 编辑的几何图形
             * @param {fastmap.mapApi.Geometry}geometry null
             * @return {undefined}
             */
            stopEditing: function () {
                if (this.currentTool) {
                    this.currentTool.disable();
                }
                this.shapeEditorResultFeedback.stopFeedback();
            },
            /** *
             * 放弃编辑
             * @return {undefined}
             */
            abortEditing: function () {
                this.shapeEditorResultFeedback.abortFeedback();
            },
            /** *
             *
             * @param {fastmap.mapApi.Geometry}geometry geometry
             * @return {undefined}
             */
            setEditingGeometry: function (geometry) {
                this.currentEditinGeometry = geometry;
            },
            /** *
             *
             * @returns {fastmap.mapApi.Geometry|*} currentEditinGeometry
             */
            getEditingGeometry: function () {
                return this.currentEditinGeometry;
            },
            /**
             * 不在editorLayer中使用的工具
             * @param {String} type 工具类型
             * @param {Object} option 数量
             * @return {undefined}
             */
            toolsSeparateOfEditor: function (type, option) {
                this.editType = type;
                this.currentTool = new fastmap.mapApi.CrossingAdd(option);
                this.currentTool.enable();
            },
            /**
             * 框选Node，弹popover
             * @param {String} type 工具类型
             * @param {Object} option 数量
             * @return {undefined}
             */
            toolsOfSelectNode: function (type, option) {
                this.editType = type;
                this.currentTool = new fastmap.mapApi.CrossingNodeAdd(option);
                this.currentTool.enable();
            },
            /** *
             * 当前工具类型
             * @param {String}type 类型
             * @returns {*} null
             * @private
             */
            _tools: function (type) {
                this.currentTool = null;
                this.currentTool = this.toolsObjFac.toolObjs[type];
                this.currentTool.enable();
            },
            destroy: function () {
                instantiated = null;
                this.toolsObjFac.destroy();
            }
        });
        return new Controller(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());
