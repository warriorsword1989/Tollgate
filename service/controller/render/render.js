import connectRenderObj from '../../oracle/connectRenderObj';
import logger from '../../config/logs';
import { changeResult } from '../../Util';
import SearchFactory from './search/SearchFactory'

class Render {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async getObjByTile() {
    const param = JSON.parse(this.req.query.parameter);
    const types = param.types;
    const dataArray = [];
    const searchFactory =  new SearchFactory(connectRenderObj);
    for (let i = 0; i < types.length; i++) {
      const objSearch = searchFactory.createSearch(types[i]);
      if (objSearch) {
        const result  = await objSearch.getByTileWithGap(param.x, param.y, param.z, 0);
        dataArray.push(result);
      }
    }
    this.res.send({
      errorCode: 0,
      data: dataArray
    });
  }
}

export default Render;
