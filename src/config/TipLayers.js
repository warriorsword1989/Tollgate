const tipLayers = {
    TipTollGate: {
        name: '收费站',
        type: 'vector',
        options: {
            source: 'tipSource',
            featureType: 'TIPTOLLGATE',
            serverFeatureType: '1107',
            render: FM.mapApi.render.renderer.TipRender,
            minZoom: 10,
            minEditZoom: 17
        }
    }
};

export default tipLayers;
