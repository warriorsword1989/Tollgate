import express from 'express';
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

export default router;
