import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class RdLinkSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "with tmp1 as"
      + " (select l.LANE_NUM,"
      + "         l.link_pid,"
      + "         l.direct,"
      + "         l.kind,"
      + "         l.special_traffic,"
      + "         l.function_class,"
      + "         l.s_node_pid,"
      + "         l.e_node_pid,"
      + "         l.length,"
      + "         l.imi_code,"
      + "         l.geometry"
      + "    from rd_link l"
      + "   where sdo_relate(l.geometry,sdo_geometry(:wkt,8307),"
      + "                    'mask=anyinteract+contains+inside+touch+covers+overlapbdyintersect') = 'TRUE'"
      + "     and l.u_record != 2),"
      + " tmp2 as"
      + " (select /*+ index(a) */"
      + "   a.link_pid, listagg(a.type, ';') within group(order by a.link_pid) limits"
      + "    from rd_link_limit a, tmp1 b"
      + "   where a.u_record != 2"
      + "     and a.link_pid = b.link_pid"
      + "   group by a.link_pid),"
      + " tmp3 as"
      + " (select /*+ index(a) */"
      + "   a.link_pid,"
      + "   listagg(a.form_of_way, ';') within group(order by a.link_pid) forms"
      + "    from rd_link_form a, tmp1 b"
      + "   where a.u_record != 2"
      + "     and a.link_pid = b.link_pid"
      + "   group by a.link_pid)"
      + " select /*+ordered*/a.*, b.limits, c.forms, d.name, e.scenario, f.is_plan_selected"
      + "  from tmp1 a,"
      + "       tmp2 b,"
      + "       tmp3 c,"
      + "       link_edit_pre e,"
      + "       data_plan f,"
      + "       (select /*+ index(b) */"
      + "         b.link_pid, c.name"
      + "          from rd_link_name b, rd_name c"
      + "         where b.name_groupid = c.name_groupid"
      + "           and b.name_class = 1"
      + "           and b.seq_num = 1"
      + "           and b.u_record != 2) d"
      + " where a.link_pid = b.link_pid(+)"
      + "   and a.link_pid = c.link_pid(+)"
      + "   and a.link_pid = d.link_pid(+)"
      + "   and a.link_pid = e.pid(+)"
      + "   and a.link_pid = f.pid"
      + "   and f.data_type = 2"
      + "   and f.task_id = :2";


    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {};
      snapShot.a = resultData[i].linkpids;
      snapShot.b = resultData[i].node_forms;
      snapShot.c = resultData[i].kind;
      snapShot.g = MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z);
      dataArray.push(snapShot);
    }

    console.log(dataArray);
    return dataArray;
  }
}

export default RdLinkSearch
