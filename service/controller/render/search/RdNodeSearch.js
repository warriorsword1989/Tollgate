import Search from './Search';
import MercatorProjection from '../MercatorProjection';
import { changeResult } from '../Util';

class RdnodeSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "WITH TMP1 AS (SELECT NODE_PID, KIND, GEOMETRY as GEOMETRY FROM RD_NODE WHERE SDO_RELATE(GEOMETRY, SDO_GEOMETRY(:wkt, 8307), 'mask=anyinteract') = 'TRUE' AND U_RECORD != 2), TMP2 AS (SELECT /*+ index(a) */ B.NODE_PID, LISTAGG(A.LINK_PID, ',') WITHIN GROUP(ORDER BY B.NODE_PID) LINKPIDS FROM RD_LINK A, TMP1 B WHERE A.U_RECORD != 2 AND (A.S_NODE_PID = B.NODE_PID OR A.E_NODE_PID = B.NODE_PID) GROUP BY B.NODE_PID), TMP3 AS (SELECT /*+ index(a) */ A.NODE_PID, LISTAGG(A.FORM_OF_WAY, ';') WITHIN GROUP(ORDER BY A.NODE_PID) NODE_FORMS FROM RD_NODE_FORM A, TMP1 B WHERE A.U_RECORD != 2 AND A.NODE_PID = B.NODE_PID GROUP BY A.NODE_PID) SELECT A.NODE_PID, A.KIND, to_char(A.GEOMETRY.get_wkt()) as GEOMETRY, B.LINKPIDS, C.NODE_FORMS FROM TMP1 A, TMP2 B, TMP3 C WHERE A.NODE_PID = B.NODE_PID(+) AND A.NODE_PID = C.NODE_PID";

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

export default RdnodeSearch
