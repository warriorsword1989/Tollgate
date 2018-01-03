import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();
import appConfig from '../../config/application';

// 用户操作的路由;
router.use ('/', function (req, res, next) {
  let token = req.headers['x-access-token'];
  if (req.method === 'POST') {
    token = JSON.parse(req.body.parameter).token;
  } else if (req.method === 'GET') {
    token = JSON.parse(req.query.parameter).token;
  } else {
    token = null;
  }
  let handler = req.path.split('/').pop();
  if (handler === 'login') {
    next('route');
  } else {
    if (token) {
      jwt.verify(token, appConfig.secret, function(err, decoded) {
        if (err) {
          return res.json({ errorCode: -1, message: err.message });
        } else {
          // 给系统写入登陆用户信息;
          let userName = decoded.data.name;
          next('route');
        }
      });
    } else {
      // 如果没有token，则返回错误
      return res.status (403).send ({errorCode: -1, message: '缺少token!'});
    }
  }
});

export default router;
