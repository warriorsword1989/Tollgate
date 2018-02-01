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
    const primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : this.table === 'SC_TOLL_RDLINK_BT' ? 'NAME_BT_ID' : 'GROUP_ID';
    let delSql = "DELETE FROM " + this.table + " WHERE " + primaryKey + " = " + param[0][primaryKey.toLowerCase()];
    let insertSql = this.getInsertString(param);
    const delResult = await this.db.executeSql(delSql);
    if (delResult.rowsAffected != -1) {
      const insertResult = await this.db.executeSql(insertSql);
      if (insertResult.rowsAffected != -1) {
        // 如果与收费站有关的表有插入则更新index表;
        let tollTable = ['SC_TOLL_CAR','SC_TOLL_TRUCK','SC_TOLL_LOAD','SC_TOLL_LOAD_GD','SC_TOLL_OVERLOAD','SC_TOLL_TOLLGATEFEE','SC_TOLL_GROUP'];
        let priamry = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : 'GROUP_ID';
        if (tollTable.indexOf(this.table) !=-1){
          let allTollPids = param.map(item => {
            if (_self.table == 'SC_TOLL_TOLLGATEFEE') {
              return item.toll_pid;
            }
            return item.group_id;
          });
          console.log(allTollPids)
          for (let i=0;i<allTollPids.length;i++) {
            let selectSql = "SELECT * FROM SC_TOLL_INDEX WHERE TOLL_PID = " + allTollPids[i];
            let searchResult = await this.selfDB.executeSql(selectSql);
            if (searchResult.rows.length) {
              let updateSql = '';
              if (this.req.body.workFlag =='static') {
                updateSql = "UPDATE SC_TOLL_INDEX SET ADMIN_CODE="+this.adminCode+", TOLL_STATIC_STATE=1 WHERE TOLL_PID="+allTollPids[i];
              } else {
                updateSql = "UPDATE SC_TOLL_INDEX SET ADMIN_CODE="+this.adminCode+", TOLL_DYNAMIC_STATE=1 WHERE TOLL_PID="+allTollPids[i];
              }
              let updateResult = await this.selfDB.executeSql(updateSql);
            } else {
              let insertsSql = '';
              if (this.req.body.workFlag =='static') {
                insertsSql = "INSERT INTO SC_TOLL_INDEX (TOLL_PID,ADMIN_CODE,TOLL_STATIC_STATE,TOLL_DYNAMIC_STATE) VALUES ("+allTollPids[i]+","+this.adminCode+",1,0"+")";
              } else {
                insertsSql = "INSERT INTO SC_TOLL_INDEX (TOLL_PID,ADMIN_CODE,TOLL_STATIC_STATE,TOLL_DYNAMIC_STATE) VALUES ("+allTollPids[i]+","+this.adminCode+",0,1"+")";
              }
              let insertResult = await this.selfDB.executeSql(insertsSql);
            }
          }
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
   * 获得update部分语句
   * @param {*} data 
   */
  getInsertString(data) {
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
