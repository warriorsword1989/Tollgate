import express from 'express';
import http from 'http';
import Tips from '../controller/tips/queryTollTips';
import TollGateCtrl from '../controller/tips/metaTollGateController';
const router = express.Router ();

// 用户操作的路由;
router.get ('/getTollGateTipList', function (req, res, next) {
  "use strict";
  try {
    let TipsManager = new Tips(req, res, next);
    TipsManager['getTollGateTipList'] ();
  } catch (error) {
    next (error);
  }
});

// 根据rowkey查询tips;
router.get ('/getTollGateTip', function (req, res, next) {
  "use strict";
  try {
    let TipsManager = new Tips(req, res, next);
    TipsManager['getTollGateTip'] ();
  } catch (error) {
    next (error);
  }
});

// 更新tips;
router.post ('/updateTollGateTip', function (req, res, next) {
  "use strict";
  try {
    let TipsManager = new Tips(req, res, next);
    TipsManager['updateTollGateTip'] ();
  } catch (error) {
    next (error);
  }
});


// 根据tollgate的pid查询;
router.get ('/getTollGate', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['getTollGate'] ();
  } catch (error) {
    next (error);
  }
});

// 根据tollgate的pid查询;
router.get ('/getBtName', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['getBtName'] ();
  } catch (error) {
    next (error);
  }
});

// 根据tollgate的pid查询名称;
router.get ('/getTollName', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['getTollName'] ();
  } catch (error) {
    next (error);
  }
});

// 查询最大值
router.get ('/getMaxId', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['getHolidayMax'] ();
  } catch (error) {
    next (error);
  }
});

// 更新tollgate;
router.post ('/updateTollGate', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['updateTollGate'] ();
  } catch (error) {
    next (error);
  }
});

// 如果货车或客车类型全部删除;
router.post ('/deleteCarTruckTollGate', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['deleteCarTruckTollGate'] ();
  } catch (error) {
    next (error);
  }
});

// 如果桥梁隧道全部删除;
router.post ('/deleteRdLinkBt', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['deleteRdLinkBt'] ();
  } catch (error) {
    next (error);
  }
});

// 查询照片;
router.get ('/photo', function (req, res, next) {
  "use strict";
  return http.get(`${req.query.url}/${req.query.rowKey}`, httpRes => {
    let body = '';
    httpRes.on('data', function(chunk) {
      httpRes.setEncoding('utf8'); 
      body += chunk;
    })
    httpRes.on('end', function() {
      res.send(body);
    })
    httpRes.on('error', function(e) {
      next(e);
    });
  });
});


export default router;
