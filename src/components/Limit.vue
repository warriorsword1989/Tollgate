<template>
  <!-- 限制载重信息表页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="height:89px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>限制载重信息表</span>
      </div>
      <div class="tableTopTitle">
        <span>区域标识:</span>
        <div style="display: inline-block">
          <el-input v-model="areaModel" :disabled="true" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>行政区划名称：</span>
        <div style="display: inline-block">
          <el-input v-model="administrative" :disabled="true" size="mini"></el-input>
        </div>
      </div>
      <div class="tableAdd" style="display: inline-block">
        <i class="el-icon-circle-plus-outline" style="font-size:24px;cursor: pointer;color:#409eff " @click="addItem()"></i>
        <!--<img src="../assets/toolIcon/rightIcon/button-add.png" @click="addItem()">-->
      </div>
      <div class="tableAdd" style="display: inline-block">
        <i class="el-icon-circle-close-outline" style="font-size:24px;cursor: pointer;color:#fa5555" @click="deleteItem()"></i>
        <!--<img src="../assets/toolIcon/rightIcon/button-delete.png" @click="deleteItem()">-->
      </div>
    </div>
    <div class="scroll_style" style="height:calc(100% - 139px);background-color:#FFFFFF;">
      <div v-for="(item,index) in　limitMessage">
        <div style="font-size: 14px; padding-left: 20px;padding-bottom: 20px;"v-text="'限重标准'+numberConvertToUppercase(index)"></div>
        <div class="tableContentAdd">
          <span>轴数限载标准：</span>
          <div style="display: inline-block">
            <el-input v-model="item.axlesStandard" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>型号限载标准：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.versionStandard" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>吨数限载标准：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.tonnageStandard" size="mini"></el-input>
          </div>
          <span>吨</span>
        </div>
        <div style="border : 1px dashed #409eff; margin-bottom : 20px;margin-left:25px;" v-show=" index !== (limitMessage.length - 1)"></div>
      </div>
      <div style="padding-left: 85%;background-color:#FFFFFF;">
        <el-button @click="saveItem()">保存</el-button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "Limit",
    data(){
      return {
        areaModel:'',//区域标识
        administrative:'',//行政区划名称
        limitMessage:[{
          axlesStandard:'',//轴数限载标准
          versionStandard:'',//型号限载标准
          tonnageStandard:'',//吨数限载标准
        }]
      }
    },
    methods:{
      numberConvertToUppercase:function (num){
        let upperCaseNumber = ['一', '二', '三', '四'];
        return upperCaseNumber[num];
      },
      addItem:function () {
        if(this.limitMessage.length === 4){
          return;
        }
        this.limitMessage.push({
          axlesStandard:this.axlesStandard,
          versionStandard:this.versionStandard,
          tonnageStandard:this.tonnageStandard,
        });
      },
      deleteItem:function () {
        if (this.limitMessage.length === 1) {
          return;
        }
        this.limitMessage.splice(this.limitMessage.length-1,1);
      },
      saveItem:function () {
      }
    }
  }
</script>

<style scoped>
  .tableTopTitle {
    display: inline-block;
    padding-left: 20px;
    padding-bottom: 20px;
  }
  .tableTopTitle > span{
    font-size: 14px;
    display:inline-block;
    color: #000000;
    padding-right: 5px;
  }
  .tableAdd{
    vertical-align:middle;
    padding-left: 20px;
  }
  .tableContentAdd{
    display: inline-block;
    padding-left: 20px;
    padding-bottom: 20px;
    font-size: 12px;
  }
  .tableContentAdd > span{
    font-size: 12px;
    display:inline-block;
    color: #000000;
    padding-right: 5px;
  }
</style>
