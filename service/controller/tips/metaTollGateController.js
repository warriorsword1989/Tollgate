import ConnectMetaOracle from '../../oracle/connectMetaOracle';
import connectRenderObj from '../../oracle/connectRenderObj';
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
    this.originDB = connectRenderObj;
  }

  /**
   * 根据groupId查询收费站信息;
   */
  async getTollGate() {
    const param = this.req.query;
    const pid = param.pid;
    this.table = param.table;
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
    let sql = "SELECT NAME_GROUPID,NAME FROM " + this.table + " WHERE NAME LIKE " + "'%"+ nameString + "%' AND ROWNUM <= 1000";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    let temp = resultData.map(item => {
      return item.name_groupid;
    });
    let inString  = "("+temp.join(',')+")";
    console.log(resultData)
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
    const param = this.req.body.data;
    this.table = this.req.body.table;
    const primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : this.table === 'SC_TOLL_RDLINK_BT' ? 'NAME_BT_ID' : 'GROUP_ID';
    let delSql = "DELETE FROM " + this.table + " WHERE " + primaryKey + " = " + param[0][primaryKey.toLowerCase()];
    let insertSql = this.getInsertString(param);
    const delResult = await this.db.executeSql(delSql);
    if (delResult.rowsAffected != -1) {
      const insertResult = await this.db.executeSql(insertSql);
      if (insertResult.rowsAffected != -1) {
        this.res.send({errorCode: 0});
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
