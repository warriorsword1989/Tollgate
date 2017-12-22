<template>
  <!--货车计重正常装载费率（超限）页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div class="scroll_style" style="height:89px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>货车计重正常装载费率（超限）</span>
      </div>
      <div class="tableTopTitle">
        <span>区间闭合标识</span>
        <el-select v-model="region" placeholder="请选择" size="mini">
          <el-option v-for="item in regions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>桥梁隧道名称组号</span>
        <div style="display: inline-block">
          <el-input  v-model="bridgeGroupNum" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>桥梁隧道名称</span>
        <div style="display: inline-block">
          <el-input  v-model="bridgeGroupName"  size="mini"></el-input>
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
      <div v-for="(item,index) in truckWeightLimitTable">
        <div>
          <div style="font-size:14px;display: inline-block;padding-left: 20px;padding-bottom: 20px;">
            <span v-text="numberConvertToUppercase(index)+'类装载'"></span>
          </div>
          <div class="tableContentAdd">
            <span>超载级别百分比范围（超载情况，车货总重&nbsp&nbsp>&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.overWeightTotalFirst" size="mini"></el-input>
            </div>
              <span>%</span>
              <span>&nbsp&nbsp<=&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.overWeightTotalSecond" size="mini"></el-input>
            </div>
              <span>%</span>
          </div>
          <div class="tableContentAdd">
            <span>区间闭合标识</span>
            <el-select v-model="item.closedLabelLimit" placeholder="请选择" size="mini">
              <el-option v-for="item in closedLabelLimits" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div style="font-size:12px;padding-left: 20px;padding-bottom: 20px;">
            <span v-text="numberConvertToUppercase(index)+'类区间'"></span>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>超装载区间百分比范围 ：&nbsp&nbsp>&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input v-model="item.overTonnageRangeFirst"  size="mini"></el-input>
          </div>
            <span>%</span>
            <span>&nbsp&nbsp<=&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input v-model="item.overTonnageRangeSecond" size="mini"></el-input>
          </div>
            <span>%</span>
        </div>
        <div class="tableContentAdd">
          <span>超载基本费率的倍数上限 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overFeeRateUpLimit" size="mini"></el-input>
          </div>
          <span>%</span>
        </div>
        <div class="tableContentAdd">
          <span>超载基本费率的倍数下限 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overFeeRateDownLimit" size="mini"></el-input>
          </div>
          <span>%</span>
        </div>
        <div class="tableContentAdd">
          <span>超载基本费率 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overBaseFeeRate" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>正常装载基本费率 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.nomalBaseFeeRateNum" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>超载基本费率车道数 ：</span>
          <el-select v-model="item.overDrivewayNum" placeholder="请选择" size="mini">
            <el-option v-for="item in overDrivewayNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>费率1 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.feeRateOneLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率1车道数 ：</span>
          <el-select v-model="item.feeRateOneLmtDwNum" placeholder="请选择" size="mini">
            <el-option v-for="item in feeRateOneLmtDwNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>最低计重（吨）：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.lowerweightLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>最低收费（元 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.lowerChargeLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>超载计费的吨数限值 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overtonnageLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>超限值基本费率倍数 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overBaseFeeRateDouble" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>超限值费率 ：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.overLimitFeeRate" size="mini"></el-input>
          </div>
        </div>
        <div style="border : 1px dashed #409eff; margin-bottom : 20px;margin-left:25px;" v-show=" index !== (truckWeightLimitTable.length - 1)"></div>
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
    name: "TruckWeightLimit",
    data(){
      return {
        region:'1', // 区间闭合标识
        bridgeGroupName:'', // 桥梁隧道名称
        bridgeGroupNum:'', // 桥梁隧道名称组号
        truckWeightLimitTable:[{
          overWeightTotalFirst:'',　//超载级别百分比范围
          overWeightTotalSecond:'',　//超载级别百分比范围
          closedLabelLimit:'1',　//区间闭合标识
          overTonnageRangeFirst:'', //超装载区间百分比范围
          overTonnageRangeSecond:'',//超装载区间百分比范围
          overFeeRateUpLimit:'',//超载基本费率的倍数上限
          overFeeRateDownLimit:'',//超载基本费率的倍数下限
          overBaseFeeRate:'',//超载基本费率
          nomalBaseFeeRateNum:'',//正常装载基本费率
          overDrivewayNum:'1',//超载基本费率车道数
          feeRateOneLimit:'',//费率1
      　　feeRateOneLmtDwNum:'1',//费率1车道数
          lowerweightLimit:'',//最低计重
          lowerChargeLimit:'',//最低收费
          overtonnageLimit:'',//超载计费的吨数限值
          overBaseFeeRateDouble:'',//超限值基本费率倍数
          overLimitFeeRate:''//超限值费率
        }],
        regions: [{ // 区间闭合标识 数组
          value: '1',
          label: '前开后闭'
        }, {
          value: '2',
          label: '前闭后开'
        }, {
          value: '3',
          label: '前闭后闭'
        }],
        closedLabelLimits:[{ // 区间闭合标识 数组
          value: '1',
          label: '前开后闭'
        }, {
          value: '2',
          label: '前闭后开'
        }, {
          value: '3',
          label: '前闭后闭'
        }],
        overDrivewayNums:[{　 //超载基本费率车道数 数组
          value: '1',
          label: 4
        },{
          value: '2',
          label: 6
        }],
        feeRateOneLmtDwNums:[{　//费率1车道数 数组
          value: '1',
          label: 4
        },{
          value: '2',
          label: 6
        }],
      }
    },
    methods:{
      numberConvertToUppercase:function (num){
        let upperCaseNumber = ['一', '二', '三', '四'];
        return upperCaseNumber[num];
      },
      addItem:function () {
        if(this.truckWeightLimitTable.length === 4){
          return;
        }
        this.truckWeightLimitTable.push({
          overWeightTotalFirst:this.overWeightTotalFirst,
          overWeightTotalSecond:this.overWeightTotalSecond,
          closedLabelLimit:this.closedLabelLimit,
          overTonnageRangeFirst:this.overTonnageRangeFirst,
          overTonnageRangeSecond:this.overTonnageRangeSecond,
          overFeeRateUpLimit:this.overFeeRateUpLimit,
          overFeeRateDownLimit:this.overFeeRateDownLimit,
          nomalBaseFeeRateNum:this.nomalBaseFeeRateNum,
          overBaseFeeRate:this.overBaseFeeRate,
          overDrivewayNum:this.overDrivewayNum,
          feeRateOneLimit:this.feeRateOneLimit,
          feeRateOneLmtDwNum:this.feeRateOneLmtDwNum,
          lowerweightLimit:this.lowerweightLimit,
          lowerChargeLimit:this.lowerChargeLimit,
          overtonnageLimit:this.overtonnageLimit,
          overBaseFeeRateDouble:this.overBaseFeeRateDouble,
          overLimitFeeRate:this.overLimitFeeRate,
        });
      },
      deleteItem:function () {
        if (this.truckWeightLimitTable.length === 1) {
          return;
        }
        this.truckWeightLimitTable.splice(this.truckWeightLimitTable.length-1,1);
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

