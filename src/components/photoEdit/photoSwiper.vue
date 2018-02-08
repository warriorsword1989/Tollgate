<template>
  <div
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="tipsInfos">
    <!-- 照片显示 -->
    <div class="photoSwiper">
      <swiper :options="swiperOptionTop" @slideChange="slideChanged" class="gallery-top" ref="swiperTop">
        <swiper-slide v-for="(item, index) in imageList" :key="index">
          <img :src="getOriginUrl(item.rowkey)" />
        </swiper-slide>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      </swiper>
      <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
        <swiper-slide v-for="(item, index) in imageList" :key="index">
          <img style="padding:1px;border:1px solid #eee" :src="getThumbnailUrl(item.rowkey)" />
        </swiper-slide>
      </swiper>
    </div>
    <!-- 显示信息区域 -->
    <div class="tipsData">
      <div class="row-wraper">
        <div class="row-list">
          <label>上传时间：</label><span>{{photoInfo.uploadDate}}</span>
        </div>
        <div class="row-list">
          <label>来源ID：</label><span>{{photoInfo.uploadDate}}</span>
        </div>
      </div>
      <div class="row-wraper">
        <div class="row-list">
          <label>照片内容：</label><span>{{photoInfo.uploadDate}}</span>
        </div>
        <div class="row-list">
          <label>版本号：</label><span>{{photoInfo.version}}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { getTipsPhoto } from '../../dataService/api';
  import { appUtil } from '../../Application';
  export default {
    data() {
      return {
        loading: true,
        swiperOptionTop: {
          spaceBetween: 10,
          loop: true,
          loopedSlides: 4,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        swiperOptionThumbs: {
          spaceBetween: 10,
          slidesPerView: 4,
          touchRatio: 0.2,
          loop: true,
          loopedSlides: 4,
          slideToClickedSlide: true
        },
        imageList: [],
        renderToken: '',
        photoInfo: {
          uploadDate: '',
          rowkey: '',
          version: ''
        }
      }
    },
    methods: {
      getThumbnailUrl(rowkey) {
        var url = window.serviceConfig.tempFsUrl+'/fcc/photo/getSnapshotByRowkey';
        return url + '?access_token='+this.renderToken+'&parameter={rowkey:"' + rowkey +
          '",type:"thumbnail"}';
      },
      getOriginUrl(rowkey) {
        var url = window.serviceConfig.tempFsUrl+'/fcc/photo/getSnapshotByRowkey';
        return url + '?access_token='+this.renderToken+'&parameter={rowkey:"' + rowkey +
            '",type:"origin"}';
      },
      slideChanged() {
        const activeIndex = this.$refs.swiperTop.swiper.activeIndex || 0;
        this.photoInfo = this.imageList[activeIndex];
      }
    },
    mounted() {
       // 加载tips照片；
      let _self = this;
      let photoIds = appUtil.getGolbalData().photo_id.split(';');
      this.renderToken = appUtil.getRenderToken();
      getTipsPhoto({parameter: {rowkeys: photoIds}, access_token: this.renderToken})
      .then((results) => {
        _self.imageList = results.data.data ? results.data.data : [];
        _self.swiperOptionThumbs.loopedSlides = _self.swiperOptionTop.loopedSlides = _self.imageList.length;
      })
      .finally(() => {
        this.loading = false;
        this.$nextTick(() => {
          const swiperTop = this.$refs.swiperTop.swiper;
          const swiperThumbs = this.$refs.swiperThumbs.swiper;
          swiperTop.controller.control = swiperThumbs;
          swiperThumbs.controller.control = swiperTop;
          const activeIndex = swiperTop.activeIndex || 0;
          this.photoInfo = this.imageList[activeIndex];
        })
      })
      .catch(err => {
        console.log(err);
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
    padding: 10px 0;
  }
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
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
    height: 30px;
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
