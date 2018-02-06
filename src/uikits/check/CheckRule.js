/**
 * 检查规则基类,所有检查规则都从此类派生
 * @class fastmap.uikit.check.CheckRule
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.check.CheckRule = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    initialize: function () {
        this.Id = '';
        this.description = '';
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
    },

    /**
     * 子类需要重写此方法
     * @method check
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} editResult 待检查的编辑结果
     * @return {array} 检查结果
     */
    check: function (editResult) {
        return [];
    },

    /**
     * 获取检查结果
     * @method getCheckResult
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 错误描述
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {array} 检查结果
     */
    getCheckResult: function (description, geoLiveType, situation) {
        if (!situation) {
            situation = 'runtime';
        }
        var result = new fastmap.uikit.check.CheckResult();
        result.message = description;
        result.geoLiveType = geoLiveType;
        result.situation = situation;
        return result;
    }
});
