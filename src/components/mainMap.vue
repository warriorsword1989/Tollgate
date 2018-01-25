<template>
  <div class="mainMap">
    <transition name="el-fade-in-liner">
      <div class="sideBar" v-show="!leftFloatArrow">
        <div @click="showDialog = !showDialog" class="header">
          <h3 class="title">照片详情</h3>
        </div>
        <!-- 照片显示 -->
        <div class="photoView">
           <photo-swiper :image-list="dataModel.imageList"></photo-swiper>
        </div>
        <!-- 数据编辑 -->
        <div class="dataView">
          <photo-edit></photo-edit>
        </div>
      </div>
    </transition>
    <!-- 地图 -->
    <div id="editorMap" class="map">
      <edit-tool class="toolsToolbar" v-bind:style="{right: rightPanelFlag ? '390px': '90px'}">

      </edit-tool>
    </div>
    <user-tool class="userToolbar" v-bind:style="{right: rightPanelFlag ? '350px': '50px'}">

    </user-tool>
    <div class="sceneToolbar" @click="openRightPanel()" v-bind:style="{right: rightPanelFlag ? '310px': '10px'}">
      <div>
      </div>
    </div>
    <div class="fm-layout-container right" v-if="rightPanelFlag" style="overflow: hidden">
      <scene-tool>
      </scene-tool>
      <img class="right-float-close" @click="closeRightPanel()" src="../assets/toolIcon/icon/button-close-normal.png"/>
    </div>
    <!-- 显示隐藏按钮 -->
    <el-button :class="{ 'enter-active': leftFloatArrow,  'enter-start': !leftFloatArrow, 'left-toggle': true }" :round.boolean=false @click="toggleLeftPanel"
      type="primary">
      <i v-if="!leftFloatArrow" class="el-icon-arrow-left"></i>
      <i v-if="leftFloatArrow" class="el-icon-arrow-right"></i>
    </el-button>

    <tableEdit :dialog-table-visible="showDialog" @DialogClose="closeDialog"></tableEdit>
  </div>
</template>


<script>
  import mapInit from './mapInit';
  import photoEdit from './photoEdit/photoEdit';
  import photoSwiper from './photoEdit/photoSwiper';
  import tableEdit from './tableEdit/tabDiag';
  import { appUtil } from '../Application';
  import { tempLogin, getTipsPhoto } from '../dataService/api';
  import EditTool from './EditTool';
  import UserTool from './UserTool';
  import SceneTool from './SceneTool';
  export default {
    name: 'mainMap',
    components: {
      SceneTool,
      UserTool,
      EditTool,
      photoEdit,
      photoSwiper,
      tableEdit
    },
    data() {
      return {
        leftWidth: '25%',
        leftFloatArrow: false,
        showDialog: false,
        rightPanelFlag: false,
        dataModel: {
          uploadTime: '2012-10-7',
          sourceId: '111111',
          photoContent: '1212',
          version: '1.2.1',
          imageList: []
        }
      }
    },
    computed: {
    },
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
    mounted () {
      let _self = this;
      let geometryAlgorithm = new fastmap.mapApi.geometry.GeometryAlgorithm();
      let point = this.$route.params.point;
      const mapLocation = appUtil.getSessionStorage('mapLocation');
      if (point) {
        point = geometryAlgorithm.wktToGeojson(point).coordinates;
      } else if (mapLocation) {
        point = [mapLocation.point.lng, mapLocation.point.lat]
      } else {
        point = [116.33333, 40.88888];
      }
      const param = {
        point: {
          lat: point[1],
          lng: point[0]
        },
        zoom: 15
      };
      appUtil.setSessionStorage('mapLocation', param);
      mapInit.initialize();
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

  .sideBar {
    background: #fff;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 600px;
    display: flex;
    z-index: 1;
    flex-direction: column;
    border-right: 1px solid #ccc;
  }

  .sideBar .header {
    height: 40px;
    background-color: #636ef5;
    justify-content: space-between;
  }

  .sideBar .header .rectButton {
    border-radius: 4px;
  }

  .sideBar .header h3 {
    color: #fff;
    margin: 0;
    padding: 0 10px;
    line-height: 40px;
    letter-spacing: 1px;
  }

  .left-toggle {
    border-radius: 0;
  }

  .enter-start {
    position: absolute;
    top: 0px;
    left: 544px;
    z-index: 2;
  }

  .enter-active {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 2;
    transition: all .4s liner;
  }

  .sideBar .photoView {
    flex: 8;
    display: flex;
    flex-direction: column
  }
  .sideBar .dataView {
    height: 150px;
    padding-top: 10px;
    border-top: 1px solid #8b8d9c;
    text-align: justify;
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
  .sceneToolbar > div{
    width: 100%;
    height: 100%;
    background: url("../assets/toolIcon/icon/button_changjing_normal.png") no-repeat center center;
  }
  .sceneToolbar:hover > div {
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
</style>
