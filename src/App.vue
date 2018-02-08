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
/**************** 复写dialog样式 ********************/
.dragWindow .el-tabs--left .el-tabs__item{
  height: 35px;
  line-height: 35px;
}
.dragWindow  .el-collapse .el-collapse-item__header i.el-collapse-item__arrow {
  display: none;
}
/****************复写table样式********************/  
.el-table td, .el-table th {
  padding: 3px 0;
}
.dragWindow .el-table__body-wrapper{
  overflow:hidden;
}
.dragWindow .el-form-item {
  margin-bottom: 0;
}
.dragWindow .el-form-item__content {
  line-height: 0;
}
.dragWindow .el-form--inline .el-form-item__content {
  
}
/****************display: block复写tab样式********************/  
.dragWindow .el-tabs__content {
  height: 350px;
  overflow-y: scroll;
}
/****************复写按钮样式********************/  
.el-button {
  border-radius: 0
}
/****************自定义全局滚动条样式********************/  
::-webkit-scrollbar  
{  
    width: 6px;  
    height: 6px;  
    background-color: #F5F5F5;  
}  
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px rgba(99,110,240,0.3);  
    border-radius: 3px;  
    background-color: #F5F5F5;  
}  
::-webkit-scrollbar-thumb  
{  
    border-radius: 3px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.4);  
    background-color: #ccc;  
}
.sc-toll-edit {
  .edit-container {
    height: 28px;
    label {
      height: 28px;
      line-height: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .edit-content {
      height: 28px;
      padding: 0px 5px;
      input {
        height: 28px;
      }
      .el-range__icon {
        line-height: 0;
      }
      .el-range-input {
        height: auto;
      }
      .el-input__inner {
        height: 28px;
      }
      .el-date-editor {
        padding: 0;
        display: flex;
        align-items: center;
      }
      .el-range-separator {
        line-height: 2;
      }
      .el-range__close-icon {
        line-height: 0;
      }
    }
  }
  .edit-footer {
    .btn-submit {
      float: right;
    }
  }
}
</style>
