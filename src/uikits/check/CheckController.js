/**
 * 检查模块的总控制器
 * @class fastmap.uikit.check.CheckController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.check.CheckController = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} options 可选对象
     * @return {undefined}
     */
    initialize: function (options) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.checkEngines = {};
        this.loadCheckEngines();
    },

    /**
     * 加载CheckConfig.js配置文件中的检查规则
     * @method loadCheckEngines
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    loadCheckEngines: function () {
        var config = fastmap.uikit.check.CheckConfig;
        var keys = Object.getOwnPropertyNames(config);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var value = config[key];
            this.checkEngines[key] = {};
            this.createCheckEnginesByType(key, value);
        }
    },

    /**
     * 根据要素类型创建检查引擎
     * @method createCheckEnginesByType
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} geoLiveType 要素类型
     * @param  {object} config 要素的对应的检查规则配置
     * @return {undefined}
     */
    createCheckEnginesByType: function (geoLiveType, config) {
        var keys = Object.getOwnPropertyNames(config);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var situation = key;
            var checkEngine = new fastmap.uikit.check.CheckEngine(geoLiveType, situation);
            var ruleNames = config[key];
            this.loadCheckRules(checkEngine, ruleNames);
            this.checkEngines[geoLiveType][situation] = checkEngine;
        }
    },

    /**
     * 向检查引擎中添加当前 situation 下配置的检查规则
     * @method loadCheckRules
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} checkEngine 检查引擎
     * @param  {array} ruleNames 检查规则名称数组
     * @return {undefined}
     */
    loadCheckRules: function (checkEngine, ruleNames) {
        for (var i = 0; i < ruleNames.length; ++i) {
            var ruleName = ruleNames[i];
            var rule = new fastmap.uikit.check.rule[ruleName]();
            checkEngine.addRule(rule);
        }
    },

    /**
     * 获取检查引擎对象
     * @method getCheckEngine
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {object} 检查引擎对象
     */
    getCheckEngine: function (geoLiveType, situation) {
        var featureEngines = this.checkEngines[geoLiveType];
        if (!featureEngines) {
            return null;
        }
        return featureEngines[situation];
    },

    /**
     * 销毁实例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy: function () {
        fastmap.uikit.check.CheckController.instance = null;
    },

    statics: {
        instance: null,

        /**
         * 获取实例对象
         * @method getInstance
         * @author XuJie
         * @date   2017-09-11
         * @return {object} 实例对象
         */
        getInstance: function () {
            if (!fastmap.uikit.check.CheckController.instance) {
                fastmap.uikit.check.CheckController.instance =
                    new fastmap.uikit.check.CheckController();
            }
            return fastmap.uikit.check.CheckController.instance;
        }
    }
});
