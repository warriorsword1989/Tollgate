import express from 'express';
import User from '../controller/user/user'
const router = express.Router ();

// 用户操作的路由;
router.post ('/login', function (req, res, next) {
  "use strict";
  try {
    let userManager = new User(req, res, next);
    userManager.login ();
  } catch (error) {
    next (error);
  }
});

// 用户操作的路由;
router.get ('/find', function (req, res, next) {
  "use strict";
  console.log('find')
});

export default router;
