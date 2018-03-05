/**
 * Created by zhaohang on 2017/10/16.
 */

fastmap.uikit.complexEdit.CopyTool = fastmap.uikit.complexEdit.RectSelectTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.RectSelectTool.prototype.initialize.call(this);
        this.appUtil = require('../../../../Application');
        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'CopyTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.RectSelectTool.prototype.startup.apply(this, arguments);

        this.selectFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.selectFeedback);
        this.selectTypes = this.editResult.types;
        this.selectedFeatures = [];

        this.refresh();
    },

    refresh: function () {
        this.resetSelectFeedback();
        this.resetEditResultFeedback();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (this.editResult.links.length === 0) {
            this.setMouseInfo('请在地图上框选收费站');
        } else {
            this.setMouseInfo('按ctrl键继续框选，或者按空格结束框选');
        }
    },

    resetEditResultFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult && this.editResult.links) {
            var length = this.editResult.links.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var feature = this.editResult.links[i];
                    var linkSymbol = this.symbolFactory.getSymbol('pt_relation_border');
                    this.defaultFeedback.add(feature.geometry, linkSymbol);
                }
            }
        }

        this.refreshFeedback();
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.complexEdit.RectSelectTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyLinks();
        } else {
            this.replaceLinks();
        }

        return true;
    },

    modifyLinks: function () {
        const newEditResult = FM.Util.clone(this.editResult);
        const addItems = FM.Util.differenceBy(this.selectedFeatures, newEditResult.links, 'properties.id');
        const remainItems = FM.Util.differenceBy(newEditResult.links, this.selectedFeatures, 'properties.id');
        const links = [];
        const selectLinks = remainItems.concat(addItems);
        for (let i = 0; i < selectLinks.length; i++) {
            if (this.appUtil.appUtil.getGolbalData().workType === 'static') {
                if (this.selectedFeatures[i].properties.static === null || this.selectedFeatures[i].properties.static === 2) {
                    links.push(selectLinks[i]);
                }
            } else {
                if (this.selectedFeatures[i].properties.dynamic === null || this.selectedFeatures[i].properties.dynamic === 2) {
                    links.push(selectLinks[i]);
                }
            }
        }
        newEditResult.links = links;
        this.createOperation('框选增加link', newEditResult);
    },

    replaceLinks: function () {
        const newEditResult = FM.Util.clone(this.editResult);
        const links = [];
        for (let i = 0; i < this.selectedFeatures.length; i++) {
            if (this.appUtil.appUtil.getGolbalData().workType === 'static') {
                if (this.selectedFeatures[i].properties.static === null || this.selectedFeatures[i].properties.static === 2) {
                    links.push(this.selectedFeatures[i]);
                }
            } else {
                if (this.selectedFeatures[i].properties.dynamic === null || this.selectedFeatures[i].properties.dynamic === 2) {
                    links.push(this.selectedFeatures[i]);
                }
            }
        }
        newEditResult.links = links;
        this.createOperation('框选link', newEditResult);
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    }
});
