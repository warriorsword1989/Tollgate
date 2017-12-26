/**
 * 单例对象,管理地图中所有的工具
 * @class fastmap.uikit.ToolController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.ToolController = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();

        this.dblClickTimeInterval = 300;

        this.dblClickDisInterval = 1;

        this.lastClickTime = null;

        this.lastClickPos = null;

        this.map = null;

        // 所有注册的工具,不包含后台工具
        this.tools = {};

        // 所有的后台工具
        this.backTools = {};

        // 当前的工具
        this.currentTool = null;

        // 指示当前工具是否运行,对背景后台工具无效
        this.isRunning = true;

        this.loadTools();

        this.resetLastClickStatus();
    },

    /**
     * 加载地图工具
     * @method loadTools
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    loadTools: function () {
        this.addTool(new fastmap.uikit.PanTool());
        this.addTool(new fastmap.uikit.selectTool.PointSelectTool());
        this.addTool(new fastmap.uikit.selectTool.RectSelectTool());
        this.addTool(new fastmap.uikit.selectTool.PolygonSelectTool());
    },

    /**
     * 设置地图对象
     * @method setMap
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} map 地图对象
     * @return {undefined}
     */
    setMap: function (map) {
        this.map = map;
    },

    /**
     * 重新设置点击状态
     * @method resetLastClickStatus
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    resetLastClickStatus: function () {
        this.lastClickTime = 0;

        this.lastClickPos = {
            type: 'Point',
            coordinates: [-Number.MAX_VALUE, -Number.MAX_VALUE]
        };
    },

    /**
     * 添加工具,不激活工具, 如果工具已经存在则忽略
     * @method addTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @return {undefined}
     */
    addTool: function (tool) {
        if (this.tools.hasOwnProperty(tool.name)) {
            return;
        }

        this.tools[tool.name] = tool;
    },

    /**
     * 根据名称删除工具，如果工具未注册则忽略，如果工具处于激活状态，先退出激活状态
     * @method delTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} toolName 地图工具名称
     * @return {undefined}
     */
    delTool: function (toolName) {
        if (!this.tools.hasOwnProperty(toolName)) {
            return;
        }

        if (toolName === this.currentTool.name) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }

        delete this.tools[toolName];
    },

    /**
     * 添加后台工具，并激活工具。如果工具已经存在则忽略
     * @method addBackTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @return {undefined}
     */
    addBackTool: function (tool) {
        if (this.backTools.hasOwnProperty(tool.name)) {
            return;
        }

        tool.onActive(this.map, null, null);
        this.backTools[tool.name] = tool;
    },

    /**
     * 根据名称删除后台工具，如果工具未注册则忽略，如果工具处于激活状态,先退出激活状态
     * @method delBackTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} toolName 地图工具
     * @return {undefined}
     */
    delBackTool: function (toolName) {
        if (!this.backTools.hasOwnProperty(toolName)) {
            return;
        }

        var tool = this.backTools[toolName];
        tool.onDeactive();

        delete this.backTools[toolName];
    },

    /**
     * 根据名称设置当前工具
     * @method resetCurrentTool
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} toolName 地图工具名称
     * @param  {object} onFinish 回调函数
     * @param  {object} options 可选对象
     * @return {boolean} 布尔值
     */
    resetCurrentTool: function (toolName, onFinish, options) {
        this.continue();

        if (!this.tools.hasOwnProperty(toolName)) {
            return false;
        }

        var tool = this.tools[toolName];

        if (this.currentTool) {
            this.currentTool.onDeactive();
        }

        if (!tool.onActive(this.map, onFinish, options)) {
            return false;
        }

        this.currentTool = tool;
        return true;
    },

    /**
     * 如果当前工具存在，先退出激活，然后清空
     * @method clearCurrentTool
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    clearCurrentTool: function () {
        if (this.currentTool) {
            this.currentTool.onDeactive();
            this.currentTool = null;
        }
    },

    /**
     * 暂停当前工具
     * @method pause
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    pause: function () {
        this.isRunning = false;
    },

    /**
     * 继续当前工具
     * @method continue
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    continue: function () {
        this.isRunning = true;
    },

    /**
     * 事件响应函数
     * @method onMouseDown
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseDown: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDown', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDown', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDown', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    /**
     * 事件响应函数
     * @method onMouseUp
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseUp: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonUp', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonUp', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonUp', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }

        // 鼠标弹起的时候处理模拟click事件
        var now = new Date().getTime();
        var diffTime = now - this.lastClickTime;
        var pos = this.PointToGeojson(event.layerPoint);
        var diffDis = this.geometryAlgorithm.distance(pos, this.lastClickPos);
        if (diffTime < this.dblClickTimeInterval && diffDis < this.dblClickDisInterval) {
            this.onDblClick(event);
            // 双击触发后恢复状态
            this.resetLastClickStatus();
        } else {
            this.onClick(event);
            this.lastClickPos = pos;
            this.lastClickTime = now;
        }
    },

    /**
     * 事件响应函数
     * @method onMouseMove
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onMouseMove: function (event) {
        this.dispatchEvent('onMouseMove', event);
    },

    /**
     * 事件响应函数
     * @method onWheel
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onWheel: function (event) {
        this.dispatchEvent('onWheel', event);
    },

    /**
     * 事件响应函数
     * @method onClick
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onClick: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonClick', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    /**
     * 事件响应函数
     * @method onDblClick
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onDblClick: function (event) {
        var buttonType = this.getButtonType(event.originalEvent.button);
        switch (buttonType) {
            case 'leftButton':
                this.dispatchEvent('onLeftButtonDblClick', event);
                break;
            case 'middleButton':
                this.dispatchEvent('onMiddleButtonDblClick', event);
                break;
            case 'rightButton':
                this.dispatchEvent('onRightButtonDblClick', event);
                break;
            default:
                throw new Error('未知按键类型:' + buttonType);
        }
    },

    /**
     * 事件响应函数
     * @method onKeyDown
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyDown: function (event) {
        this.dispatchEvent('onKeyDown', event);
        this.onKeyPress(event);
    },

    /**
     * 事件响应函数
     * @method onKeyUp
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyUp: function (event) {
        this.dispatchEvent('onKeyUp', event);
    },

    /**
     * 事件响应函数
     * @method onKeyPress
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    onKeyPress: function (event) {
        this.dispatchEvent('onKeyPress', event);
    },

    /**
     * 获取按键类型
     * @method getButtonType
     * @author XuJie
     * @date   2017-09-11
     * @param  {number} button 按键类型
     * @return {string} 按键类型
     */
    getButtonType: function (button) {
        switch (button) {
            case 0:
                return 'leftButton';
            case 1:
                return 'middleButton';
            case 2:
                return 'rightButton';
            default:
                throw new Error('未知按键类型:' + button);
        }
    },

    /**
     * 事件派发函数
     * @method dispatchEvent
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} eventName 事件名
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    dispatchEvent: function (eventName, event) {
        var keys = Object.keys(this.backTools);
        for (var i = 0; i < keys.length; ++i) {
            var tool = this.backTools[keys[i]];
            this.callEventHandler(tool, eventName, event);
        }

        if (this.currentTool && this.isRunning) {
            this.callEventHandler(this.currentTool, eventName, event);
        }
    },

    /**
     * 触发事件处理函数
     * @method callEventHandler
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} tool 地图工具
     * @param  {string} eventName 事件名
     * @param  {object} event 事件对象
     * @return {undefined}
     */
    callEventHandler: function (tool, eventName, event) {
        var eventMethod = tool[eventName];
        if (eventMethod) {
            try {
                eventMethod.call(tool, event);
            } catch (err) {
                FM.Util.log(err);
            }
        }
    },

    /**
     * point转换为几何对象
     * @method PointToGeojson
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} point 点
     * @return {object} geojson
     */
    PointToGeojson: function (point) {
        var geojson = {
            type: 'Point',
            coordinates: [point.x, point.y]
        };
        return geojson;
    },

    /**
     * 销毁单例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy: function () {
        fastmap.uikit.ToolController.instance = null;
    },

    statics: {
        instance: null,

        /**
         * 获取单例对象
         * @method getInstance
         * @author XuJie
         * @date   2017-09-11
         * @return {object} 单例对象
         */
        getInstance: function () {
            if (!fastmap.uikit.ToolController.instance) {
                fastmap.uikit.ToolController.instance =
                    new fastmap.uikit.ToolController();
            }
            return fastmap.uikit.ToolController.instance;
        }
    }
});
