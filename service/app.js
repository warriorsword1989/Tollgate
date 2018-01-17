import express from 'express';
import bodyParser from 'body-parser';
// import history from 'connect-history-api-fallback';
import router from './routes';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, x-access-token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(express.static('./public'));

// 路由分发;
router(app);

// 处理 404
app.use('tollgate', function(req, res, next) {
  var err = new Error('没有对应的请求资源');
  err.status = 404;
  next(err);
});

// 异常处理
app.use(function(err, req, res, next) {
  res.status(500).send('出错啦:' + err.stack);
});

app.listen(8010);
console.log("服务已经启动： 端口为 8010");
