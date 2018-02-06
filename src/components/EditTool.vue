<template>
  <div class="topToolsContainer">
    <div title="编辑收费站" style="border-left: none" @click="selectTool('RDTOLLGATE')">
      <img src="../assets/quickToolIcon/select.png"/>
    </div>
    <div title="地图漫游" @click="panMove()">
      <img src="../assets/quickToolIcon/mapPan.png"/>
    </div>
    <div title="新增收费站" @click="batchSelectTool('RDTOLLGATE')">
      <img src="../assets/quickToolIcon/copyPolygon.png"/>
    </div>
  </div>
</template>

<script>
    import startEditCtrl from '../uikits/startEditCtrl';
    export default {
        name: "edit-tool",
        methods: {
          panMove: function () {
            startEditCtrl.pan();
          },
          selectTool: function (type) {
            startEditCtrl.select(type);
          },
          batchSelectTool: function (type) {
            startEditCtrl.batchSelect(type);
          }
        }
    }
</script>

<style scoped>
  .topToolsContainer {
    box-shadow: 0 0 10px #93bbff;
    background-color: #FFFFFF;
    font-size: 0;
  }
  .topToolsContainer > div {
    width: 40px;
    height: 30px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    display: inline-block;
    border-left: 1px solid #d2e1ff;
  }

  .topToolsContainer > div:hover {
    background-color: rgba(88, 150, 255, 0.1);
  }

  .topToolsContainer > div.disabled {
    background-color: rgba(24, 40, 72, 0.2);
    cursor: not-allowed;
  }
</style>
