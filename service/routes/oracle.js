import express from 'express';
import Captchas from '../controller/login'
import InfoData from '../controller/info/infoImport'

const router = express.Router();
router.get('/getData',Captchas.getCaptchas);
router.get('/import',InfoData.getInfoData);

export default router;
