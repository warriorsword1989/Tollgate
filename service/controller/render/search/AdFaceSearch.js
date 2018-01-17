import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class AdFaceSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "select a.face_pid, to_char(a.geometry.get_wkt()) as geometry, a.region_id from ad_face a where a.u_record != 2 and sdo_within_distance(a.geometry, sdo_geometry(:wkt, 8307), 'DISTANCE=0') = 'TRUE'";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 13,
        i: parseInt(resultData[i].face_pid, 10),
        m: {}
      };
      snapShot.m.a = parseInt(resultData[i].region_id, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default AdFaceSearch
