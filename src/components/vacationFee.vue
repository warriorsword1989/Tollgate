<template>
  <!--节假日收费浮动信息页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="padding-left: 20px;padding-bottom: 20px;padding-top:25px;font-size: 16px">
      <span>节假日收费浮动信息</span>
    </div>
    <div class="tableTopTitle">
      <span>日期:</span>
      <el-date-picker v-model="vacationDate" type="date" placeholder="选择日期" size="mini"style="display: inline-block"></el-date-picker>
    </div>
    <div class="tableTopTitle">
      <span>日期类型:</span>
      <el-select v-model="dateType" placeholder="请选择" size="mini">
        <el-option v-for="item in dateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="tableTopTitle">
      <el-switch v-model="vacationradio" active-text="不收费" inactive-text="收费"></el-switch>
      <!--<el-radio-group v-model="vacationradio">-->
        <!--<el-radio :label="1">收费</el-radio>-->
        <!--<el-radio :label="2">不收费</el-radio>-->
      <!--</el-radio-group>-->
    </div>
    <div style="padding-left:10%;background-color:#FFFFFF;">
      <el-button @click="saveItem()">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "vacationFee",
    data(){
      return {
        vacationDate:'',//日期
        dateType:'1',//日期类型
        vacationradio:1,
        dateTypes:[{
          value:'1',
          label:"节假日"
        },
        {
          value:'2',
          label:"特殊日期"
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
    padding-left: 20px;
    padding-bottom: 20px;
  }
  .tableTopTitle > span{
    font-size: 14px;
    color: #000000;
    padding-right: 5px;
  }
</style>
