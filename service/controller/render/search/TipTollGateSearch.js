import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class TipTollGateSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "select a.rowkey,(a.TOLL_LOCATION) as GEOMETRY,a.TOLL_NAME from SC_TOLL_TIPS_INDEX a where sdo_relate(a.TOLL_LOCATION, sdo_geometry(:wkt, 8307), 'mask=anyinteract') = 'TRUE'";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: '1107',
        i: resultData[i].rowkey,
        m: {}
      };
      snapShot.m.b = 3;
      snapShot.m.c = "0";
      snapShot.m.d = resultData[i].toll_name;
      snapShot.m.h = MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z);
      snapShot.m.k = 0;
      snapShot.m.l = 0;
      snapShot.m.n = 0;
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default TipTollGateSearch
