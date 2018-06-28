import ConnectOracle from '../../oracle/connectOracle';
import ConnectGdbOracle from '../../oracle/connectGdbOracle';
import ConnectMetaOracle from '../../oracle/connectMetaOracle';
import { changeResult } from '../../Util';

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
    let condition = `ADMIN_CODE LIKE '${param.adminCode.substr(0,2)}%'`;
    if (param.infoCode) {
      condition += ` AND INFO_CODE = '${param.infoCode}'`;
    }
    if (param.pushBeforeTime && param.pushAfterTime) {
      condition += ` AND PUBLIC_TIME BETWEEN ${param.pushBeforeTime} AND ${param.pushAfterTime}`;
    }
    if (param.complete && param.complete.length > 0) {
      condition += ` AND COMPLETE IN (${param.complete.toString()})`;
    }
    let sql = `SELECT * FROM (SELECT A.*, ROWNUM RN FROM (SELECT * FROM ${this.table} WHERE ${condition}) A) WHERE
               RN BETWEEN ${(param.currentPage - 1) * param.pageSize + 1} AND ${param.currentPage * param.pageSize}`;
    try {
      const result = await this.db.executeSql(sql);
      const resultData = changeResult(result);
      const reuslt2 = await this.db.executeSql(`SELECT COUNT(*) AS total FROM ${this.table} WHERE ${condition}`);
      const totalResult = changeResult(reuslt2);
      this.res.send({ errorCode: 0, data: resultData, total: totalResult[0].total });
    } catch(error) {
      this.res.send({ errorCode: -1, data: error });
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
    const adminCode = param.adminCode;

    const sql = `SELECT DISTINCT t.group_id from ${this.tollTable} t LEFT JOIN sc_toll_system a ON t.system_id=a.system_id WHERE a.system_id=${adminCode} and t.name_bt='${roadName}'`;

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
