import ConnectSearchOracle from '../../oracle/connectSearchOracle';
import { changeResult } from '../../Util';

class TollData {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.db = new ConnectSearchOracle();
  }

  async getTollSearchData() {
    const param = this.req.query;
    const searchText = param.searchText;
    const isId = param.isId;
    const systemId = param.systemId;
    let sql = "SELECT t.pid, tn.name , to_char(rn.geometry.get_wkt()) as geometry FROM RD_TOLLGATE T, RD_TOLLGATE_NAME TN, RD_NODE RN WHERE T.PID = TN.PID AND T.NODE_PID = RN.NODE_PID AND TN.LANG_CODE='CHI' AND ";
    if (parseInt(isId, 10) === 0) {
      sql = sql + `T.SYSTEM_ID = ${systemId} AND tn.name LIKE '%${searchText}%'`;
    } else {
      sql = sql + `T.SYSTEM_ID = ${systemId} AND t.pid = ${searchText}`;
    }
    console.log(sql);
    const result = await this.db.executeSql(sql);
    const resultData = changeResult(result);
    this.res.send({
      errorCode: 0,
      data: resultData
    });
  }
}

export default TollData;
