/**
 * Created by xujie3949 on 2017/1/11.
 */
const sourceConfig = {
    objSource: {
        sourceUrl: 'http://192.168.4.188:9700/service' + '/render/obj/getByTileWithGap?access_token=' + '0000042XJBOENUT40112D98D8C7E0954D51744E9BAC31957',
        parsor: FM.mapApi.render.data.Feature,
        type: 'classical',
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        requestParameter: {
            dbId: 69,
            gap: 10,
            types: []
        }
    },
    tipSource: {
        sourceUrl: 'http://192.168.4.188:9700/service' + '/render/tip/getByTileWithGap?access_token=' + '0000042XJBOENUT40112D98D8C7E0954D51744E9BAC31957',
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
