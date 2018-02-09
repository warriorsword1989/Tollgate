import '../../lib/fastmap.min';
import '../../lib/mapApi.min';
import '../../lib/dataApi.min';
import '../../lib/renderApi.min';
import featureLayers from '../config/FeatureLayers';
import referenceLayers from '../config/ReferenceLayers';
import scenes from '../config/Scenes';
import sourceConfig from '../config/SourceConfig';
import symbolsFile from '../config/SymbolsFile';
import tipLayers from '../config/TipLayers';
import { appUtil } from '../Application';
import '../uikits/tools/Tool';
import '../uikits/tools/MapTool';
import '../uikits/tools/PanTool';
import '../uikits/tools/selectTools/PointSelectTool';
import '../uikits/tools/selectTools/PolygonSelectTool';
import '../uikits/tools/selectTools/RectSelectTool';
import '../uikits/tools/ToolController';
import '../uikits/check/CheckConfig';
import '../uikits/check/CheckController';
import '../uikits/check/CheckEngine';
import '../uikits/check/CheckResult';
import '../uikits/check/CheckRule';
import '../uikits/common/EventTypes';
import '../uikits/config/Config';
import '../uikits/config/EditTool';
import '../uikits/config/Feature';
import '../uikits/config/ThematicFigure';
import '../uikits/config/Tip';
import '../uikits/config/Utility';
import '../uikits/controllers/EventController';
import '../uikits/controllers/FeatCodeController';
import '../uikits/controllers/HighRenderController';
import '../uikits/controllers/LayerController';
import '../uikits/controllers/LogMsgController';
import '../uikits/controllers/ObjectEditController';
import '../uikits/controllers/OutPutController';
import '../uikits/controllers/SelectController';
import '../uikits/controllers/ShapeEditorController';
import '../uikits/controllers/ToolTipsController';
import '../uikits/edit/shapeEdit/tools/ShapeTool';
import '../uikits/edit/shapeEdit/ShapeEditor';
import '../uikits/edit/topoEdit/TopoEditFactory';
import '../uikits/edit/topoEdit/TopoEditor';
import '../uikits/edit/topoEdit/CopyToLineTopoEditor';
import '../uikits/edit/Editor';
import '../uikits/edit/EditResult';
import '../uikits/edit/complexEdit/ComplexEditor';
import '../uikits/edit/complexEdit/results/CopyResult';
import '../uikits/edit/complexEdit/tools/ComplexTool';
import '../uikits/edit/complexEdit/tools/RectSelectTool';
import '../uikits/edit/complexEdit/tools/CopyTool';
import '../uikits/edit/relationEdit/RelationEditor';
import '../uikits/edit/relationEdit/tools/RelationTool';
import '../uikits/edit/relationEdit/tools/RectSelectTool';
import '../uikits/editControl/EditControl';
import '../uikits/editControl/EditControlFactory';
import '../uikits/editControl/complexControl/StartupToolControl';
import '../uikits/editControl/complexControl/CopyLineControl';
import '../uikits/editControl/selectControl/SelectControl';
import '../uikits/operation/Operation';
import '../uikits/operation/EditResultOperation';
import '../uikits/operation/OperationController';
import '../uikits/Util';

class MapInit {
  map = null;
  singletons = [];
  registSingletons = () => {
    this.singletons.push(fastmap.mapApi.MeshAlgorithm.getInstance());
    this.singletons.push(fastmap.mapApi.FeatureSelector.getInstance());
    this.singletons.push(fastmap.mapApi.GeometryTransform.getInstance());
    this.singletons.push(fastmap.mapApi.Proj4Transform.getInstance());
    this.singletons.push(fastmap.mapApi.TileRequestController.getInstance());
    this.singletons.push(fastmap.mapApi.FeedbackController.getInstance());
    this.singletons.push(fastmap.mapApi.geometry.GeometryAlgorithm.getInstance());
    this.singletons.push(fastmap.mapApi.scene.SceneController.getInstance());
    this.singletons.push(fastmap.mapApi.snap.SnapController.getInstance());
    this.singletons.push(fastmap.mapApi.source.SourceController.getInstance());
    this.singletons.push(fastmap.mapApi.symbol.GeometryFactory.getInstance());
    this.singletons.push(fastmap.mapApi.symbol.GeometryTransform.getInstance());
    this.singletons.push(fastmap.mapApi.symbol.ResourceFactory.getInstance());
    this.singletons.push(fastmap.mapApi.symbol.Transformation.getInstance());
    this.singletons.push(fastmap.uikit.Util.getInstance());
    this.singletons.push(fastmap.uikit.check.CheckController.getInstance());
    this.singletons.push(fastmap.uikit.complexEdit.ComplexEditor.getInstance());
    this.singletons.push(fastmap.uikit.relationEdit.RelationEditor.getInstance());
    this.singletons.push(fastmap.uikit.shapeEdit.ShapeEditor.getInstance());
    this.singletons.push(fastmap.uikit.topoEdit.TopoEditFactory.getInstance());
    this.singletons.push(fastmap.uikit.editControl.EditControlFactory.getInstance());
    this.singletons.push(fastmap.uikit.operation.OperationController.getInstance());
    this.singletons.push(fastmap.uikit.ToolController.getInstance());
    this.singletons.push(FM.mapApi.render.HighlightController.getInstance());
    this.singletons.push(FM.mapApi.render.IDHighlightController.getInstance());
    this.singletons.push(fastmap.mapApi.symbol.GetSymbolFactory());
  };
  destorySingletons = () => {
    for (var i = 0; i < this.singletons.length; ++i) {
      if (!this.singletons[i].destroy) {
        throw new Error('单例对象未提供destroy方法:' + this.singletons[i]);
      }
      this.singletons[i].destroy();
    }
  };
  initMap = () => {
    const options = {
      tileSize: 256,
      container: 'editorMap',
      center: [0, 0],
      zoom: 15
    };
    return new FM.mapApi.Map(options);
  };

  loadConfigs = () => {
    this.symbolFactory.loadSymbols(symbolsFile);
    this.sceneCtrl.setDefaultZoom({
      minZoom: 10,
      maxZoom: 21,
      minEditZoom: 15
    });
    this.sceneCtrl.loadLayers(referenceLayers);
    this.sceneCtrl.loadLayers(featureLayers, 'feature');
    this.sceneCtrl.loadLayers(tipLayers, 'tip');
    this.sceneCtrl.loadBackground(scenes.background);
    this.sceneCtrl.loadOverlay(scenes.overlay);
    this.sceneCtrl.loadScenes(scenes.scenes);
    this.sourceCtrl.loadConfig(sourceConfig);
  };
  initModules = map => {
    const leafletMap = map.getLeafletMap();
    this.featureSelector.setMap(leafletMap);
    this.toolCtrl.setMap(leafletMap);
    this.snapCtrl.setMap(leafletMap);
  };

  tagNames = {
    INPUT: true,
    BUTTON: true,
    TEXTAREA: true
  };
  keydown = event => {
    if (!this.tagNames.hasOwnProperty(event.target.tagName)) {
      this.toolCtrl.onKeyDown(event);
      // modified by chenx on 2017-8-31
      // 停止冒泡会导致hotkeys组件不可用
      // event.stopPropagation();
    }
  };
  keyup = event => {
    if (!this.tagNames.hasOwnProperty(event.target.tagName)) {
      this.toolCtrl.onKeyUp(event);
      // event.stopPropagation();
    }
  };
  click = event => {
    var targetClass = event.target.innerText;
    // 伪造一个ctrl+z/x事件
    var copyEvent = {};
    if (['撤销', '重做', '重置'].indexOf(targetClass) > -1) {
      if (targetClass === '撤销' || targetClass === '重做') {
        copyEvent.ctrlKey = true;
        copyEvent.key = targetClass === '撤销' ? 'z' : 'x';
      } else {
        copyEvent.ctrlKey = false;
        copyEvent.key = 'Escape';
      }
      this.toolCtrl.onKeyUp(copyEvent);
      event.stopPropagation();
    }
  };
  contextmenu = event => {
    event.preventDefault();
  };

  bindToolEvent = map => {
    const leafletMap = map.getLeafletMap();
    // 给工具绑定事件
    leafletMap.on('mousedown', this.toolCtrl.onMouseDown);
    leafletMap.on('mousemove', this.toolCtrl.onMouseMove);
    leafletMap.on('mouseup', this.toolCtrl.onMouseUp);

    // 将键盘事件绑定到body上，并根据event.target决定是否触发工具响应
    L.DomEvent.on(document.body, 'keydown', this.keydown);
    L.DomEvent.on(document.body, 'keyup', this.keyup);
    // 屏蔽掉默认的右键菜单
    L.DomEvent.on(leafletMap.getContainer(), 'contextmenu', this.contextmenu);
    // 绑定撤销与重置事件到toolcontrol;
    L.DomEvent.on(document.body, 'click', this.click);

    L.DomEvent.on(leafletMap.getContainer(), 'wheel', event => {
      this.toolCtrl.onWheel(event);
      event.stopPropagation();
    });
    // 阻止地图双击选中事件
    L.DomEvent.on(leafletMap.getContainer(), 'selectstart', event => {
      event.preventDefault();
    });
  };

  initialize = (point) => {
    this.highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    this.feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
    this.sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
    this.sourceCtrl = fastmap.mapApi.source.SourceController.getInstance();
    this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
    this.snapCtrl = fastmap.mapApi.snap.SnapController.getInstance();
    this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
    this.meshAlgm = fastmap.mapApi.MeshAlgorithm.getInstance();
    this.toolCtrl = fastmap.uikit.ToolController.getInstance();

    this.registSingletons();

    var map = this.initMap();

    this.map = map;

    window.map = map;

    this.sceneCtrl.setMap(map);

    this.loadConfigs();

    this.initModules(map);

    this.bindToolEvent(map);

    const mapLocation = appUtil.getSessionStorage('mapLocation');
    const zoom = map.getLeafletMap().getZoom();
    map.getLeafletMap().setView([mapLocation.point.lat, mapLocation.point.lng], mapLocation.zoom);

    map.getLeafletMap().on('moveend', function () {
      appUtil.setSessionStorage('mapLocation', {
        zoom: zoom,
        point: map.getLeafletMap().getCenter()
      })
    });

    this.toolCtrl.resetCurrentTool('PanTool', null, null);
  };
}
export default new MapInit();
