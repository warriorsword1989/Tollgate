/**
 * 单例，只读 要素工具配置
 * @method FM.uikit.Config
 * @author LiuZhe
 * @date   2017-09-11
 * @return {object} 单例对象
 */
FM.uikit.Config = {
    /**
     * 判断 type 是否是 tip类型
     * @method isTip
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {boolean} tip类型返回true,否则false
     */
    isTip: function (type) {
        return type.substr(0, 3) === 'TIP';
    },

    /**
     * 根据要素类型获取要素名称
     * @method getName
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {string} name
     */
    getName: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getName(type);
        }
        return new FM.uikit.Config.Feature().getName(type);
    },

    /**
     * 根据要素类型获取要素的数据模型构造函数
     * @method getDataModel
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 数据模型构造函数
     */
    getDataModel: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDataModel(type);
        }
        return new FM.uikit.Config.Feature().getDataModel(type);
    },

    /**
     * 根据要素类型获取要素的属性编辑片段
     * @method getAddTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 编辑片段对象
     */
    getAddTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getAddTemplate(type);
        }
        return new FM.uikit.Config.Feature().getAddTemplate(type);
    },

    /**
     * 根据要素类型获取要素的属性编辑片段
     * @method getEditTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 编辑片段对象
     */
    getEditTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getEditTemplate(type);
        }
        return new FM.uikit.Config.Feature().getEditTemplate(type);
    },

    /**
     * 根据要素类型获取要素的属性编辑片段
     * @method getTipEditTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 编辑片段对象
     */
    getTipEditTemplate: function (type) {
        return new FM.uikit.Config.InfoTip().getEditTemplate(type);
    },

    /**
     * 根据要素类型获取要素的属性编辑片段
     * @method getFCTipEditTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 编辑片段对象
     */
    getFCTipEditTemplate: function (type) {
        return new FM.uikit.Config.PretreatmentTip().getEditTemplate(type);
    },

    /**
     * 根据要素类型获取要素的属性编辑片段
     * @method getViewTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 编辑片段对象
     */
    getViewTemplate: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getViewTemplate(type);
        }
        return new FM.uikit.Config.Feature().getViewTemplate(type);
    },

    /**
     * 获取传入对象类型依赖的对象类型
     * @method getDepends
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 要素依赖的其它要素
     */
    getDepends: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDepends(type);
        }
        return new FM.uikit.Config.Feature().getDepends(type);
    },

    /**
     * 根据要素类型获取要素依赖的其它要素
     * @method getDependOn
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 要素依赖的其它要素
     */
    getDependOn: function (type) {
        if (this.isTip(type)) {
            return new FM.uikit.Config.Tip().getDependOn(type);
        }
        return new FM.uikit.Config.Feature().getDependOn(type);
    },

    /**
     * 获取传入tips对象类型
     * @method getInfoTipDependOn
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 要素依赖的其它要素
     */
    getInfoTipDependOn: function (type) {
        return new FM.uikit.Config.InfoTip().getDependOn(type);
    },

    /**
     * 获取对象类型用到的几何编辑工具列表
     * @method getObjectEditTools
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 操作工具列表
     */
    getObjectEditTools: function (type) {
        if (this.isTip(type)) {
            return null;
        }
        return new FM.uikit.Config.Feature().getEditTools(type);
    },

    /**
     * 获取tips用到的几何编辑工具列表
     * @method getTipsEditTools
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 操作工具列表
     */
    getTipsEditTools: function (type) {
        return new FM.uikit.Config.InfoTip().getEditTools(type);
    },

    /**
     * 获取Fc预处理工具
     * @method getFCEditTools
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {array} 操作工具列表
     */
    getFCEditTools: function (type) {
        return new FM.uikit.Config.PretreatmentTip().getEditTools(type);
    },

    /**
     * 获取几何编辑工具配置信息
     * @method getEditTool
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} tool 工具类型
     * @return {array} 操作工具列表
     */
    getEditTool: function (tool) {
        return new FM.uikit.Config.EditTool().getEditTool(tool);
    },

    /**
     * 根据要素类型获取TipCode
     * @method getTipCode
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {string} TipCode
     */
    getTipCode: function (type) {
        var conf = FM.uikit.Config.Tip().getConfig();
        if (conf) {
            return conf.code;
        }
        return null;
    },

    /**
     * 根据要素类型获取在FM.uikit.Config.Utility中的配置
     * @method getUtilityConfig
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} 配置对象
     */
    getUtilityConfig: function (type) {
        return new FM.uikit.Config.Utility().getConfig(type);
    },

    /**
     * 根据要素类型获取在FM.uikit.Config.Utility配置中的名称
     * @method getUtilityName
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {string} 名称
     */
    getUtilityName: function (type) {
        return new FM.uikit.Config.Utility().getName(type);
    },

    /**
     * 根据要素类型获取在FM.uikit.Config.Utility配置中的模板
     * @method getUtilityTemplate
     * @author LiuZhe
     * @date   2017-09-11
     * @param  {string} type 要素类型
     * @return {object} Template对象
     */
    getUtilityTemplate: function (type) {
        return new FM.uikit.Config.Utility().getTemplate(type);
    },

    /**
     * 获取在FM.uikit.Config.Utility配置中的模板
     * @method getFeatureMapping
     * @author LiuZhe
     * @date   2017-09-11
     * @return {object} 对象
     */
    getFeatureMapping: function () {
        return FM.uikit.Config.Feature().getMapping();
    },

    /**
     * 获取在FM.uikit.Config.Utility配置中的模板
     * @method getTipMapping
     * @author LiuZhe
     * @date   2017-09-11
     * @return {object} 对象
     */
    getTipMapping: function () {
        return FM.uikit.Config.Tip().getMapping();
    }
};
