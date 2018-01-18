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
        sourceUrl: appConfig.serviceUrl + '/tollgate/render/getTipsByTile?',
        parsor: FM.mapApi.render.data.Tip,
        type: 'classical',
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        requestParameter: {
            gap: 10,
            types: []
        }
    }
};

export default sourceConfig;
