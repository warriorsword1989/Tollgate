import express from 'express';
import Info from '../controller/info/infoImport'
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

export default router;
