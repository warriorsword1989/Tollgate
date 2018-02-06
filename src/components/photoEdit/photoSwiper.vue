<template>
  <div
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="tipsInfos">
    <!-- 照片显示 -->
    <div class="photo-viewer-container">
      <viewer :images="originImages" class="photo-viewer" :options="viewerOptions">
        <img v-for="src in originImages" :src="src" :key="src" style="display: none;">
      </viewer>
    </div>
    <!-- 照片详情 -->
    <el-form style="padding-top:10px" :inline="true" :v-model="photoInfo" label-position="right" size="mini" label-width="80px" class="demo-form-inline">
      <el-form-item class="inlineBlock" label="上传时间">
        <el-input :disabled="true" v-model="photoInfo.uploadDate" placeholder="上传时间"></el-input>
      </el-form-item>
      <el-form-item class="inlineBlock" label="来源ID">
        <el-input :disabled="true" v-model="photoInfo.rowkey" placeholder="来源ID"></el-input>
      </el-form-item>
      <el-form-item class="inlineBlock" label="照片内容">
        <el-input :disabled="true" v-model="photoInfo.uploadDate" placeholder="照片内容"></el-input>
      </el-form-item>
      <el-form-item class="inlineBlock" label="版本号">
        <el-input :disabled="true" v-model="photoInfo.version" placeholder="版本号"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getTipsPhoto } from '../../dataService/api';
  import { appUtil } from '../../Application';
  export default {
    data() {
      return {
        loading: true,
        viewerOptions: {
          inline: true,
          url: 'img-src',
          zoomRatio: 0.5,
          minHeight: 200
        },
        imageList: [],
        originImages: [],
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
        _self.originImages = [];
        _self.imageList.forEach ((data) => {
          _self.originImages.push(_self.getOriginUrl(data.rowkey));
        });
      })
      .finally(() => {
        this.loading = false;
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

  .photo-viewer-container {
    height: 80%;
    .photo-viewer {
      height: 100%;
      overflow: auto;
      img {
        height: 50%;
        width: 50%;
        position: relative;
      }
    }
  }

</style>
