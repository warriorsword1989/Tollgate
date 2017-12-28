import express from 'express';
import Captchas from '../controller/login'
import InfoData from '../controller/info/infoImport'
import Tips from '../controller/tips/queryTollTips'

const router = express.Router();
router.get('/getData',Captchas.getCaptchas);
router.get('/import',InfoData.getInfoData);
router.get('/tips/getTollGateTipList',Tips.getTollGateTipList);

export default router;
