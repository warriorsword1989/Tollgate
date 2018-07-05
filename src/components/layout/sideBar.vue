<template>
    <div class="sidebar-layout">
      <transition name="el-fade-in-linear">
        <!-- 左侧主面板 -->
        <div class="sidbar-panel transition-box" v-show="showPanel">
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
      </transition>
      <!-- 显示隐藏按钮 -->
      <transition name="el-fade-in-linear">
        <el-button type="primary"
          :class="{ 'sidebar-ctrl-btn  transition-box': true, 'active':showPanel, 'unActive':!showPanel }"
          :round.boolean="false"
          @click="showPanel = !showPanel">
          <i v-show="showPanel" class="el-icon-arrow-left"></i>
          <i v-show="!showPanel" class="el-icon-arrow-right"></i>
        </el-button>
      </transition>
    </div>
</template>

<script>
   export default {
    name: 'sideBar',
    props: {    
      sideBarTitle: { 
        type: String,  
        default: '头标题'
      },
      sideBarIcon: {
        type: String,  
        default: 'el-icon-picture'
      }
    },
    data() {
      return {
        showPanel: true
      }
    }
  }
</script>
<style scoped>
  .sidebar-layout {
     position:absolute;
     z-index:10;
     height:100%;
     background: #fff;
  }
  .sidbar-panel {
    width: 600px;
    height:100%;
    background: transparent;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px #5c78a7;
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
    height: 200px;
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
    left: 0;
  }
</style>
