<template>
  <!--特殊收费浮动信息页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="padding-left: 20px;padding-bottom: 20px;padding-top:25px;font-size: 16px">
      <span>特殊收费浮动信息</span>
    </div>
    <div class="tableTopTitle">
      <span>区域标识：</span>
      <div style="display: inline-block">
        <el-input v-model="specialAreaModel" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>表达区域要求的车牌范围：</span>
      <div style="display: inline-block">
        <el-input v-model="specialLicense" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>时间段</span>
      <el-date-picker v-model="dateRangeFirst" type="date" placeholder="选择日期" size="mini" style="display: inline-block" :picker-options="pickerBeginDateBefore"></el-date-picker>
      <span>-</span>
      <el-date-picker v-model="dateRangeSecond" type="date" placeholder="选择日期" size="mini" style="display: inline-block" :picker-options="pickerBeginDateAfter"></el-date-picker>
    </div>
    <div class="tableTopTitle">
      <span>特殊持卡：</span>
      <div style="display: inline-block">
        <el-input v-model="specialCard" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>客车车型：</span>
      <div style="display: inline-block">
        <el-input v-model="spcarType" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>货车车型：</span>
      <div style="display: inline-block">
        <el-input v-model="sptruckType" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>正常装载类型：</span>
      <div style="display: inline-block">
        <el-input v-model="nomalLoadTy" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>超载类型：</span>
      <div style="display: inline-block">
        <el-input v-model="overLoadTy" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <span>打折：</span>
      <div style="display: inline-block">
        <el-input v-model="onSale" size="mini"></el-input>
      </div>
      <span>%</span>
    </div>
    <div class="tableTopTitle">
      <span>优惠上限（元）：</span>
      <div style="display: inline-block">
        <el-input v-model="saleUpLimit" size="mini"></el-input>
      </div>
    </div>
    <div class="tableTopTitle">
      <el-switch v-model="chargeFeeIf" active-text="不收费" inactive-text="收费"></el-switch>
      <!--<el-radio-group v-model="chargeFeeIf">-->
        <!--<el-radio :label="1">收费</el-radio>-->
        <!--<el-radio :label="2">不收费</el-radio>-->
      <!--</el-radio-group>-->
    </div>
    <div class="tableTopTitle">
      <span>优惠金额：</span>
      <div style="display: inline-block">
        <el-input v-model="saleFee" size="mini"></el-input>
      </div>
    </div>
    <div style="padding-left: 80%;background-color:#FFFFFF;">
      <el-button @click="saveItem()">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "specialFeeMes",
    data(){
      return {
        specialAreaModel:'',//区域标识
        specialLicense:'',//表达区域要求的车牌范围
        specialCard:'',//特殊持卡
        dateRangeFirst:'',//时间段
        dateRangeSecond:'',//时间段
        spcarType:'',//客车车型
        sptruckType:'',//货车车型
        nomalLoadTy:'',//正常装载类型
        overLoadTy:'',//超载类型
        onSale:'',//打折
        saleUpLimit:'',//优惠上限
        chargeFeeIf:1,
        saleFee:'',//优惠金额
        // 时间控件
        pickerBeginDateBefore:{
          disabledDate: (time) => {
            let beginDateVal = this.dateRangeSecond;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          },
        },
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            let beginDateVal = this.dateRangeFirst;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        }
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
