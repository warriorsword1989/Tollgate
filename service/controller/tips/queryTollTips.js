import ConnectOracle from '../../oracle/connectOracle';
import logger from '../../config/logs';
import { changeResult } from '../../Util';
import { stringify } from 'querystring';

class Tips {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.table = 'SC_TOLL_TIPS_INDEX';
    this.db = new ConnectOracle();
  }

  async getTollGateTipList() {
    const param = this.req.query;
    let fields = `A.ROWKEY, A.TIPS_LIFECYCLE, A.PHOTO_ID, A.TOLL_NAME, A.TOLL_TYPE,
                  to_char(A.TOLL_LOCATION.get_wkt()) as TOLL_LOCATION, A.ADMIN_CODE,
                  A.TIPS_VERSION, A.UPDATE_TIME, A.TOLL_PNUM, A.TOLL_LOC, A.IS_ADOPTED, A.MEMO, ROWNUM RN`;
    let condition = `ADMIN_CODE=${param.adminCode}`;
    if (param.tipsVersion) {
      condition += ` AND upper(TIPS_VERSION) = '${param.tipsVersion.toUpperCase()}'`;
    }
    if (param.tollName) {
      condition += ` AND TOLL_NAME LIKE '%${param.tollName}%'`;
    }
    
    if (param.updateStartTime && param.updateEndTime) {
      condition += ` AND trunc(UPDATE_TIME) BETWEEN TO_DATE('${param.updateStartTime}','yyyy-MM-dd')
                    AND TO_DATE('${param.updateEndTime}','yyyy-MM-dd')`;
    }
    if (param.isAdopted && param.isAdopted.length > 0) {
      condition += ` AND IS_ADOPTED IN (${param.isAdopted.toString()})`;
    }
    let sql = `SELECT * FROM (SELECT ${fields} FROM (SELECT * FROM ${this.table} WHERE ${condition}) A) WHERE
               RN BETWEEN ${(param.currentPage - 1) * param.pageSize + 1} AND ${param.currentPage * param.pageSize}`;
    try {
      const result = await this.db.executeSql(sql);
      const resultData = changeResult(result);
      const reuslt2 = await this.db.executeSql(`SELECT COUNT(*) AS total FROM ${this.table} WHERE ${condition}`);
      const totalResult = changeResult(reuslt2);
      this.res.send({ errorCode: 0, total: totalResult[0].total, data: resultData});
    } catch(error) {
      this.res.send({ errorCode: -1, data: error });
    }
  }

  async getTollGateTip() {
    const param = this.req.query;
    const rowkey = param.rowkey;
    let sql = "SELECT a.ROWKEY, a.TIPS_LIFECYCLE, a.PHOTO_ID, a.TOLL_NAME, a.TOLL_TYPE, to_char(a.TOLL_LOCATION.get_wkt()) as TOLL_LOCATION, a.ADMIN_CODE, a.TIPS_VERSION, a.UPDATE_TIME, a.TOLL_PNUM, a.TOLL_LOC, a.IS_ADOPTED, a.MEMO FROM " + this.table + " a WHERE ROWKEY='"+rowkey+"'";
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }


  async updateTollGateTip() {
    const param = this.req.body;
    const rowkey = param.rowkey;
    const is_adopted = param.is_adopted;
    const memo = param.memo;
    let sql = "UPDATE " + this.table + " SET"+
    " IS_ADOPTED='" + is_adopted +
    "', MEMO='"+ memo +
    "' WHERE ROWKEY='" + rowkey+ "'";
    const result = await this.db.executeSql(sql);
    if (result.rowsAffected === 1) {
      this.res.send({errorCode: 0});
    } else {
      this.res.send({errorCode: -1});
    }
  }
}

export default Tips;
