/**
 * Created by wangmingong on 2016/8/22.
 * Class LogMsgController
 */
fastmap.uikit.LogMsgController = (function () {
    var instantiated;
    var batchRules = [{
        suitName: '批处理赋速度限制',
        rules: {
            BATCH_SLE: '速度限制值批处理',
            BUA_SPEEDLIMIT_BATCH: 'BUA限速跳跃',
            BATCH_SPEED_CLASS: '速度限制等级批处理',
            P_ASSIGN_WAY_1: '速度限制来源赋值',
            P_ASSIGN_WAY_2: '速度限制等级值标识',
            P_ASSIGN_WAY_3: '制作所有的等级值'
        }
    }, {
        suitName: '批处理POI建关联',
        rules: {
            BATCH_POI_GUIDELINK: '批处理POI建关联'
        }
    }];
    var rulesArr = ['BATCH_SLE', 'BUA_SPEEDLIMIT_BATCH', 'BATCH_SPEED_CLASS', 'P_ASSIGN_WAY=>1', 'P_ASSIGN_WAY=>2', 'P_ASSIGN_WAY=>3'];
  /**
   * @return {Object} _msg
   */
    function init() {
        var Controller = L.Class.extend({
            options: {},
            initialize: function () {
                this.messages = [];
                this.updateOutPuts = '';
                var messageArr = this.messages;
                this.msgObj = function (data) {
                    var _msg = {};
                    var tempContent = data.msgContent || '没有描述';
                    _msg.content = { contentValue: '', type: '', resNum: 0, usedTime: '', ruleMsg: '' };
                    var pattern = new RegExp('#({.+})#', 'g');
                    var matchRes = pattern.exec(tempContent);
                    if (matchRes) {
                        _msg.content.contentValue = tempContent.substring(0, matchRes.index);
                        _msg.content.type = JSON.parse(matchRes[1]).type;
                        _msg.content.resNum = JSON.parse(matchRes[1]).resNum;
                        _msg.content.usedTime = JSON.parse(matchRes[1]).usedTime;
                        var suitName = '';
                        var ruleMsgArr = [];
                        if (_msg.content.type == '批处理') {
                            for (var j = 0; j < JSON.parse(matchRes[1]).rules.length; j++) {
                                if (rulesArr.indexOf(JSON.parse(matchRes[1]).rules[j]) > -1) {
                                    suitName = batchRules[0].suitName;
                                    if (JSON.parse(matchRes[1]).rules[j].indexOf('=>') > -1) {
                                        ruleMsgArr.push(batchRules[0].rules[JSON.parse(matchRes[1]).rules[j].split('=>').join('_')]);
                                    } else {
                                        ruleMsgArr.push(batchRules[0].rules[JSON.parse(matchRes[1]).rules[j]]);
                                    }
                                } else {
                                    suitName = batchRules[1].suitName;
                                    ruleMsgArr.push(batchRules[1].rules[JSON.parse(matchRes[1]).rules[j]]);
                                }
                            }
                            _msg.content.ruleMsg = suitName + ':' + ruleMsgArr.join(',');
                        } else if (_msg.content.type === 'Robot自动录入') {
                            _msg.content.sucTips = JSON.parse(matchRes[1]).success;
                            _msg.content.failTips = JSON.parse(matchRes[1]).fail;
                            if (_msg.content.sucTips.length) {
                                for (j = 0; j < _msg.content.sucTips.length; j++) {
                                    var sucTip = _msg.content.sucTips[j];
                                    if (sucTip) {
                                        sucTip.describe =
                                            FM.uikit.Config.Tip().getNameByCode(sucTip.code) + sucTip.count + '个';
                                    }
                                }
                            }
                            if (_msg.content.failTips.length) {
                                for (j = 0; j < _msg.content.failTips.length; j++) {
                                    var failTip = _msg.content.failTips[j];
                                    if (failTip) {
                                        failTip.describe =
                                            FM.uikit.Config.Tip().getNameByCode(failTip.code) + failTip.count + '个';
                                    }
                                }
                            }
                        }
                    } else {
                        _msg.content.contentValue = tempContent;
                    }
                    _msg.msgId = data.msgId || Date.parse(new Date());
                    _msg.type = data.msgType || 1;
                    if (data.createTime) {
                        _msg.createTime = Utils.dateFormat(data.createTime + '');
                    } else {
                        var date = new Date();
                        var seperator1 = '-';
                        var seperator2 = ':';
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        if (month >= 1 && month <= 9) {
                            month = '0' + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = '0' + strDate;
                        }
                        _msg.createTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
                            + ' ' + date.getHours() + seperator2 + date.getMinutes()
                            + seperator2 + date.getSeconds();
                    }
                    _msg.pushUserName = data.pushUserName || '匿名';
                    _msg.title = data.msgTitle || '未命名';
                    _msg.time = data.time || 5000;
                    _msg.status = 1;
                    if (data.msgParam) {
                        var temp = JSON.parse(data.msgParam);
                        _msg.flagId = temp.relateObjectId;
                    }
                    _msg.remove = function (msg) {
                        for (var i = 0; i < messageArr.length; i++) {
                            if (messageArr[i].msgId == msg.msgId) {
                                messageArr.splice(i, 1);
                            }
                        }
                    };
                    return _msg;
                };
            },
            /** *
             * 添加massage
             * @param {Object} msg message
             * @return {undefined}
             */
            pushMsg: function (msg) {
                if (typeof msg === 'object') {
                    this.messages.unshift(this.msgObj(msg));
                } else if (typeof msg === 'string') {
                    this.messages.unshift(this.msgObj({ value: msg }));
                }
            },
            /** *
             * 清空
             * @return {undefined}
             */
            clear: function () {
                this.messages = [];
            }
        });
        return new Controller();
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init();
        }
        return instantiated;
    };
}());
