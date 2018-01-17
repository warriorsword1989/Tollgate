import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';

class RdGateSearch extends Search{
  constructor(connection){
    super(connection);
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "WITH TMP1 AS (SELECT to_char(A.GEOMETRY.get_wkt()) as GEOMETRY, A.NODE_PID FROM RD_NODE A, RD_TOLLGATE B WHERE SDO_RELATE(A.GEOMETRY, SDO_GEOMETRY(:wkt, 8307), 'mask=anyinteract') = 'TRUE' AND A.NODE_PID = B.NODE_PID AND A.U_RECORD != 2) SELECT T.PID, T.TYPE, TMP1.GEOMETRY AS GEOMETRY FROM RD_TOLLGATE T, TMP1 WHERE T.NODE_PID = TMP1.NODE_PID AND T.U_RECORD != 2";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 42,
        i: parseInt(resultData[i].pid, 10),
        m: {}
      };
      snapShot.m.a = parseInt(resultData[i].type, 10);
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default RdGateSearch
