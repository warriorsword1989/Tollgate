import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class AdAdminSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "select a.region_id,(a.GEOMETRY.get_wkt()) as GEOMETRY,a.admin_type from ad_admin a where sdo_relate(a.geometry, sdo_geometry(:wkt, 8307), 'mask=anyinteract') = 'TRUE' and a.u_record != 2";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 15,
        i: parseInt(resultData[i].region_id, 10),
        m: {}
      };
      snapShot.m.c = parseInt(resultData[i].admin_type, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default AdAdminSearch
