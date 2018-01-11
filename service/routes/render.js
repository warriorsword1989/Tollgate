import MercatorProjection from '../MercatorProjection';
import connectOracle from '../oracle/connectOracle';
import logger from '../config/logs';
import express from 'express';
import { changeResult } from '../Util';
import SearchFactory from '../search/SearchFactory'


const router = express.Router ();

router.get('/getObjByTile', async function(req, res, next) {
    "use strict";
    try {
        const param = JSON.parse(req.query.parameter);

        const types = param.types;
        const dataArray = [];
        const searchFactory =  new SearchFactory(connectOracle);


      const rdNodeSearch = searchFactory.createSearch("RDNODE");
      const result  = rdNodeSearch.getByTileWithGap(param.x, param.y, param.z, 0)
      dataArray.push(result);

      res.send({
        errorCode: 0,
        data: dataArray
      });
    } catch (error) {
        next (error);
    }
});

export default router;
