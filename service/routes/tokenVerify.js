import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();
import appConfig from '../../config/application';

// 用户操作的路由;
router.use ('/', function (req, res, next) {  
  let handler = req.path.split('/').pop();
  if (handler === 'login' || handler === 'import' || handler === 'getObjByTile') {
    next('route');
  } else {
    let token = req.headers['x-access-token'] || req.query.token || req.body.token;
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
