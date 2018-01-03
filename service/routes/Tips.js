import express from 'express';
import Tips from '../controller/tips/queryTollTips'
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

export default router;
