<template>
  <div class="mainMap">
    <transition name="el-fade-in-liner">
      <div class="sideBar" v-show="!leftFloatArrow">
        <div @click="showDialog = !showDialog" class="header">
          <h3 class="title"><i class="el-icon-picture"></i> 照片详情</h3>
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
    <div id="editorMap" class="map"></div>
    <!-- 显示隐藏按钮 -->
    <el-button :class="{ 'enter-active': leftFloatArrow,  'enter-start': !leftFloatArrow, 'left-toggle': true }" :round.boolean=false @click="toggleLeftPanel"
      type="primary">
      <i v-if="!leftFloatArrow" class="el-icon-arrow-left"></i>
      <i v-if="leftFloatArrow" class="el-icon-arrow-right"></i>
    </el-button>
    <tableEdit :dialog-table-visible="showDialog" @dialogClose="closeDialog"></tableEdit>

    <logout></logout>
  </div>
</template>


<script>
  import mapInit from './mapInit';
  import photoEdit from './photoEdit/photoEdit';
  import photoSwiper from './photoEdit/photoSwiper';
  import tableEdit from './tableEdit/tabDiag';
  import logout from './logout';
  import { appUtil } from '../Application';
  import { tempLogin, getTipsPhoto } from '../dataService/api';
  export default {
    name: 'mainMap',
    components: {
      photoEdit,
      photoSwiper,
      tableEdit,
      logout
    },
    data() {
      return {
        leftWidth: '25%',
        leftFloatArrow: false,
        showDialog: false,
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
      }
    },
    watch: {
      leftWidth: function (val) {
        console.log(val);
      },
    },
    mounted () {
      let _self = this;
      tempLogin({parameter:{"userNickName":"fanjingwei01672","userPassword":"016720"}})
      .then(result => {
        let {data, errcode} = result.data;
        if (errcode === 0) {
          let fmToken = data.access_token;
          appUtil.setRenderToken(fmToken);
        }
      })
      .finally(() => {
        console.log('login finally')
      })
      .catch(err => {
        console.log(err)
      });
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
    box-shadow: 0 4px 20px #5c78a7;
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
</style>
