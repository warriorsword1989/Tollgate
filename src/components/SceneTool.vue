<template>
  <div class="fm-panel sceneLayerPanel">
    <div class="header">
      <div class="title">
            <span>
                {{currentScene.name}}
            </span>
      </div>
    </div>
    <div class="content">
      <div class="sceneTitle">
        <span style="font-weight: 700">常规图层</span>
      </div>
      <ul class="two-column">
        <li v-for="(item,index) in　featureLayers">
          <input class="fm-control" :id="item.id" @click="toggleLayer(item)" v-model="item.checked"
                 type="checkbox"/>
          <label :for="item.id">
            {{item.name}}
          </label>
        </li>
      </ul>
      <div class="sceneTitle">
        <span style="font-weight: 700">Tips图层</span>
      </div>
      <ul class="two-column">
        <li v-for="(item,index) in　tipLayers">
          <input class="fm-control" :id="item.id" @click="toggleLayer(item)" v-model="item.checked"
                 type="checkbox"/>
          <label :for="item.id">
            {{item.name}}
          </label>
        </li>
      </ul>
      <div class="sceneTitle">
        <span style="font-weight: 700">背景图层</span>
      </div>
      <ul>
        <li v-for="(item,index) in　backLayers">
          <input class="fm-control" :id="item.id" name="backgroundLayers"
                 :checked="item.id === visibleBackgroundLayerId" @click="toggleBackgroundLayer(item)" type="radio"/>
          <label :for="item.id">
            {{item.name}}
          </label>
        </li>
      </ul>
      <div class="sceneTitle">
        <span style="font-weight: 700">参考图层</span>
      </div>
      <ul>
        <li v-for="(item,index) in　overLayers">
          <input class="fm-control" :id="item.id" @click="toggleOverlayLayer(item)"
                 v-model="item.checked" type="checkbox"/>
          <label :for="item.id">
            {{item.name}}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scene-tool",
    data() {
      const sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
      const sourceCtrl = fastmap.mapApi.source.SourceController.getInstance();
      const leafletMap = sceneCtrl.getLeafletMap();
      return {
        layers: sceneCtrl.getLayers(),
        sceneCtrl: sceneCtrl,
        sourceCtrl: sourceCtrl,
        leafletMap: leafletMap,
        currentScene: sceneCtrl.getCurrentScene(),
        featureLayers: [],
        backLayers: [],
        overLayers: [],
        tipLayers: [],
        sceneLayers: sceneCtrl.getSceneLayers(),
        visibleBackgroundLayerId: null
      }
    },
    methods: {
      getSceneLayer: function (layer) {
        for (let i = 0, len = this.sceneLayers.length; i < len; i++) {
          if (this.sceneLayers[i].id === layer.id) {
            return this.sceneLayers[i];
          }
        }
        return null;
      },
      toggleLayer: function (layer) {
        if (!layer.checked) {
          const sceneLayer = this.getSceneLayer(layer);

          if (sceneLayer) {
            sceneLayer.setVisible();
            this.sceneCtrl.refreshMap();
          } else {
            layer.setVisible(); //  专门针对，初始化时，道路标注和grid子任务中fc预处理tips的visible为false的情况
            this.sceneCtrl.addToScene(layer);
          }
        } else {
          this.sceneCtrl.removeFromScene(layer.id);
        }
      },
      resetLayerChecked: function () {
        for (let i = 0; i < this.layers.length; i++) {
          this.layers[i].checked = this.sceneCtrl.isLayerLoaded(this.layers[i].id);
          if (this.layers[i].label === 'background' && this.layers[i].checked) {
            this.visibleBackgroundLayerId = this.layers[i].id;
          }
        }
      },
      toggleBackgroundLayer: function (layer, event) {
        if (layer.id === this.visibleBackgroundLayerId) {
          this.sceneCtrl.removeFromBackground(layer.id);
          this.visibleBackgroundLayerId = null;
        } else {
          if (this.visibleBackgroundLayerId) {
            this.sceneCtrl.removeFromBackground(this.visibleBackgroundLayerId);
          }
          this.sceneCtrl.addToBackground(layer);
          this.visibleBackgroundLayerId = layer.id;
        }
      },
      toggleOverlayLayer: function (layer) {
        if (!layer.checked) {
          this.sceneCtrl.addToOverlay(layer);
        } else {
          this.sceneCtrl.removeFromOverlay(layer.id);
        }
      }
    },
    mounted: function () {
      this.resetLayerChecked();
      this.featureLayers = this.sceneCtrl.getLayersByLabel('feature');
      this.backLayers = this.sceneCtrl.getLayersByLabel('background');
      this.overLayers = this.sceneCtrl.getLayersByLabel('overlay');
      this.tipLayers = this.sceneCtrl.getLayersByLabel('tip');
    }
  }
</script>

<style scoped>
  .sceneLayerPanel ul {
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 0;
  }

  .sceneLayerPanel ul > li {
    list-style-type: none;
    line-height: 30px;
    padding-left: 10px;
  }

  .sceneLayerPanel ul > li label {
    color: #182848;
    cursor: pointer;
  }

  .sceneLayerPanel ul > li input {
    cursor: pointer;
  }

  .sceneLayerPanel ul > li:hover > label {
    color: #636ef5;
  }

  .sceneLayerPanel ul.sceneLayers {
    height: 160px;
    overflow-y: auto;
  }

  .sceneLayerPanel div.sub-header {
    border-bottom: 1px solid #b8cdf7;
    border-top: 1px solid #b8cdf7;
    background-color: #eff0fe;
    padding: 0px 10px;
    height: 70px;
    line-height: 34px;
  }

  .sceneLayerPanel div.sub-header > .glyphicon {
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
  }

  .sceneLayerPanel ul.two-column > li {
    width: 46%;
    display: inline-block;
    vertical-align: top;
  }

  .sceneLayerPanel ul.three-column > li {
    width: 29%;
    display: inline-block;
  }

  .sceneLayers .operator {
    display: inline-block;
  }

  .sceneLayers .operator > i {
    cursor: pointer;
    padding: 3px 5px
  }

  .sceneLayers .operator > i:hover {
    background-color: #636ef5;
  }

  .sceneTitle {
    background-color: #eff0fe;
    width: 100%;
    height: 40px;
    padding-left: 10px;
    line-height: 40px;
    font-size: 14px;
    color: #636ef5;
    border-top: 1px #d2e1ff solid;
  }

  .sceneTitle > span {
    font-weight: 700;
  }
</style>
