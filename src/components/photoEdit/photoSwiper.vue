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
  </div>
</template>
<script>
  import mapInit from '../mapInit';
  import fastXmlParser from 'fast-xml-parser';
  import { getTipsPhoto } from '../../dataService/api';
  import { appUtil, appConfig } from '../../Application';
  export default {
    data() {
      return {
        loading: false,
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
          a_version: '',
          rowkey: ''
        }
      }
    },
    methods: {
      nextPhoto() {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.next();
        this.$nextTick(() => {
          this.setCurrentInfo();
        })
      },
      prePhoto() {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.prev();
        this.$nextTick(() => {
          this.setCurrentInfo();
        })
      },
      clickPhoto(index) {
        const viewer = this.$el.querySelector('.gallery-thumbs').$viewer;
        viewer.view(index);
        this.$nextTick(() => {
          this.setCurrentInfo();
        })
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
          this.currentActivePhoto.rowkey =  this.imageList[activeIndex].properties.rowkey;
          this.$emit('dataChange',this.currentActivePhoto);
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
      this.loading = true;
      Promise.all(promises).then(posts => {
        this.imageList = posts.map(item => {
          let photoObj = {};
          photoObj.properties = item.properties;
          photoObj.imageUrl = `data:image/jpeg;base64,${item.imageUrl}`;
          return photoObj;
        });
        setTimeout(function () {
          mapInit.initialize();
        });
        this.loading = false;
        this.$nextTick(()=>{
          this.setCurrentInfo();
        });
      }).catch(err => {
        mapInit.initialize();
        this.imageList = [];
        this.loading = false;
        throw new Error(err);
      });
    },
    destroyed: function () {
      mapInit.destorySingletons();
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
</style>
