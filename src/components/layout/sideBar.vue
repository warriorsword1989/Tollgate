<template>
  <transition name="el-fade-in-liner">
    <div class="sidebar-layout">
      <!-- 左侧主面板 -->
      <div class="sidbar-panel" v-show="showPanel">
        <!-- 左侧主面板头部 -->
        <div class="header">
          <h3 class="title"><i :class="sideBarIcon"></i> {{sideBarTitle}}</h3>
        </div>
        <div class="photoView">
          <slot name="photoView">照片控件的插槽</slot>
        </div>
        <div class="dataView">
          <slot name="dataView">tips编辑表单插槽</slot>
        </div>
      </div>
      <!-- 显示隐藏按钮 -->
      <el-button type="primary"
        :class="{ 'sidebar-ctrl-btn': true, 'active':showPanel, 'unActive':!showPanel }"
        :round.boolean="false"
        @click="toggleSideBar()">
        <i v-if="showPanel" class="el-icon-arrow-left"></i>
        <i v-if="!showPanel" class="el-icon-arrow-right"></i>
      </el-button>
    </div>
  </transition>
</template>

<script>
   export default {
    name: 'sideBar',
    props: {    
      sideBarTitle: { 
        type: String,  
        default: '照片详情'
      },
      sideBarIcon: {
        type: String,  
        default: 'el-icon-picture'
      }
    },
    components: {},
    data() {
      return {
        showPanel: true
      }
    },
    methods: {
      toggleSideBar() {
        this.showPanel = !this.showPanel
      }
    },
    mounted() {}
  }
</script>
<style scoped>
  .sidebar-layout {
     position:absolute;
     z-index:10;
     height:100%;
     box-shadow: 0 4px 20px #5c78a7;
  }
  .sidbar-panel {
    width: 600px;
    height:100%;
    background: #fff;
    display: flex;
    flex-direction: column
  }
  .sidbar-panel .header {
    background: #636ef5;
    padding-left: 10px;
  }
  .sidbar-panel .header h3 {
    padding: 0;
    margin: 0;
    color: #fff;
    height: 40px;
    line-height: 40px;
  }
  .sidbar-panel .photoView {
    flex: 1;
    border-bottom: 1px dashed #ccc;
  }
  .sidbar-panel .dataView {
    height: 180px;
    padding: 10px 0;
  }
  .sidebar-layout .el-button.sidebar-ctrl-btn{
    position: absolute;
    top: 0;
    width: 58px;
    height: 40px;
  }
  .sidebar-layout .el-button.sidebar-ctrl-btn.active {
    right: 0;
  }
  .sidebar-layout .el-button.sidebar-ctrl-btn.unActive {
    right: -58px;
  }
</style>
