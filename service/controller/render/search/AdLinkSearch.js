import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class AdLinkSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "select a.link_pid, to_char(a.GEOMETRY.get_wkt()) as GEOMETRY, a.kind,  a.s_node_pid, a.e_node_pid from ad_link a where a.u_record != 2 and sdo_within_distance(a.geometry, sdo_geometry(:wkt, 8307), 'DISTANCE=0') = 'TRUE'";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 12,
        i: parseInt(resultData[i].link_pid, 10),
        m: {}
      };
      snapShot.m.a = parseInt(resultData[i].s_node_pid, 10);
      snapShot.m.b = parseInt(resultData[i].e_node_pid, 10);
      snapShot.m.c = parseInt(resultData[i].kind, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default AdLinkSearch
