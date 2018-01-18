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
</style>
