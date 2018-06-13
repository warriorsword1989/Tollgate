<template>
  <div
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="tipsInfos">
    <!-- 图片浏览 -->
    <div class="photoSwiper">
      <div class="gallery-top"></div>
      <swiper v-viewer="options" :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
        <swiper-slide v-for="(item, index) in imageList" :key="index">
          <img @click="clickPhoto(index)" :src="item.imageUrl" />
        </swiper-slide>
        <div @click="nextPhoto()" class="swiper-button-next swiper-button-white" slot="button-next"></div>
        <div @click="prePhoto()" class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      </swiper>
    </div>
    <!-- 图片信息显示 -->
    <div class="tipsData">
      <div class="row-wraper">
        <div class="row-list">
          <label>上传时间：</label><span>{{currentActivePhoto.a_uploadDate}}</span>
        </div>
        <div class="row-list">
          <label>来源ID：</label><span>{{currentActivePhoto.a_sourceId}}</span>
        </div>
      </div>
      <div class="row-wraper">
        <div class="row-list">
          <label>照片内容：</label><span>{{currentActivePhoto.a_content}}</span>
        </div>
        <div class="row-list">
          <label>版本号：</label><span>{{currentActivePhoto.a_version}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import fastXmlParser from 'fast-xml-parser';
  import { getTipsPhoto } from '../../dataService/api';
  import { appUtil, appConfig } from '../../Application';
  export default {
    data() {
      return {
        loading: true,
        imageList: [],
        options: {
          inline: true,
          title: false,
          button: false,
          navbar: false,
          toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: false,
            play: {
              show: false
            },
            next: false,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4,
          }
        },
        swiperOptionThumbs: {
          spaceBetween: 5,
          slidesPerView: 4,
          touchRatio: 0.2,
          loop: false,
          loopedSlides: 4,
          slideToClickedSlide: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        currentActivePhoto: {
          a_uploadDate: '',
          a_sourceId: '',
          a_content: '',
          a_version: ''
        },
        photoInfo: {
          uploadDate: '',
          rowkey: '',
          version: ''
        }
      }
    },
    methods: {
      nextPhoto() {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.next();
        this.setCurrentInfo()
      },
      prePhoto() {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.prev();
        this.setCurrentInfo()
      },
      clickPhoto(index) {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.view(index);
        this.setCurrentInfo(index)
      },
      formatTime(str) {
        let year = str.substr(0,4);
        let month = str.substr(4,2);
        let day = str.substr(6,2);
        let h = str.substr(8,2);
        let m = str.substr(10,2);
        let s = str.substr(12,2);
        return `${year}-${month}-${day} ${h}:${m}:${s}`;
      },
      setCurrentInfo(index) {
          let activeIndex = index || this.$refs.swiperThumbs.swiper.activeIndex;
          this.currentActivePhoto.a_uploadDate = this.formatTime(this.imageList[activeIndex].properties.a_uploadDate);
          this.currentActivePhoto.a_sourceId = this.imageList[activeIndex].properties.a_sourceId;
          this.currentActivePhoto.a_content = this.imageList[activeIndex].properties.a_content;
          this.currentActivePhoto.a_version = this.imageList[activeIndex].properties.a_version;
      }
    },
    mounted() {
      if (appUtil.getGolbalData().dataSource !== 1) {
        return;
      }
       // 加载tips照片；
      let photoIds = appUtil.getGolbalData().photo_id.split(';');
      let promises = photoIds.map(item => {
        return getTipsPhoto({rowKey: item, url: appConfig.hbaseUrl});
      });
      Promise.all(promises).then(posts => {
        var i=1;
        this.imageList = posts.map(item => {
          let result = fastXmlParser.validate(item);
          if(!result) throw new Error(result.err);
          let xmlJson = fastXmlParser.parse(item)
          let photoObj = {};
          photoObj.properties = JSON.parse(new Buffer(xmlJson.CellSet.Row.Cell[0], 'base64').toString());
          photoObj.imageUrl = `data:image/jpeg;base64,${xmlJson.CellSet.Row.Cell[1]}`;
          return photoObj;
        });
        this.loading = false;
        this.$nextTick(()=>{
          this.setCurrentInfo()
        });
      }).catch(function(err){
        throw new Error(err);
      });
    }
  }
</script>

<style lang="less" scoped>
  .tipsInfos {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .tipsInfos .photoSwiper{
    flex: 1;
  }
  .viewer-footer {
    bottom: 20% !important;
  }
  .swiper-container {
    background-color: #000;
  }
  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  .gallery-top {
    height: 80%!important;
    width: 100%;
  }
  .gallery-thumbs {
    height: 20%!important;
    box-sizing: border-box;
    padding: 5px 0;
  }
   .swiper-slide img {
    width: 100%;
    height: 100%;
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .tipsData {
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
  }
  .tipsData .row-wraper{
    height: 27px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
  }
  .tipsData .row-wraper .row-list {
    flex:1
  }
  .tipsData .row-wraper .row-list label{
    font-size: 12px;
    font-weight: bold;
    color: #606266;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .tipsData .row-wraper .row-list span {
    font-size: 12px;
    color: #606266;
  }

</style>
