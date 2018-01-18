import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class RwLinkSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "select a.link_pid, a.color, a.s_node_pid ,a.e_node_pid, b.name, (a.GEOMETRY.get_wkt()) as GEOMETRY from rw_link a, (select /*+ index(b) */ b.link_pid, c.name from rw_link_name b, rd_name c where b.name_groupid = c.name_groupid and b.u_record != 2) b  where a.u_record != 2 and a.link_pid = b.link_pid(+) and sdo_within_distance(a.geometry, sdo_geometry(:wkt, 8307), 'DISTANCE=0') = 'TRUE'";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    console.log(sql);
    console.log(wkt);

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 14,
        i: parseInt(resultData[i].link_pid, 10),
        m: {}
      };
      snapShot.m.a = resultData[i].name;
      snapShot.m.b = resultData[i].color;
      snapShot.m.c = parseInt(resultData[i].s_node_pid, 10);
      snapShot.m.d = parseInt(resultData[i].e_node_pid, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default RwLinkSearch
