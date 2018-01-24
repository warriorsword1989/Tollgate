/**
 * 获取对象编辑控制器的函数
 * @method fastmap.uikit.ObjectEditController
 * @author WangTun
 * @date   2017-09-11
 * @return {object} ObjectEditController单例对象
 */
fastmap.uikit.ObjectEditController = (function () {
    var instantiated;
    /**
     * 初始化方法
     * @method init
     * @author WangTun
     * @date   2017-09-11
     * @param  {object} options 可选对象
     * @return {object} ObjectEditController
     */
    function init(options) {
        var Controller = L.Class.extend({
            /**
             * 相关属性
             */
            options: {},
            /**
             * 构造函数
             * @method initialize
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} option 可选对象
             * @return {object} ObjectEditController
             */
            initialize: function (option) {
                L.setOptions(this, option);
                this.eventController = fastmap.uikit.EventController();
                this.data = null;
                this.originalData = null;
                /** *
                 * 为了进行批量编辑而添加的属性字段，保存批量编辑返回的原始数据
                 * @type {Array}
                 */
                this.datas = [];
            },
            /**
             * 保存需要编辑的元素的原数据
             * @method save
             * @author WangTun
             * @date   2017-09-11
             * @return {undefined}
             */
            save: function () {
                this.onSaved(this.originalData, this.data);
            },

            /**
             * 获得编辑的字段及其内容
             * @method getChanged
             * @author WangTun
             * @date   2017-09-11
             * @return {undefined}
             */
            getChanged: function () {},

            /**
             * 保存当前元素
             * @method setCurrentObject
             * @author WangTun
             * @date   2017-09-11
             * @param  {string} type 类型
             * @param  {object} obj 编辑对象
             * @return {undefined}
             */
            setCurrentObject: function (type, obj) {
                var oldGeoLiveType;
                if (this.data) {
                    oldGeoLiveType = this.data.geoLiveType;
                }
                this.data = FM.dataApi.Feature.create(obj);

                if (oldGeoLiveType !== this.data.geoLiveType) {
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, {
                        originalData: this.originalData,
                        currentData: this.data
                    });
                }

                this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE, {
                    originalData: this.originalData,
                    currentData: this.data
                });
            },

            /**
             * 记录原始数据
             * @method setOriginalData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} obj 编辑对象
             * @return {undefined}
             */
            setOriginalData: function (obj) {
                this.originalData = obj;
            },

            /**
             * 删除地图上元素
             * @method onRemove
             * @author WangTun
             * @date   2017-09-11
             * @return {undefined}
             */
            onRemove: function () {},
            
            /**
             * 获取变化的属性值
             * @method compareJson
             * @author WangTun
             * @date   2017-09-11
             * @param  {string} pid 唯一标识
             * @param  {object} oriData 原始数据
             * @param  {object} data 编辑后的数据
             * @param  {string} type 类型
             * @return {object} 比较结果对象
             */
            compareJson: function (pid, oriData, data, type) {
                var retObj = {};
                var n = 0;
                var arrFlag = this.isContainArr(oriData);
                var pids = pid;
                var objArr,
                    obj;
                var i,
                    j,
                    k,
                    len;
                for (var item in oriData) {
                    if (typeof oriData[item] === 'string') {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData.rowId) {
                                retObj.rowId = oriData.rowId;
                            }
                            if (oriData.pid) {
                                retObj.pid = oriData.pid;
                            }
                            // if (oriData["pid"]) {
                            //     retObj["pid"] = oriData["pid"];
                            // } else if (oriData["rowId"]) {
                            //     retObj["rowId"] = oriData["rowId"];
                            // }
                            retObj.objStatus = type;
                        }
                    } else if (data[item] && oriData[item] && oriData[item].constructor == Array && data[item].constructor == Array) {
                        if (oriData[item].length === data[item].length) {
                            objArr = [];
                            for (i = 0, len = oriData[item].length; i < len; i++) {
                                obj = null;
                                if (data[item][i].hasOwnProperty('_flag_')) { // 深度信息特殊处理
                                    if (data[item][i]._flag_ != 'ignore') {
                                        if (oriData[item][i]._flag_) {
                                            obj = data[item][i];
                                            delete obj._flag_;
                                            obj.objStatus = 'INSERT';
                                        } else {
                                            obj = this.compareJson(pids, oriData[item][i], data[item][i], 'UPDATE');
                                        }
                                    }
                                } else {
                                    obj = this.compareJson(pids, oriData[item][i], data[item][i], 'UPDATE');
                                }
                                if (obj) {
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                // if (oriData["linkPid"]) {
                                // obj["linkPid"] = oriData["pid"];
                                // }
                                retObj[item] = objArr;
                            }
                        } else if (oriData[item].length < data[item].length) {
                            objArr = [];
                            // 大于原长度的直接增加，从索引0开始，数组是从第一位开始追加的
                            for (var m = 0; m < data[item].length - oriData[item].length; m++) {
                                obj = {};
                                if (oriData[item].length == 0) {
                                    for (var s in data[item][m]) {
                                        if (s != '$$hashKey') {
                                            if (s == 'linkPid' && item != 'vias') { // add by chenx on 2016-10-23，为了避免新增的拓扑的经过线的linkPid赋值错误
                                                obj[s] = data.pid;
                                            } else {
                                                obj[s] = data[item][m][s];
                                            }
                                        }
                                    }
                                    // 由于保存的时候接口需要传递的参数rowId和pid需要保持默认值,注销到如下7行代码
                                    // if (!obj["linkPid"]) {
                                    //     if (data["rowId"]) {
                                    //         obj["rowId"] = data["rowId"];
                                    //     } else if (data["pid"]) {
                                    //         obj["pid"] = data["pid"];
                                    //     }
                                    // }
                                    delete obj.geoLiveType;
                                    obj.objStatus = 'INSERT';
                                    objArr.push(obj);
                                } else {
                                    // var obj = this.compareJson(oriData[item][m], data[item][m], "INSERT");
                                    obj = data[item][m];
                                    obj.objStatus = 'INSERT';
                                    delete obj.$$hashKey;
                                    // obj["pid"]=pids;
                                    if (obj) {
                                        // if (oriData[item][0]["linkPid"]) {
                                        // obj["linkPid"] = oriData[item][0]["linkPid"];
                                        // }
                                        objArr.push(obj);
                                    }
                                    delete obj.geoLiveType;
                                }
                            }
                            var differLen = data[item].length - oriData[item].length;
                            for (j = oriData[item].length - 1; j >= 0; j--) {
                                if (oriData[item][j].hasOwnProperty('_flag_') && oriData[item][j]._flag_) {
                                    obj = data[item][differLen + j];
                                    obj.objStatus = 'INSERT';
                                } else {
                                    obj = this.compareJson(pids, oriData[item][j], data[item][differLen + j], 'UPDATE');
                                }
                                if (obj) {
                                    // if (oriData[item][j]["linkPid"]) {
                                    // obj["linkPid"] = oriData[item][j]["linkPid"];
                                    // }
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        } else {
                            objArr = [];
                            var indexOfData = {};
                            var key = 'linkPid';
                            for (j = 0, len = data[item].length; j < len; j++) {
                                obj = {};
                                if (oriData[item][j].rowId) {
                                    key = 'rowId';
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[oriData[item][j].rowId] = obj;
                                } else if (oriData[item][j].pid) {
                                    key = 'pid';
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[oriData[item][j].pid] = obj;
                                } else if (oriData[item][j].linkPid) {
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[oriData[item][j].linkPid] = obj;
                                }
                            }
                            for (k = 0, len = oriData[item].length; k < len; k++) {
                                if (indexOfData[oriData[item][k][key]]) {
                                    obj = this.compareJson(pids, oriData[item][k], data[item][indexOfData[oriData[item][k][key]].index], 'UPDATE');
                                    if (obj) {
                                        objArr.push(obj);
                                    }
                                } else {
                                    obj = oriData[item][k];
                                    obj.objStatus = 'DELETE';
                                    delete obj.geoLiveType;
                                    delete obj.$$hashKey;
                                    if (!obj.pid) {
                                        obj.pid = pids;
                                    }
                                    if (obj.vias) {
                                        obj.vias = undefined;
                                    }
                                    objArr.push(obj);
                                }
                            }
                            // for(var n = 0 ,l = data[item].length ; n < l; n ++){//删除后新增的情况
                            //     var flag = true;
                            //     for(var m = 0 ,len = oriData[item].length ; m < len; m ++){
                            //         if(data[item][n][key] == oriData[item][m][key]){
                            //             flag = false;
                            //             break;
                            //         }
                            //     }
                            //     if(flag){
                            //         obj = data[item][n];
                            //         obj["objStatus"] = "INSERT";
                            //         delete obj["geoLiveType"];
                            //         objArr.push(obj);
                            //     }
                            // }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        }
                    } else if (!isNaN(oriData[item])) {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData.rowId) {
                                retObj.rowId = oriData.rowId;
                            }
                            if (oriData.pid) {
                                retObj.pid = oriData.pid;
                            }
                            // if (oriData["pid"]) {
                            //     retObj["pid"] = oriData["pid"];
                            // } else if (oriData["rowId"]) {
                            //     retObj["rowId"] = oriData["rowId"];
                            // }
                            retObj.objStatus = type;
                        }
                    } else if (oriData[item] !== data[item]) {
                        retObj[item] = data[item];
                        if (oriData.rowId) {
                            retObj.rowId = oriData.rowId;
                        }
                        if (oriData.pid) {
                            retObj.pid = oriData.pid;
                        }
                        // if (oriData["pid"]) {
                        //     retObj["pid"] = oriData["pid"];
                        // } else if (oriData["rowId"]) {
                        //     retObj["rowId"] = oriData["rowId"];
                        // }
                        retObj.objStatus = type;
                    }
                }
                if (!this.isEmptyObject(retObj)) {
                    if (arrFlag) {
                        if (oriData.rowId) {
                            retObj.rowId = oriData.rowId;
                        }
                        if (oriData.pid) {
                            retObj.pid = oriData.pid;
                        }
                        // if (oriData["pid"]) {
                        //     retObj["pid"] = oriData["pid"];
                        // } else if (oriData["rowId"]) {
                        //     retObj["rowId"] = oriData["rowId"];
                        // }
                        arrFlag = false;
                    }
                } else {
                    retObj = null;
                }
                return retObj;
            },

            /**
             * 获取变化的属性值
             * @method compareColumData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} oriData 原始数据
             * @param  {object} currentData 编辑后的数据
             * @return {object} 比较结果对象
             */
            compareColumData: function (oriData, currentData) {
                /**
                 * 将前端数据模型还原为接口数据模型
                 * @method getIntegrateData
                 * @author WangTun
                 * @date   2017-09-11
                 * @param  {object} arrData 原始数据
                 * @return {array} 对象数组
                 */
                function getIntegrateData(arrData) {
                    var returnArr = [];
                    for (var i = 0, len = arrData.length; i < len; i++) {
                        returnArr.push(arrData[i].getIntegrate());
                    }
                    return returnArr;
                }
                oriData = getIntegrateData(oriData);
                currentData = getIntegrateData(currentData);
                var allChangeData = {};
                allChangeData.dataList = [];
                for (var i = 0, len = oriData.length; i < len; i++) {
                    var changeData = this.compareColJson(currentData[i], oriData[i]);
                    if (changeData) {
                        allChangeData.dataList.push(changeData);
                    } else {
                        var temp = {};
                        if (oriData[i].rowId) {
                            temp.rowId = oriData[i].rowId;
                        }
                        if (oriData[i].pid) {
                            temp.pid = oriData[i].pid;
                        }
                        temp.objStatus = 'UPDATE';
                        allChangeData.dataList.push(temp);
                    }
                }
                return allChangeData;
            },

            /**
             * 获取变化的属性值
             * @method compareColJson
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} newJson 编辑后的数据
             * @param  {object} oldJson 原始数据
             * @return {object} 比较结果对象
             */
            compareColJson: function (newJson, oldJson) {
                var changed = {};
                var newVal,
                    oldVal,
                    tempObj,
                    tempArray;
                var k,
                    i,
                    j,
                    delFlag;
                if (newJson && !oldJson) { // 新增
                    for (k in newJson) {
                        if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                            newVal = newJson[k];
                            if (typeof newVal === 'object') {
                                if (FM.Util.isObject(newVal)) {
                                    tempObj = this.compareColJson(newVal, null);
                                    if (tempObj) {
                                        changed[k] = tempObj;
                                    }
                                } else if (FM.Util.isArray(newVal)) {
                                    tempArray = [];
                                    for (i = 0; i < newVal.length; i++) {
                                        tempObj = this.compareColJson(newVal[i], null);
                                        if (tempObj) {
                                            tempArray.push(tempObj);
                                        }
                                    }
                                    if (tempArray.length > 0) {
                                        changed[k] = tempArray;
                                    }
                                }
                            } else {
                                changed[k] = newVal;
                            }
                        }
                    }
                    changed.objStatus = 'INSERT';
                } else if (!newJson && oldJson) { // 删除
                    for (k in oldJson) {
                        if (oldJson.hasOwnProperty(k) && k !== 'geometry') {
                            oldVal = oldJson[k];
                            if (typeof oldVal === 'object') {
                                if (FM.Util.isObject(oldVal)) {
                                    tempObj = this.compareColJson(null, oldVal);
                                    if (tempObj) {
                                        changed[k] = tempObj;
                                    }
                                } else if (FM.Util.isArray(oldVal)) {
                                    tempArray = [];
                                    for (i = 0; i < oldVal.length; i++) {
                                        tempObj = this.compareColJson(null, oldVal[i]);
                                        if (tempObj) {
                                            tempArray.push(tempObj);
                                        }
                                    }
                                    if (tempArray.length > 0) {
                                        changed[k] = tempArray;
                                    }
                                }
                            } else if (k === 'rowId' || k === 'pid') {
                                changed[k] = oldJson[k];
                            }
                        }
                    }
                    changed.objStatus = 'DELETE';
                } else { // 修改
                    for (k in newJson) {
                        // 不比较几何坐标
                        if (newJson.hasOwnProperty(k) && k !== 'geometry') {
                            newVal = newJson[k];
                            oldVal = oldJson[k];
                            if (typeof newVal === 'object') {
                                if (FM.Util.isObject(newVal) && FM.Util.isObject(oldVal)) {
                                    tempObj = this.compareColJson(newVal, oldVal);
                                    if (tempObj) {
                                        changed[k] = tempObj;
                                    }
                                } else if (FM.Util.isArray(newVal) && FM.Util.isArray(oldVal)) {
                                    tempArray = [];
                                    for (i = 0; i < newVal.length; i++) {
                                        tempObj = null;
                                        if (newVal[i].hasOwnProperty('rowId') && newVal[i].rowId) { // 修改
                                            for (j = 0; j < oldVal.length; j++) {
                                                if (newVal[i].rowId === oldVal[j].rowId) {
                                                    tempObj = this.compareColJson(newVal[i], oldVal[j]);
                                                    break;
                                                }
                                            }
                                        } else { // 新增
                                            tempObj = this.compareColJson(newVal[i], null);
                                        }
                                        if (tempObj) {
                                            tempArray.push(tempObj);
                                        }
                                    }
                                    for (i = 0; i < oldVal.length; i++) { // 删除
                                        delFlag = true;
                                        for (j = 0; j < newVal.length; j++) {
                                            if (newVal[j].rowId === oldVal[i].rowId) {
                                                delFlag = false;
                                                break;
                                            }
                                        }
                                        if (delFlag) {
                                            tempObj = this.compareColJson(null, oldVal[i]);
                                            if (tempObj) {
                                                tempArray.push(tempObj);
                                            }
                                        }
                                    }
                                    if (tempArray.length > 0) {
                                        changed[k] = tempArray;
                                    }
                                }
                            } else if (newVal !== oldVal) {
                                changed[k] = newVal;
                            }
                        }
                    }
                    if (!FM.Util.isEmptyObject(changed)) {
                        if (newJson.hasOwnProperty('rowId')) {
                            changed.rowId = newJson.rowId;
                        }
                        if (newJson.hasOwnProperty('pid') && !changed.hasOwnProperty('pid')) {
                            changed.pid = newJson.pid;
                        }
                        changed.objStatus = 'UPDATE';
                    }
                }
                if (FM.Util.isEmptyObject(changed)) { // 如果没有任何变化，则返回null
                    return null;
                }
                return changed;
            },

            /**
             * 判断对象的属性值中是否存在数组
             * @method isContainArr
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} obj 对象
             * @return {boolean} 包含返回true，否则false
             */
            isContainArr: function (obj) {
                var flag = false;
                for (var item in obj) {
                    if (obj[item] && obj[item].constructor == Array) {
                        flag = true;
                    }
                }
                return flag;
            },

            /**
             * 判断对象是不是为空
             * @method isEmptyObject
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} obj 对象
             * @return {boolean} 空对象返回true，否则false
             */
            isEmptyObject: function (obj) {
                for (var n in obj) {
                    if (obj.hasOwnProperty(n)) {
                        return false;
                    }
                }
                return true;
            },

            /**
             * 保存元素的方法
             * @method onSaved
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} orignalData 原始数据
             * @param  {object} data 编辑后的数据
             * @return {undefined}
             */
            onSaved: function (orignalData, data) {
                this.changedProperty = this.compareJson(orignalData.pid, orignalData, data.getIntegrate(), 'UPDATE');
                // 利用this.datas判断是否是批量编辑
                if (this.datas.length !== 0) {
                    this.changedProperty = this.restoreDatas(this.changedProperty);
                }
            },

            /**
             * 利用编辑后的数据更新原始数据集
             * @method restoreDatas
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} changedata 发生变化的数据
             * @return {array} 发生变化的数据
             */
            restoreDatas: function (changedata) {
                var changedArr = [];
                var directConfig = this.ConfirmDirect(this.datas);
                for (var i = 0, len = this.datas.length; i < len; i++) {
                    var changeObj = {};

                    // 批量编辑关联维护的改变内容
                    var batchChange = this.getBatchChange(changedata, this.datas[i]);

                    for (var key in changedata) {
                        if (FM.Util.isArray(changedata[key])) {
                            if (!changeObj[key] || changeObj[key].length == 0) {
                                changeObj[key] = [];
                            }
                            for (var j = 0, length = changedata[key].length; j < length; j++) {
                                var correspondingArr = changedata[key][j].options ? changedata[key][j].options.correspondingArr : null;
                                if (correspondingArr && correspondingArr.length > 0) {
                                    for (var k = 0, namelen = this.datas[i][key].length; k < namelen; k++) {
                                        for (var index = 0; index < correspondingArr.length; index++) {
                                            if (correspondingArr[index] && correspondingArr[index].rowId == this.datas[i][key][k].rowId) {
                                                if (changedata[key][j].objStatus == 'UPDATE') {
                                                    // 将原数组中的值替换为改变后的值,将rowId,linkPid更新到改变的对象中  changedata[key][j]
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].linkPid = correspondingArr[index].linkPid;
                                                    if (this.datas[0].direct != this.datas[i].direct && this.datas[0].direct != 1 && this.datas[i].direct != 1) {
                                                        changeObj[key].push(this.getBatchAddtionals(this.datas[i], changedata[key][j], key));
                                                    } else {
                                                        if (directConfig[this.datas[i].pid]) {
                                                            changeObj[key].push(changedata[key][j]);
                                                        } else {
                                                            changeObj[key].push(this.exchangeSpeedLimit(FM.Util.clone(changedata[key][j])));
                                                        }
                                                    }
                                                } else if (changedata[key][j].objStatus == 'DELETE') {
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].linkPid = correspondingArr[index].linkPid;
                                                    // changedata[key][j].objStatus = 'DELETE';
                                                    changeObj[key].push({
                                                        rowId: this.datas[i][key][k].rowId,
                                                        linkPid: this.datas[i][key][k].linkPid,
                                                        objStatus: changedata[key][j].objStatus
                                                    });
                                                    // 删除同时需要计算被删除之后的nanme的seqnum，
                                                    if (key == 'names') {
                                                        changeObj.names = changeObj.names.concat(this.getUpdateNames(this.datas[i][key], k));
                                                    }
                                                } else if (changedata[key][j].objStatus == 'INSERT') {
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].linkPid = correspondingArr[index].linkPid;
                                                    changedata[key][j].objStatus = 'INSERT';

                                                    if (this.datas[i].direct != 1 && !this.confirmDirect(this.datas[0], this.datas[i])) {
                                                        changeObj[key].push(this.getBatchAddtionals(this.datas[i], changedata[key][j], key));
                                                    } else {
                                                        if (directConfig[this.datas[i].pid]) {
                                                            changeObj[key].push(changedata[key][j]);
                                                        } else {
                                                            changeObj[key].push(this.exchangeSpeedLimit(FM.Util.clone(changedata[key][j])));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else if (!correspondingArr) {
                                    if (changedata[key][j].objStatus == 'UPDATE') {
                                        changedata[key][j].linkPid = this.datas[i].pid;
                                        if (i != 0 && !this.confirmDirect(this.datas[0], this.datas[i])) {
                                            changeObj[key].push(this.getBatchAddtionals(this.datas[i], changedata[key][j], key));
                                        } else {
                                            changeObj[key].push(this.datas[i]);
                                        }
                                    } else if (changedata[key][j].objStatus == 'INSERT') {
                                        if (key == 'names') {
                                            this.updateNamesSeqNum(this.datas[i][key]);
                                            changedata[key][j].seqNum = this.datas[i][key].length + 1 + j;
                                        }
                                        changedata[key][j].linkPid = this.datas[i].pid;
                                        if (directConfig[this.datas[i].pid]) {
                                            changeObj[key].push(changedata[key][j]);
                                        } else {
                                            changeObj[key].push(this.exchangeSpeedLimit(FM.Util.clone(changedata[key][j])));
                                        }
                                    } else if (changedata[key][j].objStatus == 'DELETE') {
                                        for (var obj in this.datas[i][key]) {
                                            if (this.datas[i][key][obj].rowId == changedata[key][j].rowId) {
                                                this.datas[i][key].splice(obj, 1);
                                            }
                                        }
                                        if (key == 'names') {
                                            this.updateNamesSeqNum(this.datas[i][key]);
                                        }
                                    }
                                }
                            }
                        } else if (key == 'direct') {
                            if (changedata[key] == 2) {
                                if (directConfig[this.datas[i].pid]) {
                                    changeObj[key] = 2;
                                } else {
                                    changeObj[key] = 3;
                                }
                            } else if (changedata[key] == 3) {
                                if (directConfig[this.datas[i].pid]) {
                                    changeObj[key] = 3;
                                } else {
                                    changeObj[key] = 2;
                                }
                            } else {
                                changeObj[key] = changedata[key];
                            }
                        } else {
                            changeObj[key] = changedata[key];
                        }
                    }

                    changeObj.pid = this.datas[i].pid;
                    changeObj.rowId = this.datas[i].rowId;
                    batchChange.pid = this.datas[i].pid;
                    batchChange.rowId = this.datas[i].rowId;
                    changeObj = FM.Util.merge(changeObj, batchChange);
                    // 处理“无属性情况”
                    if (changeObj.forms) {
                        var deleteForm = this.deleteFormOfWay(this.datas[i]);
                        if (deleteForm) {
                            changeObj.forms.push({
                                rowId: deleteForm.rowId,
                                pid: deleteForm.linkPid,
                                objStatus: 'DELETE'
                            });
                        }
                    }

                    // 处理批量编辑改为无属性的情况
                    if (changeObj.forms && changeObj.forms[0].formOfWay == 1 && changeObj.forms[0].objStatus == 'INSERT') {
                        if (changeObj.forms.length == 1) {
                            changeObj.forms = changeObj.forms.concat(this.deleteOriginForm(this.datas[i]));
                        } else {
                            this.deleteNone(changeObj.forms);
                            // changeObj.forms = this.deleteOriginForm(this.datas[i]);
                        }
                    }
                    var cloneChange = FM.Util.clone(changeObj);

                    if (cloneChange.speedlimits) {
                        if (this.datas[i].direct == 2) {
                            if (cloneChange.speedlimits[0].toSpeedLimit) {
                                cloneChange.speedlimits[0].toSpeedLimit = 0;
                                cloneChange.speedlimits[0].toLimitSrc = 0;
                            }
                        } else if (this.datas[i].direct == 3) {
                            if (cloneChange.speedlimits[0].fromSpeedLimit) {
                                cloneChange.speedlimits[0].fromSpeedLimit = 0;
                                cloneChange.speedlimits[0].fromLimitSrc = 0;
                            }
                        }
                    }
                    changedArr.push(cloneChange);
                }
                this.getObjects(changedArr);
                return changedArr;
            },

            /**
             * 利用编辑后的数据更新原始数据集
             * @method restoreNodeDatas
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} changedata 发生变化的数据
             * @return {array} 发生变化的数据
             */
            restoreNodeDatas: function (changedata) {
                var changedArr = [];
                for (var i = 0, len = this.datas.length; i < len; i++) {
                    var changeObj = {};

                    for (var key in changedata) {
                        if (FM.Util.isArray(changedata[key])) {
                            if (!changeObj[key] || changeObj[key].length == 0) {
                                changeObj[key] = [];
                            }
                            for (var j = 0; j < changedata[key].length; j++) {
                                var correspondingArr = changedata[key][j].options ? changedata[key][j].options.correspondingArr : null;
                                if (correspondingArr && correspondingArr.length > 0) {
                                    for (var k = 0; k < this.datas[i][key].length; k++) {
                                        for (var index = 0; index < correspondingArr.length; index++) {
                                            if (correspondingArr[index] && correspondingArr[index].rowId == this.datas[i][key][k].rowId) {
                                                if (changedata[key][j].objStatus == 'UPDATE') {
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].nodePid = correspondingArr[index].nodePid;
                                                    changeObj[key].push(changedata[key][j]);
                                                } else if (changedata[key][j].objStatus == 'DELETE') {
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].nodePid = correspondingArr[index].nodePid;
                                                    changeObj[key].push({
                                                        rowId: this.datas[i][key][k].rowId,
                                                        nodePid: this.datas[i][key][k].nodePid,
                                                        objStatus: changedata[key][j].objStatus
                                                    });
                                                } else if (changedata[key][j].objStatus == 'INSERT') {
                                                    changedata[key][j].rowId = correspondingArr[index].rowId;
                                                    changedata[key][j].nodePid = correspondingArr[index].nodePid;
                                                    changedata[key][j].objStatus = 'INSERT';
                                                    changeObj[key].push(changedata[key][j]);
                                                }
                                            }
                                        }
                                    }
                                } else if (!correspondingArr) {
                                   // // 没有共同的只有增和删除的情况
                                    if (changedata[key][j].objStatus == 'UPDATE') {
                                        changedata[key][j].nodePid = this.datas[i].pid;
                                        changeObj[key].push(this.datas[i]);
                                    } else if (changedata[key][j].objStatus == 'INSERT') {
                                        changedata[key][j].nodePid = this.datas[i].pid;
                                        changeObj[key].push(changedata[key][j]);
                                    } else if (changedata[key][j].objStatus == 'DELETE') {
                                        for (var obj in this.datas[i][key]) {
                                            if (this.datas[i][key][obj].rowId == changedata[key][j].rowId) {
                                                this.datas[i][key].splice(obj, 1);
                                            }
                                        }
                                        changeObj[key].push(changedata[key][j]);
                                    }
                                }
                            }
                        } else {
                            changeObj[key] = changedata[key];
                        }
                    }

                    changeObj.pid = this.datas[i].pid;
                    changeObj.rowId = this.datas[i].rowId;
                    // 处理“无属性情况”
                    if (changeObj.forms) {
                        var deleteForm = this.deleteFormOfWay(this.datas[i]);
                        if (deleteForm) {
                            changeObj.forms.push({
                                rowId: deleteForm.rowId,
                                nodePid: deleteForm.nodePid,
                                objStatus: 'DELETE'
                            });
                        }
                    }
                    // 处理批量编辑改为无属性的情况
                    if (changeObj.forms && changeObj.forms[0].formOfWay == 1 && changeObj.forms[0].objStatus == 'INSERT') {
                        changeObj.forms = changeObj.forms.concat(this.deleteOriginForm(this.datas[i]));
                    }
                    changedArr.push(FM.Util.clone(changeObj));
                }
                this.getObjects(changedArr);
                return changedArr;
            },

            /**
             * 根据direct整理link的附加属性数据
             * @method getBatchAddtionals
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 附加属性数据
             * @param  {object} change 发生变化的数据
             * @param  {string} key 类型
             * @return {object} addtionalResult
             */
            getBatchAddtionals: function (data, change, key) {
                var addtionalResult = null;
                switch (key) {
                    case 'speedlimits':
                        addtionalResult = this.getBatchSpeedLimit(data, change);
                        break;
                    case 'limits':
                    case 'limitTrucks':
                        addtionalResult = this.getBatchLimit(data, change, 'limitDir');
                        break;
                    case 'intRtics':
                    case 'rtics':
                        addtionalResult = this.getBatchRticAndWalk(data, change, 'rticDir');
                        break;
                    case 'sidewalks':
                    case 'walkstairs':
                        addtionalResult = this.getBatchRticAndWalk(data, change, 'workDir');
                        break;
                    default:
                        addtionalResult = change;
                }

                return addtionalResult;
            },

            /**
             * 将link限速(speedlimit)按照原始数据direct进行整理
             * @method getBatchSpeedLimit
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 附加属性数据
             * @param  {object} change 发生变化的数据
             * @return {object} 发生变化的数据
             */
            getBatchSpeedLimit: function (data, change) {
                var changeObj = FM.Util.clone(change);
                if (changeObj.hasOwnProperty('fromSpeedLimit') && changeObj.hasOwnProperty('toSpeedLimit')) {
                    var tempLimit = null;
                    tempLimit = changeObj.fromSpeedLimit;
                    changeObj.fromSpeedLimit = changeObj.toSpeedLimit;
                    changeObj.toSpeedLimit = tempLimit;
                }

                if (changeObj.hasOwnProperty('fromLimitSrc') && changeObj.hasOwnProperty('toLimitSrc')) {
                    var tempSrc = null;
                    tempSrc = changeObj.fromLimitSrc;
                    changeObj.fromLimitSrc = changeObj.toLimitSrc;
                    changeObj.toLimitSrc = tempSrc;
                }

                if (changeObj.hasOwnProperty('fromSpeedLimit') && !changeObj.hasOwnProperty('toSpeedLimit')) {
                    changeObj.toSpeedLimit = changeObj.fromSpeedLimit;
                    changeObj.fromSpeedLimit = 0;
                }

                if (!changeObj.hasOwnProperty('fromSpeedLimit') && changeObj.hasOwnProperty('toSpeedLimit')) {
                    changeObj.fromSpeedLimit = changeObj.toSpeedLimit;
                    changeObj.toSpeedLimit = 0;
                }

                if (changeObj.hasOwnProperty('fromLimitSrc') && !changeObj.hasOwnProperty('toLimitSrc')) {
                    changeObj.toLimitSrc = changeObj.fromLimitSrc;
                    changeObj.fromLimitSrc = 0;
                }
                if (!changeObj.hasOwnProperty('fromLimitSrc') && changeObj.hasOwnProperty('toLimitSrc')) {
                    changeObj.fromLimitSrc = changeObj.toLimitSrc;
                    changeObj.toLimitSrc = 0;
                }
                return changeObj;
            },

            /**
             * 将批量选中的线进行处理，以第一个link为标准进行判断，
             * 第一个link为true,之后的link和第一个进行对比
             * @method ConfirmDirect
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} datas link数据
             * @return {object} 对象
             */
            ConfirmDirect: function (datas) {
                var config = {};
                config[datas[0].pid] = true;
                for (var i = 0, len = datas.length; i < len - 1; i++) {
                    if (this._judgeSamedirection(datas[i], datas[i + 1])) {
                        if (config[datas[i].pid] == true) {
                            config[datas[i + 1].pid] = true;
                        } else {
                            config[datas[i + 1].pid] = false;
                        }
                    } else {
                        if (config[datas[i].pid] == true) {
                            config[datas[i + 1].pid] = false;
                        } else {
                            config[datas[i + 1].pid] = true;
                        }
                    }
                }
                return config;
            },

            /**
             * 判断批量选择的link是否是同向的
             * @method _judgeSamedirection
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} first link
             * @param  {object} second link
             * @return {boolean} 同向返回true，否则fale
             */
            _judgeSamedirection: function (first, second) {
                if (first.sNodePid == second.eNodePid || first.eNodePid == second.sNodePid) {
                    return true;
                }
                return false;
            },

            /**
             * 修改限制信息direct
             * @method getBatchLimit
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 附加属性数据
             * @param  {object} change 发生变化的数据
             * @param  {string} key 类型
             * @return {object} 发生变化的数据
             */
            getBatchLimit: function (data, change, key) {
                var changeObj = FM.Util.clone(change);
                if (changeObj.hasOwnProperty(key)) {
                    if (changeObj.limitDir == 2) {
                        changeObj.limitDir = 3;
                    } else if (changeObj.limitDir == 3) {
                        changeObj.limitDir = 2;
                    }
                }

                return changeObj;
            },

            /**
             * 根据link的画线方向维护顺向限速及逆向限速
             * @method exchangeSpeedLimit
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} speedObj 限速对象
             * @return {object} 限速对象
             */
            exchangeSpeedLimit: function (speedObj) {
                if ((speedObj.fromSpeedLimit || speedObj.fromSpeedLimit == 0) && (speedObj.toSpeedLimit || speedObj.toSpeedLimit == 0)) {
                    var temp = speedObj.fromSpeedLimit;
                    speedObj.fromSpeedLimit = speedObj.toSpeedLimit;
                    speedObj.toSpeedLimit = temp;
                    var tempsrc = speedObj.fromLimitSrc;
                    speedObj.fromLimitSrc = speedObj.toLimitSrc;
                    speedObj.toLimitSrc = tempsrc;
                } else if ((speedObj.fromSpeedLimit || speedObj.fromSpeedLimit == 0) && !speedObj.toSpeedLimit) {
                    speedObj.toSpeedLimit = speedObj.fromSpeedLimit;
                    speedObj.toLimitSrc = speedObj.fromLimitSrc;
                    delete speedObj.fromSpeedLimit;
                    delete speedObj.fromLimitSrc;
                } else if (!speedObj.fromSpeedLimit && (speedObj.toSpeedLimit || speedObj.toSpeedLimit == 0)) {
                    speedObj.fromSpeedLimit = speedObj.toSpeedLimit;
                    speedObj.fromLimitSrc = speedObj.toLimitSrc;
                    delete speedObj.toSpeedLimit;
                    delete speedObj.toLimitSrc;
                }
                return speedObj;
            },

            /**
             * 修改direct属性
             * @method getBatchRticAndWalk
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 附加属性数据
             * @param  {object} change 发生变化的数据
             * @param  {string} key 类型
             * @return {object} 发生变化的数据
             */
            getBatchRticAndWalk: function (data, change, key) {
                var changeObj = FM.Util.clone(change);
                if (changeObj.hasOwnProperty(key)) {
                    if (changeObj[key] == 1) {
                        changeObj[key] = 2;
                    } else if (changeObj[key] == 2) {
                        changeObj[key] = 1;
                    }
                }

                return changeObj;
            },

            /**
             * 关联维护
             * @method getBatchChange
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} changedata 发生变化的数据
             * @param  {object} origindata 原始数据
             * @return {object} 发生变化的数据
             */
            getBatchChange: function (changedata, origindata) {
                var obj = {};
                origindata = FM.dataApi.Feature.create(origindata);
                for (var key in changedata) {
                    if (changedata.hasOwnProperty(key)) {
                        switch (key) {

                            case 'kind':
                                origindata.changeKind(changedata.kind, origindata.kind);
                                obj = L.extend({}, origindata.getChanges());
                                // changes.push(origindata.getChanges());
                                break;
                            case 'laneNum':
                                if (changedata[key] == 0) {
                                    break;
                                }
                                origindata[key] = changedata[key];
                                origindata.changeLaneNum();
                                obj = L.extend({}, origindata.getChanges());
                                break;
                            case 'laneLeft':
                                if (changedata[key] == 0) {
                                    break;
                                }
                                origindata[key] = changedata[key];
                                origindata.changeLeftOrRightLaneNum();
                                obj = L.extend({}, origindata.getChanges());
                                break;
                            case 'laneRight':
                                if (changedata[key] == 0) {
                                    break;
                                }
                                origindata[key] = changedata[key];
                                origindata.changeLeftOrRightLaneNum();
                                obj = L.extend({}, origindata.getChanges());
                                break;
                            case 'urban':
                                origindata[key] = changedata[key];
                                origindata._limitSpeed();
                                obj = L.extend({}, origindata.getChanges());
                                break;
                            case 'forms':
                                for (var item in changedata[key]) {
                                    if (changedata[key][item].objStatus == 'INSERT') {
                                        origindata[key].push(changedata[key][item]);
                                    } else if (changedata[key][item].objStatus == 'DELETE') {
                                        var forms = FM.Util.clone(origindata[key]);
                                        for (var j = 0, jlen = origindata[key].length; j < jlen; j++) {
                                            if (origindata[key][j].rowId == changedata[key][item].rowId) {
                                                forms.splice(j, 1);
                                            }
                                        }
                                        origindata[key] = forms;
                                    } else if (changedata[key][item].objStatus == 'UPDATE') {
                                        for (var k = 0, klen = origindata[key].length; k < klen; k++) {
                                            if (origindata[key][k].rowId == changedata[key][item].rowId) {
                                                FM.Util.merge(origindata[key][k], changedata[key][item]);
                                            }
                                        }
                                    }
                                }

                                var cloneForms = [];
                                for (var i = 0, len = origindata[key].length; i < len; i++) {
                                    var form = new FM.dataApi.RdLinkForm(origindata[key][i]);
                                    cloneForms.push(form);
                                }
                                origindata[key] = cloneForms;
                                origindata.changeRdlinkForm();
                                obj = L.extend({}, origindata.getChanges());
                                break;
                            default:
                        }
                    }
                }

                return obj;
            },

            /**
             * 更新name seqnum
             * @method updateNamesSeqNum
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} names 名称
             * @return {undefined}
             */
            updateNamesSeqNum: function (names) {
                for (var i = 0, len = names.length; i < len; i++) {
                    names.seqNum = i;
                }
            },

            /**
             * 如果是插入形态，删除形态为1的
             * @method deleteFormOfWay
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 数据对象
             * @return {object} 删除形态对象
             */
            deleteFormOfWay: function (data) {
                var deleteForm = null;
                for (var i = 0, len = data.forms.length; i < len; i++) {
                    if (data.forms[i].formOfWay == 1 && data.forms[i].objStatus != 'INSERT') {
                        deleteForm = data.forms[i];
                    }
                }
                return deleteForm;
            },

            /**
             * 如果插入的形态为无属性，则需要将原来的形态全部删除
             * @method deleteFormOfWay
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 数据对象
             * @return {object} 删除形态对象
             */
            deleteOriginForm: function (data) {
                var dels = [];
                for (var i = 0, len = data.forms.length; i < len; i++) {
                    dels.push({
                        rowId: data.forms[i].rowId,
                        pid: data.pid,
                        objStatus: 'DELETE'
                    });
                }
                return dels;
            },

            /**
             * 处理批量编辑删除属性时存在插入无属性形态问题
             * @method deleteNone
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 数据对象
             * @return {undefined}
             */
            deleteNone: function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i] && data[i].formOfWay == 1 && data[i].objStatus == 'INSERT') {
                        data.splice(i, 1);
                    }
                }
            },

            /**
             * 判断要插入的形态是否已经存在，如存在则不再插入
             * @method confirmFormOfWay
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} datas 原始数据对象
             * @param  {object} change 发生变化的数据对象
             * @return {undefined}
             */
            confirmFormOfWay: function (datas, change) {
                for (var m in change) {
                    if (change.hasOwnProperty(m)) {
                        for (var i in change[m].forms) {
                            if (change[m].forms.hasOwnProperty(i)) {
                                for (var j in datas) {
                                    if (datas[j].pid == change[m].pid) {
                                        for (var k in datas[j].forms) {
                                            if (change[m].forms[i] && datas[j].forms[k].formOfWay == change[m].forms[i].formOfWay && change[m].forms[i].objStatus == 'INSERT' && change[m].forms[i].formOfWay != 1) {
                                                change[m].forms.splice(i, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            /**
             * names改变之后的序号
             * @method getUpdateNames
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 原始数据对象
             * @param  {number} index 索引
             * @return {array} namearr
             */
            getUpdateNames: function (data, index) {
                var namearr = [];
                if (index < data.length - 1) {
                    for (var i = index + 1, len = data.length; i < len; i++) {
                        if (data[i].rowId) {
                            namearr.push({
                                rowId: data[i].rowId,
                                seqNum: i,
                                objStatus: 'UPDATE'
                            });
                        }
                    }
                } else {
                    return [];
                }
                return namearr;
            },

            /**
             * 整理对象数据，如果为class则需要调用getIntegrate，如果为简单对象则删除options
             * @method getObjects
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} arr 对象数组
             * @return {undefined}
             */
            getObjects: function (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var key in arr[i]) {
                        if (key == 'feeStd' && isNaN(arr[i][key])) {
                            delete arr[i][key];
                        }
                        if (FM.Util.isArray(arr[i][key])) {
                            for (var j = 0, length = arr[i][key].length; j < length; j++) {
                                if (arr[i][key][j].getIntegrate) {
                                    arr[i][key][j] = arr[i][key][j].getIntegrate();
                                    this.deleteNullProps(arr[i][key][j]);
                                } else {
                                    this.deleteNullProps(arr[i][key][j]);
                                    delete arr[i][key][j].options;
                                    delete arr[i][key][j]._initHooksCalled;
                                    delete arr[i][key][j].geoLiveType;
                                    delete arr[i][key][j].id;
                                    delete arr[i][key][j]._originData;
                                    delete arr[i][key][j]._origin;
                                }
                            }
                        }
                    }
                    if (arr[i].rowId) {
                        // delete arr[i].rowId;
                    }
                }

                this.confirmFormOfWay(this.datas, arr);
            },

            /**
             * 删除属性为null字段
             * @method deleteNullProps
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} obj 对象
             * @return {undefined}
             */
            deleteNullProps: function (obj) {
                for (var key in obj) {
                    if (obj[key] === null) {
                        delete obj[key];
                    }
                    if (key === 'speedClassWork') {
                        if (isNaN(obj[key])) {
                            delete obj[key];
                        }
                    }
                }
            },

            /**
             * 替代上边的 setCurrentData，setOriginalData
             * @method setData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 编辑对象
             * @param  {object} option 对象
             * @return {undefined}
             */
            setData: function (data, option) {
                var oldGeoLiveType;
                if (this.data) {
                    oldGeoLiveType = this.data.geoLiveType;
                }

                if (data instanceof FM.dataApi.DataModel) {
                    // 注意：批量编辑时要求这里必须直接赋值
                    // 如果其他情况下需要用备份的对象，需要在调用setData之前进行处理（如使用clone）
                    this.data = data;
                } else {
                    if (data.rowkey) {
                        this.data = FM.dataApi.Tip.create(data);
                    } else {
                        this.data = FM.dataApi.Feature.create(data, option);
                    }
                }

                if (oldGeoLiveType !== this.data.geoLiveType) {
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, {
                        originalData: this.originalData,
                        currentData: this.data
                    });
                }

                this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE, {
                    originalData: this.originalData,
                    currentData: this.data
                });

                this.originalData = this.data.origin; // 记录原始值
            },
            /**
             * 情报数据
             * @method setInfoData
             * @author wangchunmei
             * @date   2017-11-01
             * @param  {object} data 编辑对象
             * @param  {boolean} boolBatch 是否批量编辑flag
             * @return {undefined}
             */
            setInfoData: function (data, boolBatch) {
                var oldGeoLiveType;
                if (this.data) {
                    oldGeoLiveType = this.data.geoLiveType;
                }
                this.data = FM.dataApi.Info.create(data, {});

                if (oldGeoLiveType !== this.data.geoLiveType) {
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, {
                        originalData: this.originalData,
                        currentData: this.data
                    });
                }

                this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE, {
                    originalData: this.originalData,
                    currentData: this.data
                });

                this.originalData = FM.dataApi.Info.create(data); // 记录原始值
            },

            /**
             * 批量编辑时的数据
             * @method setBatchData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} dataArray 编辑对象
             * @param  {boolean} batchType 批量操作类型
             * @return {undefined}
             */
            setBatchData: function (dataArray, batchType) {
                var i;
                this.datas.length = 0;
                for (i = 0; i < dataArray.length; i++) {
                    this.datas.push(FM.dataApi.Feature.create(dataArray[i], { boolBatch: true, batchType: batchType }));
                }
                var currentData = FM.dataApi.Feature.create(dataArray[0], { boolBatch: true, batchType: batchType });
                for (i = 0; i < this.datas.length; i++) {
                    // var sameDirect = false;
                    // if (this.confirmDirect(currentData, this.datas[i])) {
                    //     currentData.eNodePid = this.datas[i].eNodePid;
                    //     currentData.sNodePid = this.datas[i].sNodePid;
                    //     sameDirect = true;
                    // } else {
                    //     currentData.eNodePid = this.datas[i].sNodePid;
                    //     currentData.sNodePid = this.datas[i].eNodePid;
                    // }
                    // currentData.compareCommon({
                    //     compareObj: this.datas[i],
                    //     sameDirect: sameDirect,
                    //     rules: ['pid', 'geometry', 'options', '_originData', '_origin', 'rowId', 'seqNum', 'eNodePid', 'sNodePid']
                    // });
                    currentData.merge(this.datas[i]);
                }
                for (i = 0; i < this.datas.length; i++) {
                    this.datas[i].clean(currentData);
                }
                // this.setData(this.addBatchType(this.clearCommonData(currentData.getIntegrate(true)), batchType), true);
                this.clearCommonData(currentData);
                // 数据做过merge和clean之后，为了保证后续差分、更新的准确性，要重置一下原始Json数据
                currentData.resetOrigin();
                this.setData(currentData);
            },

            getBatchChanges: function () {
                var changes = [];
                for (var i = 0; i < this.datas.length; i++) {
                    this.datas[i].update(this.data);
                    let ret = this.datas[i].getChanges();
                    if (ret) {
                        changes.push(ret);
                    }
                }
                return changes;
            },

            /**
             * 批量编辑时的Node数据
             * @method setNodeBatchData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} dataArray 编辑对象
             * @return {undefined}
             */
            setNodeBatchData: function (dataArray) {
                var i;
                this.datas.length = 0;
                for (i = 0; i < dataArray.length; i++) {
                    this.datas.push(FM.dataApi.Feature.create(dataArray[i], { boolBatch: true }));
                }

                var currentData = FM.Util.clone(this.datas[0]);
                for (i = 1; i < this.datas.length; i++) {
                    currentData.compareCommon({
                        compareObj: this.datas[i],
                        rules: ['pid', 'geometry', 'options', '_originData', '_origin', 'rowId']
                    });
                }

                this.setData(this.clearCommonData(currentData.getIntegrate()), true);
            },

            /**
             * 批量编辑时的TIPS数据
             * @method setTipsData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 编辑对象
             * @return {undefined}
             */
            setTipsData: function (data) {
                var oldGeoLiveType;
                if (this.data) {
                    oldGeoLiveType = this.data.geoLiveType;
                }

                this.data = FM.dataApi.Tip.create(data);

                if (oldGeoLiveType !== this.data.geoLiveType) {
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, {
                        originalData: this.originalData,
                        currentData: this.data
                    });
                }

                this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE, {
                    originalData: this.originalData,
                    currentData: this.data
                });

                this.originalData = FM.dataApi.Tip.create(data); // 记录原始值
            },

            /**
             * 判断两条link是否方向一致
             * @method confirmDirect
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} base link
             * @param  {object} from link
             * @return {boolean} 同向返回true,否则false
             */
            confirmDirect: function (base, from) {
                var boolDirect = false;
                // 两条线的划线方向不一致
                if (base.eNodePid != from.sNodePid && base.sNodePid != from.eNodePid) {
                    boolDirect = false;
                } else {
                    boolDirect = true;
                }
                return boolDirect;
            },

            /**
             * 整理数据去掉值为-1的情况
             * @method clearCommonData
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 数据对象
             * @return {object} 数据对象
             */
            clearCommonData: function (data) {
                var keys = Object.keys(data);
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (Object.prototype.toString.apply(data[keys[i]]) == '[object Object]') {
                        this.clearCommonData(data[keys[i]]);
                    } else if (Object.prototype.toString.apply(data[keys[i]]) == '[object Array]') {
                        for (var j = 0, length = data[keys[i]].length; j < length; j++) {
                            if (Object.prototype.toString.apply(data[keys[i]][j]) == '[object Object]') {
                                this.clearCommonData(data[keys[i]][j]);
                            }
                        }
                    } else if (data[keys[i]] == -1) {
                        if (keys[i] == 'kind') {
                            data[keys[i]] = -1;
                        } else {
                            data[keys[i]] = '-';
                        }
                    }
                }
                return data;
            },

            /**
             * 增加批量编辑选中要素的方式
             * @method addBatchType
             * @author WangTun
             * @date   2017-09-11
             * @param  {object} data 数据对象
             * @param  {string} type 类型
             * @return {object} 数据对象
             */
            addBatchType: function (data, type) {
                if (data) {
                    data.batchType = type;
                }
                return data;
            },

            /**
             * 将ObjectEditController置为初始状态
             * @method clear
             * @author WangTun
             * @date   2017-09-11
             * @return {undefined}
             */
            clear: function () {
                this.originalData = null;
                this.data = null;
                this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, null);
            }
        });
        return new Controller(options);
    }
    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    };
}());
