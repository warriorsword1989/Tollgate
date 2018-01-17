import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class RdLinkSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "with tmp1 as (select LANE_NUM , link_pid,direct, kind,special_traffic,function_class, s_node_pid, e_node_pid,length,imi_code, geometry     from rd_link    where sdo_relate(geometry, sdo_geometry(:wkt, 8307), 'mask=anyinteract') =          'TRUE'      and u_record != 2), tmp2 as  (select /*+ index(a) */    a.link_pid, listagg(a.type, ';') within group(order by a.link_pid) limits     from rd_link_limit a, tmp1 b    where a.u_record != 2      and a.link_pid = b.link_pid    group by a.link_pid), tmp3 as  (select /*+ index(a) */    a.link_pid,    listagg(a.form_of_way, ';') within group(order by a.link_pid) forms     from rd_link_form a, tmp1 b    where a.u_record != 2      and a.link_pid = b.link_pid    group by a.link_pid) select a.LANE_NUM, a.link_pid, a.direct, a.kind, a.special_traffic, a.function_class, a.s_node_pid, a.e_node_pid, a.length, a.imi_code, to_char(a.geometry.get_wkt()) as GEOMETRY, b.limits, c.forms,d.name   from tmp1 a, tmp2 b, tmp3 c, (select /*+ index(b) */            b.link_pid, c.name             from rd_link_name b, rd_name c, tmp1 x           where b.link_pid = x.link_pid and b.name_groupid = c.name_groupid              and b.name_class = 1              and b.seq_num = 1 and b.u_record != 2) d  where a.link_pid = b.link_pid(+)    and a.link_pid = c.link_pid(+)    and a.link_pid = d.link_pid(+)";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 4,
        i: parseInt(resultData[i].link_pid, 10),
        m: {}
      };
      snapShot.m.a = parseInt(resultData[i].kind, 10);
      snapShot.m.b = resultData[i].name;
      snapShot.m.c = resultData[i].limits;
      snapShot.m.d = parseInt(resultData[i].direct, 10);
      snapShot.m.e = parseInt(resultData[i].s_node_pid, 10);
      snapShot.m.f = parseInt(resultData[i].e_node_pid, 10);
      snapShot.m.h = resultData[i].forms;
      snapShot.m.i = parseInt(resultData[i].function_class, 10);
      snapShot.m.j = parseInt(resultData[i].imi_code, 10);
      snapShot.m.k = parseFloat(resultData[i].length);
      snapShot.m.l = parseInt(resultData[i].special_traffic, 10);
      snapShot.m.m = parseInt(resultData[i].lane_num, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default RdLinkSearch
