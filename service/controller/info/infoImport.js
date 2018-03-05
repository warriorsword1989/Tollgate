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
    let errorMess = '';
    let errorCode = 0;
    try {
      const param = JSON.parse(this.res.req.query.parameter);
      const myDate = new Date();
      const year = myDate.getFullYear();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      if (month < 10) {
        month = '0' + month.toString();
      } else {
        month = month.toString();
      }
      if (day < 10) {
        day = '0' + day.toString();
      } else {
        day = day.toString();
      }
      const publicTime = year.toString() + month + day;
      const memo = "";
      const complete = "1";
      for (let i = 0; i < param.infos.length; i++) {
        let sql = "INSERT INTO "+ this.table +" (INFO_INTEL_ID, INFO_CODE, ADMIN_CODE, URL, PUBLIC_TIME," +
          "NEWS_TIME, INFO_CONTENT, COMPLETE, MEMO) VALUES('" + param.infos[i].infoIntelId + "','" + param.infos[i].infoCode
          + "','" + param.infos[i].adminCode + "','" + param.infos[i].url + "','" + publicTime + "','" + param.infos[i].newsTime
          + "','" + param.infos[i].infoContent + "','" + complete + "','" + memo + "')";
        let result = await this.db.executeSql(sql);
      }
    } catch (err) {
      errorCode = -1;
      errorMess += err;
    }
    this.res.send({
      errorCode: errorCode,
      data: errorMess
    });
  }
  async postInfoData() {
    let errorMess = '';
    let errorCode = 0;
    try {
      const param = JSON.parse(this.req.body.parameter);
      const myDate = new Date();
      const year = myDate.getFullYear();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      if (month < 10) {
        month = '0' + month.toString();
      } else {
        month = month.toString();
      }
      if (day < 10) {
        day = '0' + day.toString();
      } else {
        day = day.toString();
      }
      const publicTime = year.toString() + month + day;
      const memo = "";
      const complete = "1";
      for (let i = 0; i < param.infos.length; i++) {
        let sql = "INSERT INTO "+ this.table +" (INFO_INTEL_ID, INFO_CODE, ADMIN_CODE, URL, PUBLIC_TIME," +
          "NEWS_TIME, INFO_CONTENT, COMPLETE, MEMO) VALUES('" + param.infos[i].infoIntelId + "','" + param.infos[i].infoCode
          + "','" + param.infos[i].adminCode + "','" + param.infos[i].url + "','" + publicTime + "','" + param.infos[i].newsTime
          + "','" + param.infos[i].infoContent + "','" + complete + "','" + memo + "')";
        let result = await this.db.executeSql(sql);
      }
    } catch (err) {
      errorCode = -1;
      errorMess += err;
    }
    this.res.send({
      errorCode: errorCode,
      data: errorMess
    });
  }
}

export default InfoData;
