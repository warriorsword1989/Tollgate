import express from 'express';
import http from 'http';
import path from 'path';
import fastXmlParser from 'fast-xml-parser';
import Jimp from 'jimp';
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
      let xmlJson = fastXmlParser.parse(body);
      let count = 0;
      let photoObj = {};
      photoObj.properties = JSON.parse(new Buffer(xmlJson.CellSet.Row.Cell[0], 'base64').toString());
      
      function setWaterMark (image) {
        count++;
        let metadata = image.bitmap;
        let topPos = Math.floor(Math.random() * metadata.height);
        let leftPos = Math.floor(Math.random() * metadata.width);
        topPos = topPos > metadata.height - 34 ? metadata.height - 34 : topPos;
        leftPos = leftPos > metadata.width - 234 ? metadata.width - 234 : topPos;
        Jimp.read(path.join(__dirname, '../images/logo.png'))
          .then(waterImage => {
            image.composite(waterImage, leftPos, topPos); 
            if (count < 5) {
              setWaterMark(image);
            } else {
              image.getBuffer(Jimp.MIME_JPEG, (err, bufferRes) => {
                if (err) throw new Error(err);
                photoObj.imageUrl = bufferRes.toString('base64');
                res.send(photoObj);
              });
            }
          });
      }
      Jimp.read(new Buffer(xmlJson.CellSet.Row.Cell[1], 'base64'))
        .then(image => {
          setWaterMark(image);
        }).catch(err => {
          throw new Error(err);
        });
    })

    httpRes.on('error', function(e) {
      next(e);
    });
  });
});


export default router;
