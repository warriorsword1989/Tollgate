import ConnectMetaOracle from '../../oracle/connectMetaOracle';
import connectDynamicOracle from '../../oracle/connectDynamicOracle';
import connectRenderObj from '../../oracle/connectRenderObj';
import connetSelfObje from '../../oracle/connectOracle';
import logger from '../../config/logs';
import {
  changeResult
} from '../../Util';

class TollGate {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.table = 'SC_TOLL_TOLLGATEFEE';
    this.db = new ConnectMetaOracle();
    this.selfDB = new connetSelfObje();
    this.originDB = connectRenderObj;
  }

  /**
   * 根据groupId查询收费站信息;
   */
  async getTollGate() {
    const param = this.req.query;
    const pid = param.pid;
    this.table = param.table;
    if (param.workFlag == 'dynamic') {
      this.db = new connectDynamicOracle();
    }
    const primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : this.table === 'SC_TOLL_RDLINK_BT' ? 'NAME_BT_ID' : 'GROUP_ID';
    let sql = "SELECT * FROM " + this.table + " WHERE " + primaryKey + " = '" + pid + "'";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }

  /**
   * 
   */
  async getHolidayMax() {
    const param = this.req.query;
    this.table = param.table;
    const queryNum = param.adminCode.substr(0,2);
    this.db = new connectDynamicOracle();
    let sql = "SELECT max(ID) as maxNum from "+this.table+" where ID LIKE '"+queryNum+"%'";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }

  /**
   * 根据groupId查询收费站信息;
   */
  async getTollName() {
    const param = this.req.query;
    const pid = param.pid;
    this.table = param.table;
    let sql = `SELECT * FROM ${this.table} WHERE PID=${pid} AND LANG_CODE='CHI'`;
    const result = await this.originDB.executeSql2(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }

  /**
   * 
   */
  async getBtName() {
    const param = this.req.query;
    const nameString = param.bridgeName;
    this.table = param.table;
    if (param.workFlag == 'dynamic') {
      this.db = new connectDynamicOracle();
    }
    let sql = "SELECT NAME_GROUPID,NAME FROM " + this.table + " WHERE NAME LIKE " + "'%"+ nameString + "%' AND ROWNUM <= 1000";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    let temp = resultData.map(item => {
      return item.name_groupid;
    });
    let inString  = "("+temp.join(',')+")";
    let sql2 = "SELECT NAME_GROUPID FROM RD_LINK_NAME WHERE NAME_GROUPID IN "+inString+" AND NAME_TYPE IN (4,5)";
    const originResult = await this.originDB.executeSql2(sql2)
    const allGroup = changeResult(originResult);
    let results = []
    resultData.forEach(item => {
      allGroup.forEach(innerItem => {
        if (item.name_groupid == innerItem.name_groupid) {
          results.push(item);
        }
      })
    });
    this.res.send({
      errorCode: 0,
      data: results
    });
  }


  /**
   * 对数据表进行更新
   */
  async updateTollGate() {
    const _self = this;
    const param = this.req.body.data;
    this.table = this.req.body.table;
    this.adminCode = this.req.body.adminCode;
    if (this.req.body.workFlag == 'dynamic') {
      this.db = new connectDynamicOracle();
    }
    let primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : this.table === 'SC_TOLL_RDLINK_BT' ? 'NAME_BT_ID' : 'GROUP_ID';
    if (this.table == 'SC_TOLL_HOLIDAY' || this.table == 'SC_TOLL_SPEFLOAT') {
      primaryKey = 'ID';
    }
    let pids = param.map(item => item[primaryKey.toLowerCase()]);
    let delSql = `DELETE FROM ${this.table} WHERE ${primaryKey} IN (${pids.join(',')})`;
    const delResult = await this.db.executeSql(delSql);
    if (delResult.rowsAffected != -1) {
      let insertSql = this._getInsertString(param);
      const insertResult = await this.db.executeSql(insertSql);
      if (insertResult.rowsAffected != -1) {
        // 如果与收费站有关的表有插入则更新index表;
        let tollTable = ['SC_TOLL_CAR','SC_TOLL_TRUCK','SC_TOLL_LOAD','SC_TOLL_LOAD_GD','SC_TOLL_OVERLOAD','SC_TOLL_TOLLGATEFEE','SC_TOLL_GROUP'];
        let priamry = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : 'GROUP_ID';
        if (tollTable.indexOf(this.table) !=-1){
          let allTollPids = param.map(item => item[priamry.toLowerCase()]);
          let handleFlag = true;
          let resultBox = null;
          for (let i=0;i<allTollPids.length;i++) {
            let selectSql = `SELECT * FROM SC_TOLL_INDEX WHERE TOLL_PID = ${allTollPids[i]}`;
            let searchResult = await this.selfDB.executeSql(selectSql);
            if (searchResult.rows.length) {
              let updateField = this.req.body.workFlag =='static' ? 'TOLL_STATIC_STATE' : 'TOLL_DYNAMIC_STATE';
              let updateSql = `UPDATE SC_TOLL_INDEX SET ${updateField} = 1 WHERE TOLL_PID=${allTollPids[i]}`;
              resultBox = await this.selfDB.executeSql(updateSql);
            } else {
              let insertRes = this._updateTollIndex();
              let insertValue = this.req.body.workFlag == 'static' ? `${allTollPids[i]},${this.adminCode},0,Null`: `${allTollPids[i]},${this.adminCode},Null,0`;
              let insertsSql = `INSERT INTO SC_TOLL_INDEX (TOLL_PID,ADMIN_CODE,TOLL_STATIC_STATE,TOLL_DYNAMIC_STATE) VALUES (${insertValue})`;
              resultBox = await this.selfDB.executeSql(insertsSql);
            }
            if (resultBox.rowsAffected == -1) {
              handleFlag = false;
            }
          }
          if (handleFlag) {
            this.res.send({errorCode: 0});
          } else {
            this.res.send({errorCode: -1});
          }
        } else {
          this.res.send({errorCode: 0});
        }
      } else {
        this.res.send({errorCode: -1});
      }
    } else {
      this.res.send({errorCode: -1});
    }
  }

  /**
   * 删除表中的收费站相关信息
   */
  async deleteCarTruckTollGate() {
    if (this.req.body.workFlag == 'dynamic') {
      this.db = new connectDynamicOracle();
    }
    this.table = this.req.body.table;
    let pid = this.req.body.pid;
    let delSql = `DELETE FROM ${this.table} WHERE GROUP_ID = ${pid}`;
    let delResult = await this.db.executeSql(delSql);
    if (delResult.rowsAffected != -1) { 
      // 如果删除成功，去查与收费站相关的表，如果不存在该收费站信息，则更新index表;
      let existFlag = await this.isTollgateExists(pid,this.table);
      if (!existFlag) {
        //将对应的状态改为删除2;
        let updateField = this.req.body.workFlag == 'dynamic'?'TOLL_DYNAMIC_STATE=2':'TOLL_STATIC_STATE=2';
        let updateSql = `UPDATE SC_TOLL_INDEX SET ${updateField} WHERE TOLL_PID=${pid}`;
        let updateRes = await this.selfDB.executeSql(updateSql);
        if (updateRes.rowsAffected != -1) {
          this.res.send({errorCode: 0, message: '删除成功', updateFlag: true});
        } else {
          this.res.send({errorCode: -1, message: '删除失败', updateFlag: false});
        }
      } else {
        this.res.send({errorCode: 0, message: '删除成功', updateFlag: false});
      }
    } else {
      this.res.send({errorCode: -1, message: '删除失败', updateFlag: false});
    }
  }

  /**
   * 查询一条收费站是否新增或删除过；
   */
  async isTollgateExists(pid, table) {
    // 与收费站有关的表;
    let tollTable = ['SC_TOLL_CAR','SC_TOLL_TRUCK','SC_TOLL_LOAD','SC_TOLL_LOAD_GD','SC_TOLL_OVERLOAD','SC_TOLL_TOLLGATEFEE','SC_TOLL_GROUP'];
    let allTable = new Set(tollTable);
    let currentTable = new Set([table]); 
    let differenceABSet = new Set([...allTable].filter(x => !currentTable.has(x)));
    differenceABSet = Array.from(differenceABSet);
    let existFlag = false;
    for (let i=0;i<differenceABSet.length;i++) {
      let primaryKey = (differenceABSet[i] === 'SC_TOLL_TOLLGATEFEE') ? 'TOLL_PID'  : 'GROUP_ID';
      let sql = `SELECT * FROM ${differenceABSet[i]} WHERE ${primaryKey}=${pid}`;
      let queryRes = await this.db.executeSql(sql);
      if (queryRes.rows.length) {// 如果有
        existFlag = true;
        break;
      }
    }
    return existFlag;
  }
  /**
   * toll_index表查询;
   */
  async _findTollgateIndex(primaryKey) {
    let sql = `SELECT * FROM SC_TOLL_INDEX WHERE TOLL_PID=${primaryKey}`;
    let qureyRes = await this.selfDB.executeSql(sql);
    return changeResult(qureyRes);
  }
  /**
   * 获得update部分语句
   * @param {*} data 
   */
  _getInsertString(data) {
    let tempString = 'INSERT ALL INTO  ' + this.table + ' ';
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        tempString += '(' + Object.keys(data[i]).join(',') + ') VALUES ('
      } else {
        tempString += 'INTO ' + this.table + ' (' + Object.keys(data[i]).join(',') + ') VALUES ('
      }
      for (let key in data[i]) {
        if (key != 'command') {
          if (typeof data[i][key] === 'string') {
            tempString += "'" + data[i][key] + "',";
          } else {
            tempString += data[i][key] + ",";
          }
        }
      }
      tempString = tempString.substr(0, tempString.length - 1);
      tempString += (i == data.length - 1) ? ')' : ') ';
    }
    return tempString + ' SELECT * FROM dual';
  }

}

export default TollGate;
