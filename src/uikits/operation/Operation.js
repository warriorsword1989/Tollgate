/**
 * 操作基类,所有操作从此类派生
 * @class fastmap.uikit.operation.Operation
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.operation.Operation = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} description 操作描述字符串
     * @param  {object} redoCallback 回调函数
     * @param  {object} undoCallback 回调函数
     * @return {undefined}
     */
    initialize: function (description, redoCallback, undoCallback) {
        this.description = description;
        this.redoCallback = redoCallback;
        this.undoCallback = undoCallback;
        this.lastErrors = [];
    },

    /**
     * 操作方法，子类需要重写此方法
     * @method do
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    do: function () {
        throw new Error('未重写do方法');
    },

    /**
     * 撤销上一次操作的方法，子类需要重写此方法
     * @method undo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    undo: function () {
        throw new Error('未重写undo方法');
    }
});
