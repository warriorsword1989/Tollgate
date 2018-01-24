/**
 * 检查引擎，每个要素的 geoLiveType 和 situation 唯一标识一个引擎对象
 * @class fastmap.uikit.check.CheckEngine
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.check.CheckEngine = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} geoLiveType 要素类型
     * @param  {string} situation 触发检查规则的情形
     * @return {undefined}
     */
    initialize: function (geoLiveType, situation) {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.situation = situation;
        this.checkRules = [];
        this.lastErrors = [];
    },

    /**
     * 检查editResult是否符合所有规则
     * @method check
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} editResult 待检查的编辑结果
     * @return {boolean} 通过所有检查返回true,否则返回false
     */
    check: function (editResult) {
        this.lastErrors = [];

        for (var i = 0; i < this.checkRules.length; ++i) {
            var rule = this.checkRules[i];
            this.checkRule(rule, editResult, this.geoLiveType);
        }

        return this.lastErrors.length === 0;
    },

    /**
     * 检查editResult是否符合规则
     * @method checkRule
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} rule 检查规则
     * @param  {object} editResult 待检查的编辑结果
     * @param  {object} geoLiveType 要素类型
     * @return {undefined}
     */
    checkRule: function (rule, editResult, geoLiveType) {
        try {
            var result = rule.check(editResult, geoLiveType);
            if (result) {
                this.lastErrors = this.lastErrors.concat(result);
            }
        } catch (err) {
            result = new fastmap.uikit.check.CheckResult();
            result.situation = this.situation;
            result.geoLiveType = this.geoLiveType;
            result.message = err.message;
            this.lastErrors.push(result);
        }
    },

    /**
     * 向检查引擎中添加检查规则
     * @method addRule
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} checkRule 检查规则对象
     * @return {undefined}
     */
    addRule: function (checkRule) {
        this.checkRules.push(checkRule);
    }
});
