<template>
  <el-container>
    <el-aside :width="leftWidth">
      <div class="header">
        <h3 class="title">照片详情</h3>
        <el-button :class="{ isActive: leftFloatArrow }" round.boolean=false @click="toggleLeftPanel" type="primary">
          <i class="el-icon-arrow-left"></i>
        </el-button>
      </div>
      <div class="photoView">
        <photo-swiper :image-list="dataModle.imageList"></photo-swiper>
      </div>
      <div class="dataView">
        <photo-edit :data-model="dataModle"></photo-edit>
      </div>
    </el-aside>
    <el-main>
      <div id="editorMap" class="map"></div>
    </el-main>
  </el-container>
</template>

<script>
  import mapInit from './mapInit';
  import photoEdit from './photoEdit/photoEdit';
  import photoSwiper from './photoEdit/photoSwiper';
  export default {
    name: 'mainMap',
    components: { photoEdit, photoSwiper },
    data() {
      return {
        leftWidth: '640px',
        leftFloatArrow: false,
        dataModle: {
          uploadTime: '2012-10-7',
          sourceId: '111111',
          photoContent: '1212',
          version: '1.2.1',
          feedback: 1,
          desc: '描述信息',
          imageList: [
            'http://img2.imgtn.bdimg.com/it/u=2473758249,2536588353&fm=200&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=2229000148,3674036755&fm=200&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=4146374575,892898083&fm=200&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=4070935547,487271359&fm=200&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=1321305856,3339290601&fm=200&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=3523654413,712008688&fm=27&gp=0.jpg'
          ]
        }
      }
    },
    methods: {
      toggleLeftPanel: function (event) {
        this.leftFloatArrow = !this.leftFloatArrow;
        this.leftWidth = this.leftFloatArrow ? '0px' : '640px';
      }
    },
    watch: {
      leftWidth: function (val) {
        console.log(val);
      },
    },
    mounted: function () {
      mapInit.initialize();
    },
    destroyed: function () {
      mapInit.destorySingletons();
    }
  }

</script>

<style scoped>
  .el-container {
    height: 100%;
    width: 100%;
    background: #fff;
  }

  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f7f5f5;
  }

  .el-aside {
    background: #fff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ccc;
  }

  .el-aside .header {
    height: 40px;
    display: flex;
    flex-direction: row;
    background-color: #636ef5;
    justify-content: space-between;
  }
  .el-aside .header .rectButton {
    border-radius: 4px;
  }

  .el-aside .header h3 {
    color: #fff;
    margin: 0;
    padding: 0 10px;
    line-height: 40px;
    letter-spacing: 1px;
  }
  .el-aside .header button.isActive {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 1;
    transform:rotate(180deg);
    transition:All 0.6s ease-in-out;
  }

  .el-aside .photoView {
    flex: 6;
    flex-direction: column
  }

  .el-aside .dataView {
    flex: 4;
    text-align: justify;
    padding: 20px;
    border-top: 1px solid #ccc;
  }

  .el-main {
    flex: 1;
    padding: 0
  }


  .el-asideHide {
    flex: 0;
  }
  .el-mainBig {
    flex: 1;
  }

</style>
