import ConnectOracle from '../../oracle/connectOracle';
import ConnectGdbOracle from '../../oracle/connectGdbOracle';
import logger from '../../config/logs';
import { changeResult } from '../../Util';
import { stringify } from 'querystring';

class GetInfoData {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.table = 'SC_TOLL_INFO';
    this.db = new ConnectOracle();
    this.adminTable = 'AD_ADMIN';
    this.adminDb = new ConnectGdbOracle();
  }

  async getTollGateInfoList() {
    const param = this.req.query;
    const adminCode = param.adminCode;
    const infoCode = param.infoCode;
    const complete = param.complete;
    const sendBeforeTime = param.sendBeforeTime;
    const sendAfterTime = param.sendAfterTime;
    const pushBeforeTime = param.pushBeforeTime;
    const pushAfterTime = param.pushAfterTime;
    let sql = "SELECT * FROM " + this.table + " WHERE ADMIN_CODE = '" + adminCode + "'";
    if (infoCode) {
      sql = sql + " AND INFO_CODE = '" + infoCode + "'";
    }
    if (sendBeforeTime && sendAfterTime) {
      sql = sql + " AND NEWS_TIME BETWEEN '" + sendBeforeTime + "' AND '" + sendAfterTime + "'";
    }
    if (pushBeforeTime && pushAfterTime) {
      sql = sql + " AND PUBLIC_TIME BETWEEN '" + pushBeforeTime + "' AND '" + pushAfterTime + "'";
    }
    if (complete.length > 0) {
      sql = sql + " AND COMPLETE IN (" + complete.toString() + ")";
    }
    try {
      const result = await this.db.executeSql(sql);
      const resultData = changeResult(result);
      this.res.send({
        errorCode: 0,
        data: resultData
      });
    } catch(error) {
      this.res.send({
        errorCode: -1,
        data: error
      });
    }
  }

  async getAdminLoc() {
    const param = this.req.query;
    const adminCode = param.adminCode;
    let sql = "SELECT to_char(a.GEOMETRY.get_wkt()) as GEOMETRY FROM " + this.adminTable + " a WHERE ADMIN_ID = '" + adminCode + "'";
    try {
      const result = await this.adminDb.executeSql(sql);
      const resultData = changeResult(result);
      this.res.send({
        errorCode: 0,
        data: resultData
      });
    } catch(error) {
      this.res.send({
        errorCode: -1,
        data: error
      });
    }
  }

  async getInfoListByInfoCode() {
    const param = this.req.query;
    const infoCode = param.infoCode;
    let sql = "SELECT * FROM " + this.table + " a WHERE INFO_CODE = '" + infoCode + "'";
    try {
      const result = await this.db.executeSql(sql);
      const resultData = changeResult(result);
      this.res.send({
        errorCode: 0,
        data: resultData
      });
    } catch(error) {
      this.res.send({
        errorCode: -1,
        data: error
      });
    }
  }

  async updateInfoListByInfoIntelId() {
    const param = this.req.query;
    const infoIntelId = param.infoIntelId;
    const complete = param.complete;
    const memo = param.memo;
    const sql = "UPDATE " + this.table + " SET complete = '" + complete + "', memo = '" + memo + "' WHERE INFO_INTEL_ID = '" + infoIntelId + "'";
    try {
      const result = await this.db.executeSql(sql);
      this.res.send({
        errorCode: 0,
        data: []
      });
    } catch(error) {
      this.res.send({
        errorCode: -1,
        data: error
      });
    }
  }
}

export default GetInfoData;
