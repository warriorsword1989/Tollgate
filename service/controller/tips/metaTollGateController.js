import ConnectMetaOracle from '../../oracle/connectMetaOracle';
import logger from '../../config/logs';
import { changeResult } from '../../Util';

class TollGate {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.table = 'SC_TOLL_TOLLGATEFEE';
    this.db = new ConnectMetaOracle();
  }

  /**
   * 根据groupId查询收费站信息;
   */
  async getTollGate() {
    const param = this.req.query;
    const pid = param.pid;
    this.table = param.table;
    const primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : 'GROUP_ID';
    let sql = "SELECT * FROM " + this.table + " WHERE " + primaryKey + " = '" + pid + "'";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }

  /**
   * 更新表;
   */
  async updateTollGate() {
    const param = this.req.body;
    this.table = param.table;
    const primaryKey = this.table === 'SC_TOLL_TOLLGATEFEE' ? 'TOLL_PID' : this.table === 'SC_TOLL_LIMIT' ? 'SYSTEM_ID' : 'GROUP_ID';
    let updateString = this.getUpdateString(param);
    let sql = "UPDATE " + this.table + " SET " + updateString +
    " WHERE " + primaryKey + "=" + param[primaryKey.toLowerCase()];
    const result = await this.db.executeSql(sql);
    if (result.rowsAffected === 1) {
      this.res.send({errorCode: 0});
    } else {
      this.res.send({errorCode: -1});
    }
  }
  /**
   * 获得update部分语句
   * @param {*} data 
   */
  getUpdateString(data){
    let tempString = ''
    for(let key in data) {
      if (key != 'table') {
        tempString += key.toUpperCase() + "='" + data[key] + "',";
      }
    }
    return tempString.substr(0, tempString.length-1);
  }
  
}

export default TollGate;
