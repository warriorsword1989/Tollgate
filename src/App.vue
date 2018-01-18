<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
@import "./style/main.less";
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/** 复写dialog样式 */
.tableDialog .el-dialog__body {
    padding-top: 0px
  }
.tableDialog .el-dialog__header {
  background: #636ef5;
}
.tableDialog .el-dialog__header .el-dialog__title{
  color: #fff;
  letter-spacing: 1px;
}
.tableDialog .el-dialog__header .el-dialog__headerbtn i {
  color: #fff;
}
.tableDialog  .el-collapse .el-collapse-item__header i.el-collapse-item__arrow {
  display: none;
}

::-webkit-scrollbar  
{  
    width: 6px;  
    height: 6px;  
    background-color: #F5F5F5;  
}  
/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px rgba(99,110,240,0.3);  
    border-radius: 3px;  
    background-color: #F5F5F5;  
}  
/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb  
{  
    border-radius: 3px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.4);  
    background-color: #ccc;  
}  
</style>
