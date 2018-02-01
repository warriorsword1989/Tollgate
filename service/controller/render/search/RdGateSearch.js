import Search from './Search';
import MercatorProjection from '../../../MercatorProjection';
import { changeResult } from '../../../Util';
import ConnectOracle from '../../../oracle/connectOracle';

class RdGateSearch extends Search{
  constructor(connection){
    super(connection);
    this.db = new ConnectOracle();
  }

  async getByTileWithGap(x, y, z, gap){
    const wkt = MercatorProjection.getWktWithGap(x, y, z, 0);

    const sql = "WITH TMP1 AS (SELECT (A.GEOMETRY.get_wkt()) as GEOMETRY, A.NODE_PID FROM RD_NODE A, RD_TOLLGATE B WHERE SDO_RELATE(A.GEOMETRY, SDO_GEOMETRY(:wkt, 8307), 'mask=anyinteract') = 'TRUE' AND A.NODE_PID = B.NODE_PID AND A.U_RECORD != 2) SELECT T.PID, T.TYPE, TMP1.GEOMETRY AS GEOMETRY FROM RD_TOLLGATE T, TMP1 WHERE T.NODE_PID = TMP1.NODE_PID AND T.U_RECORD != 2";

    const result = await this.connection.executeSql(sql, {wkt: wkt});

    const px = MercatorProjection.tileXToPixelX(x);

    const py = MercatorProjection.tileYToPixelY(y);

    const resultData = changeResult(result);
    let dataArray = [];
    for(let i = 0; i< resultData.length; i++){
      const tollIndexSql = "SELECT * FROM SC_TOLL_INDEX WHERE TOLL_PID = " + parseInt(resultData[i].pid, 10);
      const tollIndexResult = await this.db.executeSql(tollIndexSql);
      const resultTollIndexData = changeResult(tollIndexResult);
      let snapShot = {
        g: MercatorProjection.coord2Pixel(resultData[i].geometry, px, py, z),
        t: 42,
        i: parseInt(resultData[i].pid, 10),
        m: {}
      };
      snapShot.m.a = parseInt(resultData[i].type, 10);
      snapShot.m.b = resultTollIndexData.length === 0 ? null : resultTollIndexData[0].toll_static_state;
      snapShot.m.c = resultTollIndexData.length === 0 ? null : resultTollIndexData[0].toll_dynamic_state;
      dataArray.push(snapShot);
    }

    return dataArray;
  }
}

export default RdGateSearch
