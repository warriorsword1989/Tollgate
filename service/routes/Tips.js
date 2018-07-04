import express from 'express';
import http from 'http';
import path from 'path';
import fastXmlParser from 'fast-xml-parser';
import images from 'images';
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

// 如果桥梁隧道全部删除;
router.get ('/queryTollGateByBridge', function (req, res, next) {
  "use strict";
  try {
    let TollGate = new TollGateCtrl(req, res, next);
    TollGate['getTollGateByBridgeName'] ();
  } catch (error) {
    next (error);
  }
});

// 查询照片;
router.get ('/photo', function (req, res, next) {
  "use strict";
  return http.get(`${req.query.url}/${req.query.rowKey}`, httpRes => {
    let body = '';
    httpRes.setEncoding('binary');
    httpRes.on('data', function(chunk) {
      body += chunk;
    })
    httpRes.on('end', function() {
      let result = fastXmlParser.validate(body);
      if(!result) throw new Error(result.err);
      let xmlJson = fastXmlParser.parse(body)
      let photoObj = {};
      photoObj.properties = JSON.parse(new Buffer(xmlJson.CellSet.Row.Cell[0], 'base64').toString());
      let sourceImg = images(new Buffer(xmlJson.CellSet.Row.Cell[1], 'base64'));
      let waterImg = images(path.join(__dirname, '../images/logo.png'));
      // 比如放置在右下角，先获取原图的尺寸和水印图片尺寸
      const sWidth = sourceImg.width();
      const sHeight = sourceImg.height();
      const wmWidth = waterImg.width();
      const wmHeight = waterImg.height();
      // 设置绘制的坐标位置，右下角距离 10px
      let imageBuffer = images(sourceImg)
        .draw(waterImg, 10, 10)
        .draw(waterImg, sWidth - wmWidth - 10, 10)
        .draw(waterImg, (sWidth - wmWidth)/2, (sHeight - wmHeight)/2)
        .draw(waterImg, 10, sHeight - wmHeight - 10)
        .draw(waterImg, sWidth - wmWidth - 10, sHeight - wmHeight - 10)
        .encode("jpg", {operation:50});
      photoObj.imageUrl = imageBuffer.toString('base64');
      res.send(photoObj);
    })
    httpRes.on('error', function(e) {
      next(e);
    });
  });
});


export default router;
