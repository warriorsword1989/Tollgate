import connectOracle from '../../oracle/connectOracle';
import logger from '../../config/logs';

class InfoData {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.table = 'SC_TOLL_INFO';
    this.db = new connectOracle();
  }
  async getInfoData() {
    const param = JSON.parse(this.res.req.query.parameter);
    let errorMess = '';
    for (let i = 0; i < param.info.length; i++) {
      let sql = "INSERT INTO "+ this.table +" (INFO_INTEL_ID, INFO_CODE, ADMIN_CODE, URL, PUBLIC_TIME," +
        "NEWS_TIME, INFO_CONTENT, COMPLETE, MEMO) VALUES('" + param.info[i].infoIntelId + "','" + param.info[i].infoCode
        + "','" + param.info[i].adminCode + "','" + param.info[i].url + "','" + param.info[i].publicTime + "','" + param.info[i].newsTime
        + "','" + param.info[i].infoContent + "','" + param.info[i].complete + "','" + param.info[i].memo + "')";
      console.log(sql);
      try {
        let result = await this.db.executeSql(sql);
        // logger.debug("importInfo"+ result.rows.toString());
      } catch(err) {
        errorMess += err;
      }
    }
    this.res.send({
      errorCode: 0,
      data: errorMess
    });
  }
}

export default InfoData;
