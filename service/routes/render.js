import express from 'express';
import Render from '../controller/render/render'
const router = express.Router ();

// 用户操作的路由;
router.get ('/getObjByTile', function (req, res, next) {
  "use strict";
  try {
    let RenderManager = new Render(req, res, next);
    RenderManager['getObjByTile'] ();
  } catch (error) {
    next (error);
  }
});

export default router;

