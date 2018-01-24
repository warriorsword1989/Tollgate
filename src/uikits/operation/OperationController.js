/**
 * 操作模块的控制器
 * @class fastmap.uikit.operation.OperationController
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.operation.OperationController = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    initialize: function () {
        this.step = 100;
        this.undoStack = [];
        this.redoStack = [];
    },

    /**
     * 向 undoStack 中添加本次操作结果
     * @method add
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} operation 操作结果
     * @return {undefined}
     */
    add: function (operation) {
        if (this.undoStack.length >= this.step) {
            this.undoStack.shift();
        }
        operation.do();
        this.redoStack = [];
        this.undoStack.push(operation);
    },

    /**
     * 从 undoStack 取出上一次的操作结果，向 redoStack 中添加本次操作结果
     * @method undo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    undo: function () {
        if (!this.canUndo()) {
            return;
        }

        var operation = this.undoStack.pop();
        operation.undo();

        this.redoStack.push(operation);
    },

    /**
     * 从 redoStack 取出上一次的操作结果，向 undoStack 中添加本次操作结果
     * @method redo
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    redo: function () {
        if (!this.canRedo()) {
            return;
        }

        var operation = this.redoStack.pop();
        operation.do();

        this.undoStack.push(operation);
    },

    /**
     * 判断是否可以进行 undo 操作
     * @method canUndo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以进行 undo 操作返回true，否侧false
     */
    canUndo: function () {
        return this.undoStack.length !== 0;
    },

    /**
     * 判断是否可以进行 redo 操作
     * @method canRedo
     * @author XuJie
     * @date   2017-09-11
     * @return {boolean} 可以进行 redo 操作返回true，否侧false
     */
    canRedo: function () {
        return this.redoStack.length !== 0;
    },

    /**
     * 清空 undoStack,redoStack
     * @method clear
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    clear: function () {
        this.undoStack = [];
        this.redoStack = [];
    },

    /**
     * 销毁实例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy: function () {
        fastmap.uikit.operation.OperationController.instance = null;
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
            if (!fastmap.uikit.operation.OperationController.instance) {
                fastmap.uikit.operation.OperationController.instance =
                    new fastmap.uikit.operation.OperationController();
            }
            return fastmap.uikit.operation.OperationController.instance;
        }
    }
});
