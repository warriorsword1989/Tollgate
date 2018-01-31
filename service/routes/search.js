import express from 'express';
import TollData from '../controller/search/searchTollGateData';
import LinkData from '../controller/search/serachLinkData';
const router = express.Router ();

// 用户操作的路由;
router.get ('/getSearchData', function (req, res, next) {
  "use strict";
  try {
    if (req.query.type === 0) {
      let LinkDataManager = new LinkData(req, res, next);
      LinkDataManager['getLinkSearchData'] ();
    } else {
      let TollDataManager = new TollData(req, res, next);
      TollDataManager['getTollSearchData'] ();
    }
  } catch (error) {
    next (error);
  }
});

export default router;
