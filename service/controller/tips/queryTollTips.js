import ConnectOracle from '../../oracle/connectOracle';
import logger from '../../config/logs';
import { changeResult } from '../../Util';

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
    const adminCode = param.adminCode;
    const tipsVersion = param.tipsVersion;
    const tollName = param.tollName;
    const updateStartTime = param.updateStartTime;
    const updateEndTime = param.updateEndTime;
    const isAdopted = param.isAdopted;
    let sql = "SELECT a.ROWKEY, a.TIPS_LIFECYCLE, a.PHOTO_ID, a.TOLL_NAME, a.TOLL_TYPE, to_char(a.TOLL_LOCATION.get_wkt()) as TOLL_LOCATION, a.ADMIN_CODE, a.TIPS_VERSION, a.UPDATE_TIME, a.TOLL_PNUM, a.TOLL_LOC, a.IS_ADOPTED, a.MEMO FROM " + this.table + " a WHERE ADMIN_CODE = '" + adminCode + "'";
    if (tipsVersion) {
      sql = sql + " AND upper(TIPS_VERSION) = '" + tipsVersion.toUpperCase() + "'";
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
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }

  async getTollGateTip() {
    const param = this.req.query;
    const rowkey = param.rowkey;
    console.log(param)
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
    const lifeCycle = param.tipsLifecycle;
    const memo = param.memo;
    let sql = "UPDATE " + this.table + " SET"+
    " TIPS_LIFECYCLE='" + lifeCycle +
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
