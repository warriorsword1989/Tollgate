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
          <photo-edit :data-model="tipsModel"></photo-edit>
        </div>
      </div>
    </transition>
    <!-- 地图 -->
    <div id="editorMap" class="map"></div>
    <!-- 显示隐藏按钮 -->
    <el-button :class="{ 'enter-active': leftFloatArrow,  'enter-start': !leftFloatArrow }" :round.boolean=false @click="toggleLeftPanel"
      type="primary">
      <i class="el-icon-arrow-left"></i>
    </el-button>

    <tableEdit :dialog-table-visible="showDialog" @DialogClose="closeDialog"></tableEdit>
  </div>
</template>


<script>
  import mapInit from './mapInit';
  import photoEdit from './photoEdit/photoEdit';
  import photoSwiper from './photoEdit/photoSwiper';
  import tableEdit from './tableEdit/tabDiag';
  import { getTollGateTip, getTipsPhoto } from '../dataService/api';
  export default {
    name: 'mainMap',
    components: {
      photoEdit,
      photoSwiper,
      tableEdit
    },
    data() {
      return {
        leftWidth: '25%',
        leftFloatArrow: false,
        showDialog: false,
        tipsModel: {
          tipsLifecycle: '1',
          memo: '描述信息',
          rowkey: ''
        },
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
      // 加载tips信息；
      let param = {rowkey: this.$route.params.rowkey};
      getTollGateTip(param)
      .then(result => {
         let { errorCode, data } = result;
         if (errorCode == 0) {
            _self.tipsModel = {
              tipsLifecycle: data[0].tips_lifecycle,
              rowkey: data[0].rowkey,
              memo: data[0].memo || ''
            }
          }
      })
      .finally(() => {
        console.log('finally');
      }).catch(err => {
        console.log(err);
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
    overflow: hidden;
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
    transform: rotate(180deg);
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
