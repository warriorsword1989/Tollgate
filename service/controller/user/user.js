import jwt from 'jsonwebtoken';
import connectOracle from '../../oracle/connectOracle';
import appConfig from '../../../config/application';
import { changeResult } from '../../Util';


class User {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  /**
   * 用户登陆
   */
  async login() {
    let queryObj = JSON.parse(this.req.body.parameter);
    let sql = "SELECT " +
      "user_id, user_real_name, user_nick_name, user_email, user_phone " +
      "FROM USER_INFO " +
      "WHERE " +
      "USER_REAL_NAME = '" + queryObj.userName + "' AND USER_PASSWORD='" + queryObj.userPwd + "'";
    console.log(sql);
    let result = await connectOracle.executeSql (sql);
    let resultData = changeResult (result);
    if (resultData.length) {
      // 生成token
      let token = jwt.sign (
        {data: {name: queryObj.userName, password: queryObj.userPwd}},
        appConfig.secret, {expiresIn: 60 * 60 * 24});
      return this.res.json ({errorCode: 0, data: resultData, token: token});
    } else {
      return this.res.json ({errorCode: -1, message: '用户名/密码错误'});
    }
  }
}

export default User;
