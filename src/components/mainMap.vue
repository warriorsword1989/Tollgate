<template>
  <div class="mainMap">
    <transition name="el-fade-in-liner">
      <div class="sideBar" v-show="!leftFloatArrow">
        <div @click="showDialog = !showDialog" class="header">
          <h3 class="title">照片详情</h3>
        </div>
        <div class="photoView">
           <photo-swiper :image-list="dataModle.imageList"></photo-swiper>
        </div>
        <div class="dataView">
          <photo-edit :data-model="dataModle"></photo-edit>
        </div>
      </div>
    </transition>

    <div id="editorMap" class="map"></div>

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
            'http://img3.imgtn.bdimg.com/it/u=1321305856,3339290601&fm=200&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=4070935547,487271359&fm=200&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=3523654413,712008688&fm=27&gp=0.jpg'
          ]
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
    mounted: function () {
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
    flex: 7;
    flex-direction: column
  }
  .sideBar .dataView {
    flex: 3;
    text-align: justify;
    padding-top: 10px;
  }
</style>
