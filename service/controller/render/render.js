import connectRenderObj from '../../oracle/connectRenderObj';
import connectTipObj from '../../oracle/connectRenderTip';
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
    const self = this;
    const param = JSON.parse(this.req.query.parameter);
    const types = param.types;
    const data = {};
    const promises = this._createPromises(types, param);
    Promise.all(promises)
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          data[res[i].type] = res[i].data;
        }
        self.res.send({
          errcode: 0,
          data: data,
          errmsg: 'success'
        });
      });
  }

  _createPromises(types, param) {
    const promises = [];
    for (let i = 0; i < types.length; ++i) {
      const promise = this._createAjaxPromise(types[i], param);
      promises.push(promise);
    }

    return promises;
  }

   _createAjaxPromise(type, param) {
    const searchFactory =  new SearchFactory(connectRenderObj);
    const promise = new Promise(async function (resolve, reject) {
      const objSearch = searchFactory.createSearch(type);
      if (objSearch) {
        const result  = await objSearch.getByTileWithGap(param.x, param.y, param.z, 0);
        resolve({
            data: result,
            type: type
          });
      } else {
        reject({
          data: [],
          type: type
        });
      }
    });

    return promise;
  }

  async getTipsByTile() {
    const self = this;
    const param = JSON.parse(this.req.query.parameter);
    const types = param.types;
    const data = [];
    const promises = this._createTipPromises(types, param);
    Promise.all(promises)
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].data.length > 0) {
            data.push(res[i].data);
          }
        }
        self.res.send({
          errcode: 0,
          data: data,
          errmsg: 'success'
        });
      });
  }

  _createTipPromises(types, param) {
    const promises = [];
    for (let i = 0; i < types.length; ++i) {
      const promise = this._createTipAjaxPromise(types[i], param);
      promises.push(promise);
    }

    return promises;
  }

  _createTipAjaxPromise(type, param) {
    const searchFactory =  new SearchFactory(connectTipObj);
    const promise = new Promise(async function (resolve, reject) {
      const objSearch = searchFactory.createSearch(type);
      if (objSearch) {
        const result  = await objSearch.getByTileWithGap(param.x, param.y, param.z, 0);
        resolve({
          data: result,
          type: type
        });
      } else {
        reject({
          data: [],
          type: type
        });
      }
    });

    return promise;
  }
}

export default Render;
