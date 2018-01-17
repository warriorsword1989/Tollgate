/**
 * Created by xujie3949 on 2017/1/11.
 */
import { appConfig, appUtil } from '../Application';
const sourceConfig = {
    objSource: {
        sourceUrl: appConfig.serviceUrl + '/tollgate/render/getObjByTile?',
        parsor: FM.mapApi.render.data.Feature,
        type: 'classical',
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        requestParameter: {
            gap: 10,
            types: []
        }
    },
    tipSource: {
        sourceUrl: 'http://fs-road.navinfo.com/dev/trunk/service' + '/render/tip/getByTileWithGap?access_token=' + '000001A8JBSQHQMTDD91C4641C53ABB4D92B939B8B4BB9BC',
        parsor: FM.mapApi.render.data.Tip,
        type: 'classical',
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        requestParameter: {
            mdFlag: "d",
            gap: 10,
            types: [],
            workStatus: [0, 1, 2]
        }
    }
};

export default sourceConfig;
