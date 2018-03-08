import ConnectOracle from '../../oracle/connectOracle';
import ConnectGdbOracle from '../../oracle/connectGdbOracle';
import ConnectMetaOracle from '../../oracle/connectMetaOracle';
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
    this.tollTable = 'SC_TOLL_RDLINK';
    this.tollDb = new ConnectMetaOracle();
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

  async getTollListByRdName() {
    const param = this.req.query;
    const roadName = param.roadName;
    const sql = "SELECT DISTINCT GROUP_ID FROM " + this.tollTable + " WHERE NAME_BT = '" + roadName + "'";
    try {
      const result = await this.tollDb.executeSql(sql);
      const resultData = changeResult(result);
      let groupId = [];
      for (let i = 0; i < resultData.length; i++) {
        groupId.push(resultData[i].group_id)
      }
      const sql1 = "SELECT pid,name from RD_TOLLGATE_NAME where pid in(" + groupId.toString() + ") and lang_code='CHI'";
      console.log(sql1);
      const result1 = await this.adminDb.executeSql(sql1);
      const resultData1 = changeResult(result1);
      this.res.send({
        errorCode: 0,
        data: resultData1
      });
    } catch(error) {
      this.res.send({
        errorCode: -1,
        data: error
      });
    }
  }

  async getTollListByTollId() {
    const param = this.req.query;
    const tollIds = param.tollIds;
    let sql = "SELECT * from SC_TOLL_INDEX where TOLL_PID in(" + tollIds.toString() + ")";
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
  async getTollGateByAdminCode() {
    const param = this.req.query;
    const adminCode = param.adminCode;
    let sql = "select distinct STR.GROUP_ID from SC_TOLL_RDLINK STR left join SC_TOLL_SYSTEM STS ON STR.system_id=STS.systemid_old WHERE STS.system_id = " + adminCode;
    try {
      const result = await this.tollDb.executeSql(sql);
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

}

export default GetInfoData;
