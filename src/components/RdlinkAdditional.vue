<template>
  <!--桥隧道收费附加信息页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="padding-left: 20px;padding-bottom: 20px;padding-top:25px;font-size: 16px">
      <span>桥隧道收费附加信息</span>
    </div>
    <div class="tableTopTitle">
      <span>桥梁或隧道名称:</span>
      <div style="display: inline-block">
        <el-input v-model="rdlinkName" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>桥梁或隧道名称组号：</span>
      <div style="display: inline-block">
        <el-input v-model="rdlinkGroup" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>收费类型：</span>
      <el-select v-model="chargeFeeType" placeholder="请选择" size="mini">
        <el-option v-for="item in chargeFeeTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="tableTopTitle">
      <span>实际收费的长度倍数：</span>
      <div style="display: inline-block">
        <el-input v-model="chargeFeeLength" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>加费：</span>
      <div style="display: inline-block">
        <el-input v-model="addFee" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>客车车型编号：</span>
      <div style="display: inline-block">
        <el-input v-model="carsTypeNum" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>货车车型编号：</span>
      <div style="display: inline-block">
        <el-input v-model="truckTypeNum" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>区间闭合标识：</span>
      <el-select v-model="closedLabelModel" placeholder="请选择" size="mini">
        <el-option v-for="item in closedLabelModels" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="tableTopTitle">
      <span>计重吨数区间：</span>
      <div style="display: inline-block">
        <el-input v-model="TonnageRangeFirst" size="mini"></el-input>
      </div>
      <span>-</span>
      <div style="display: inline-block">
        <el-input v-model="TonnageRangeSecond" size="mini"></el-input>
      </div>
    </div>
    <div style="padding-left: 85%;background-color:#FFFFFF;">
      <el-button @click="saveItem()">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RdlinkAdditional",
    data(){
      return {
        rdlinkName:'',//桥梁或隧道名称
        rdlinkGroup:'',//桥梁或隧道名称组号
        chargeFeeType:'1',//收费类型
        chargeFeeLength:'',//实际收费的长度倍数
        addFee:'',//加费
        carsTypeNum:'',//客车车型编号
        truckTypeNum:'',//货车车型编号
        closedLabelModel:'1',//区间闭合标识
        TonnageRangeFirst:'',//计重吨数区间
        TonnageRangeSecond:'',//计重吨数区间
        closedLabelModels:[{
          value: '1',
          label: '前开后闭'
        }, {
          value: '2',
          label: '前闭后开'
        }, {
          value: '3',
          label: '前闭后闭'
        }],
        chargeFeeTypes:[{
          value: '1',
          label: '按正常里程收费，无特殊加费'
        }, {
          value: '2',
          label: '按正常里程收费，同时有特殊加费'
        }, {
          value: '3',
          label: '按特定桥隧道收费标准收费'
        }, {
          value: '4',
          label: '特定桥隧道收费标准为正常里程的倍数'
        }]
      }
    },
    methods:{
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
    display: inline-block;
    font-size: 14px;
    color: #000000;
    padding-right: 5px;
  }
</style>
