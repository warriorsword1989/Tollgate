import express from 'express';
import Captchas from '../controller/login'

const router = express.Router();
router.get('/getData',Captchas.getCaptchas);

export default router;