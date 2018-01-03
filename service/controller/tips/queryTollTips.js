import connectOracle from '../../oracle/connectOracle';
import logger from '../../config/logs';
import { changeResult } from '../../Util';

class Tips {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  
  async getTollGateTipList() {
    const param = JSON.parse(this.req.query.parameter);
    const adminCode = param.adminCode;
    const tipsVersion = param.tipsVersion;
    const tollName = param.tollName;
    const updateStartTime = param.updateStartTime;
    const updateEndTime = param.updateEndTime;
    const isAdopted = param.isAdopted;
    let sql = "SELECT * FROM SC_TOLL_TIPS_INDEX WHERE ADMIN_CODE = '" + adminCode + "'";
    if (tipsVersion) {
      sql = sql + " AND TIPS_VERSION = '" + tipsVersion + "'";
    }
    if (tollName) {
      sql = sql + " AND TOLL_NAME LIKE '%" + tollName + "%'";
    }
    if (updateStartTime && updateEndTime) {
      sql = sql + " AND UPDATE_TIME BETWEEN TO_DATE('" + updateStartTime + "', 'yyyy-MM-dd') AND TO_DATE('" + updateEndTime + "', 'yyyy-MM-dd')";
    }
    if (isAdopted.length > 0) {
      sql = sql + " AND IS_ADOPTED IN (" + isAdopted.toString() + ")";
    }
    console.log(sql);
    const result = await  connectOracle.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }
}

export default Tips;
