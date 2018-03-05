<template>
  <div class="mainMap">
    <!-- 左侧照片面板 -->
    <side-bar :side-bar-title="'照片详情'" :side-bar-icon="'el-icon-picture'" v-if="dataSource === 1">
      <photo-swiper slot="photoView" :image-list="dataModel.imageList"></photo-swiper>
      <photo-edit slot="dataView"></photo-edit>
    </side-bar>
    <!-- 地图 -->
    <div id="editorMap" class="map">
      <edit-tool class="toolsToolbar" v-bind:style="{right: rightPanelFlag ? '390px': '90px'}"></edit-tool>
      <div class="mapZoomBar" v-bind:style="{right: rightPanelFlag ? '360px': '60px'}">
        缩放等级：
        <span>{{zoom}}</span>
      </div>
    </div>
    <user-tool class="userToolbar" v-bind:style="{right: rightPanelFlag ? '350px': '50px'}"></user-tool>
    <div class="sceneToolbar" @click="openRightPanel()" v-bind:style="{right: rightPanelFlag ? '310px': '10px'}"><div></div></div>
    <div class="fm-layout-container right" v-if="rightPanelFlag" style="overflow: hidden">
      <scene-tool></scene-tool>
      <img class="right-float-close" @click="closeRightPanel()" src="../assets/toolIcon/icon/button-close-normal.png" />
    </div>
    <search-tool class="searchToolbar" v-bind:style="{right: rightPanelFlag ? '540px': '240px'}">
    </search-tool>
    <table-edit v-if="showDialog" :handle-flag="editFlag" @dialogClose="closeDialog"></table-edit>
  </div>
</template>


<script>
  import mapInit from './mapInit';
  import sideBar from './layout/sideBar';
  import photoEdit from './photoEdit/photoEdit';
  import photoSwiper from './photoEdit/photoSwiper';
  import tableEdit from './tableEdit/tabDiag';
  import { appUtil } from '../Application';
  import {getTipsPhoto} from '../dataService/api';
  import EditTool from './EditTool';
  import UserTool from './UserTool';
  import SceneTool from './SceneTool';
  import '../uikits/controllers/EventController';
  import SearchTool from './SearchTool';
  export default {
    name: 'mainMap',
    components: {
      SearchTool,
      SceneTool,
      UserTool,
      EditTool,
      photoEdit,
      photoSwiper,
      tableEdit,
      sideBar
    },
    data() {
      return {
        zoom: 15,
        leftWidth: '25%',
        editFlag: 'update',
        leftFloatArrow: false,
        showDialog: false,
        rightPanelFlag: false,
        dataSource: 1,
        dataModel: {
          uploadTime: '2012-10-7',
          sourceId: '111111',
          photoContent: '1212',
          version: '1.2.1',
          imageList: []
        },
        eventController: fastmap.uikit.EventController()
      }
    },
    computed: {},
    methods: {
      toggleLeftPanel: function (event) {
        this.leftFloatArrow = !this.leftFloatArrow;
      },
      closeDialog: function () {
        this.showDialog = false;
      },
      openRightPanel: function () {
        this.rightPanelFlag = true;
      },
      closeRightPanel: function () {
        this.rightPanelFlag = false;
      }
    },
    watch: {
      leftWidth: function (val) {
        console.log(val);
      },
    },
    mounted() {
      let _self = this;
      this.eventController.off('ObjectSelected');
      this.eventController.off('CHANGECOORDNITES');
      this.eventController.on('ObjectSelected',function(data) {
        if (data.features.length) {
          _self.showDialog = true;
          if (data.flag=='update') {
            _self.$store.commit('changeHandleFlag', 'update');
            _self.$store.commit('changeSelectedData', [data.features[0].properties]);
            _self.$store.commit('changeEditSelectedData', [data.features[0].properties.id]);
          } else if (data.flag=='insert') {
            let objs = [];
            data.features.forEach(item => {
              objs.push(item.properties);
            });
            _self.$store.commit('changeSelectedData', objs);
            let pids = [];
            data.features.forEach(item => {
              pids.push(item.properties.id);
            });
            _self.$store.commit('changeEditSelectedData', pids);
            _self.$store.commit('changeHandleFlag', 'insert');
          }
        }
      });
      let geometryAlgorithm = new fastmap.mapApi.geometry.GeometryAlgorithm();
      let point = this.$route.params.point;
      this.dataSource = this.$route.params.dataSource;
      const mapLocation = appUtil.getSessionStorage('mapLocation');
      let zoom = 15;
      if (point) {
        point = geometryAlgorithm.wktToGeojson(point).coordinates;
      } else if (mapLocation) {
        point = [mapLocation.point.lng, mapLocation.point.lat];
        zoom = mapLocation.zoom;
      } else {
        point = [116.33333, 40.88888];
      }
      const param = {
        point: {
          lat: point[1],
          lng: point[0]
        },
        zoom: zoom
      };
      this.zoom = zoom;
      const self = this;
      this.eventController.on('CHANGECOORDNITES',function(data) {
        self.zoom = data.zoom;
      });
      appUtil.setSessionStorage('mapLocation', param);
      setTimeout(() => {
        mapInit.initialize();
      }, 1000);
    },
    destroyed: function () {
      mapInit.destorySingletons();
    }
  }

</script>

<style scoped>
  .mainMap {
    width: 100%;
    height: 100%;
    overflow: hidden!important;
  }

  .map {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .toolsToolbar {
    position: absolute;
    top: 10px;
    z-index: 10;
  }

  .userToolbar {
    position: absolute;
    top: 10px;
    text-align: center;
    padding-bottom: 10px;
    z-index: 10;
  }

  .searchToolbar {
    position: absolute;
    width: 250px;
    height: 30px;
    top: 10px;
    z-index: 9;
  }

  .sceneToolbar {
    border-radius: 3px;
    box-shadow: 0 0 10px #93bbff;
    cursor: pointer;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    position: absolute;
    bottom: 10px;
  }

  .sceneToolbar>div {
    width: 100%;
    height: 100%;
    background: url("../assets/toolIcon/icon/button_changjing_normal.png") no-repeat center center;
  }

  .sceneToolbar:hover>div {
    background: url("../assets/toolIcon/icon/button_changjing_active.png") no-repeat center center;
  }

  .right-float-close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .mapZoomBar {
    position: absolute;
    bottom: 10px;
    right: 60px;
  }

</style>
