import express from 'express';
import Info from '../controller/info/infoImport'
import QueryInfo from '../controller/info/queryInfo'
import User from '../controller/user/user';
const router = express.Router ();

// import操作的路由;
router.get ('/import', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new Info(req, res, next);
    InfoManager['getInfoData'] ();
  } catch (error) {
    next (error);
  }
});

router.post ('/import', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new Info(req, res, next);
    InfoManager['postInfoData'] ();
  } catch (error) {
    next (error);
  }
});

router.get ('/getTollGateInfoList', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new QueryInfo(req, res, next);
    InfoManager['getTollGateInfoList'] ();
  } catch (error) {
    next (error);
  }
});

router.get ('/getAdminLoc', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new QueryInfo(req, res, next);
    InfoManager['getAdminLoc'] ();
  } catch (error) {
    next (error);
  }
});

router.get ('/getInfoListByInfoCode', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new QueryInfo(req, res, next);
    InfoManager['getInfoListByInfoCode'] ();
  } catch (error) {
    next (error);
  }
});

router.get ('/updateInfoListByInfoIntelId', function (req, res, next) {
  "use strict";
  try {
    let InfoManager = new QueryInfo(req, res, next);
    InfoManager['updateInfoListByInfoIntelId'] ();
  } catch (error) {
    next (error);
  }
});

export default router;
