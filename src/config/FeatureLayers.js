const featureLayers = {
    AdAdmin: {
        name: '行政区划代表点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADADMIN',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    AdFace: {
        name: '行政区划面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    AdLink: {
        name: '行政区划组成线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLink: {
        name: '道路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 1
        }
    },
    RdNode: {
        name: '道路点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    RdTollgate: {
        name: '收费站',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTOLLGATE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RwLink: {
        name: '铁路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RWLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    }
};

export default featureLayers;
