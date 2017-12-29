<template>
  <div style="width: 100%;height: 100%">
    <div id="editorMap" class="map">
    </div>
    <div class="toll-container-left" v-show="leftShowFlag && isTipsWord">
      <img class="left-panel-hide" @click="hideLeftPanel()" src="../assets/toolIcon/leftlIcon/icon-back-left.png"/>
    </div>
    <img v-show="!leftShowFlag && isTipsWord" class="left-panel-show" @click="showLeftPanel()" src="../assets/toolIcon/leftlIcon/button-open-left.png"/>
  </div>
</template>

<script>
  import mapInit from './mapInit';
  export default {
    name: 'mainMap',
    data() {
      return {
        leftShowFlag: false,
        isTipsWord: true // 判断是否为tips照片作业，如果是展示左侧照片面板
      }
    },
    methods: {
      hideLeftPanel: function () {
        this.leftShowFlag = false;
      },
      showLeftPanel: function () {
        this.leftShowFlag = true;
      }
    },
    mounted: function() {
      mapInit.initialize();
    },
    destroyed: function () {
      mapInit.destorySingletons();
    }
  }
</script>

<style scoped>
.map{
  width: 100%;
  height: 100%;
  background-color: #f7f5f5;
}
.toll-container-left{
  position: absolute;
  box-shadow: 0 0 10px #93bbff;
  z-index: 9;
  width: 300px;
  height: 100%;
  top: 0;
  left: 0;
  background-color: red;
}
.left-panel-hide {
  position: absolute;
  left: 270px;
  top: 10px;
  cursor: pointer;
}
.left-panel-show {
  position: absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
}
</style>
