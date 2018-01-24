/**
 * 编辑结果操作
 * @class fastmap.uikit.operation.EditResultOperation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.operation.EditResultOperation = fastmap.uikit.operation.Operation.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 操作描述字符串
     * @param  {object} redoCallback 回调函数
     * @param  {object} undoCallback 回调函数
     * @param  {object} oldEditResult 操作前的编辑结果
     * @param  {object} newEditResult 操作后的编辑结果
     * @return {undefined}
     */
    initialize: function (description, redoCallback, undoCallback, oldEditResult, newEditResult) {
        fastmap.uikit.operation.Operation.prototype.initialize.call(this, description, redoCallback, undoCallback);

        this.relationEditor = fastmap.uikit.relationEdit.RelationEditor.getInstance();
        this.checkController = fastmap.uikit.check.CheckController.getInstance();

        this.oldEditResult = oldEditResult;
        this.newEditResult = newEditResult;
    },

    /**
     * 判断本次操作是否可以通过检查
     * @method canDo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以操作返回true，否侧false
     */
    canDo: function () {
        var engine = this.checkController.getCheckEngine(this.newEditResult.geoLiveType, 'runtime');
        if (engine && !engine.check(this.newEditResult)) {
            this.lastErrors = engine.lastErrors;
            return false;
        }

        return true;
    },

    /**
     * 获取错误信息
     * @method getError
     * @author XuJie
     * @date   2017-09-11
     * @return {string} 错误信息
     */
    getError: function () {
        var errMsg = '';
        var length = this.lastErrors.length;
        for (var i = 0; i < length; ++i) {
            var err = this.lastErrors[i];
            errMsg += err.message;
            if (i !== length - 1) {
                errMsg += '\n';
            }
        }
        return errMsg;
    },

    /**
     * 操作方法
     * @method do
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    do: function () {
        this.redoCallback(this.oldEditResult, this.newEditResult);
    },

    /**
     * 撤销上一次操作的方法
     * @method undo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    undo: function () {
        this.undoCallback(this.oldEditResult, this.newEditResult);
    }
});
