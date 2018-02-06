<template>
  <!--货车计重正常装载费率（不超限）页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div class="scroll_style" style="height:89px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>货车计重正常装载费率（不超限）</span>
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
          <el-input placeholder="不允许编辑" v-model="bridgeGroupNum" :disabled="true" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>桥梁隧道名称</span>
        <div style="display: inline-block">
          <el-input placeholder="不允许编辑" v-model="bridgeGroupName" :disabled="true" size="mini"></el-input>
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
      <div v-for="(item,index) in truckWeightTableContent">
        <div>
          <div style="font-size:14px;display: inline-block;padding-left: 20px;padding-bottom: 20px;">
            <span v-text="numberConvertToUppercase(index)+'类装载'"></span>
          </div>
          <div class="tableContentAdd">
            <span>正常装载级别吨数范围（车货总重)&nbsp&nbsp>&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.weightTotalFirst" size="mini"></el-input>
            </div>
            <span>&nbsp&nbsp<=&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.weightTotalSecond" size="mini"></el-input>
            </div>
          </div>
          <div class="tableContentAdd">
            <span>区间闭合标识</span>
            <el-select v-model="item.closedLabel" placeholder="请选择" size="mini">
              <el-option v-for="item in closedLabels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div style="font-size:12px;padding-left: 20px;padding-bottom: 20px;">
            <span v-text="numberConvertToUppercase(index)+'类区间'"></span>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>正常转载区间吨数范围：&nbsp&nbsp>&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input v-model="item.tonnageRangeFirst"  size="mini"></el-input>
          </div>
          <span>&nbsp&nbsp<=&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input v-model="item.tonnageRangeSecond" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率上限（广东为倍数）：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.feeRateUpLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率下限（广东为倍数）：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.feeRateDownLimit" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>基本费率：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.baseFeeRate" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>基本费率车道数：</span>
          <el-select v-model="item.baseFeeRateNum" placeholder="请选择" size="mini">
            <el-option v-for="item in baseFeeRateNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>费 率 1：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.feeRateOne" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率1车道数：</span>
          <el-select v-model="item.feeRateOneDrivewayNum" placeholder="请选择" size="mini">
            <el-option v-for="item in feeRateOneDrivewayNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>最低计重（吨）：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.lowerweight" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>最低收费（元）：</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.lowerCharge" size="mini"></el-input>
          </div>
        </div>
        <div style="border : 1px dashed #409eff; margin-bottom : 20px;margin-left:25px;" v-show=" index !== (truckWeightTableContent.length - 1)"></div>
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
    name: "truckWeight",
    data(){
      return {
        region:'1', // 区间闭合标识
        bridgeGroupName:'', // 桥梁隧道名称
        bridgeGroupNum:'',  // 桥梁隧道名称组号
        closedLabels:[{ // 区间闭合标识　数组
          value: '1',
          label: '前开后闭'
        }, {
          value: '2',
          label: '前闭后开'
        }, {
          value: '3',
          label: '前闭后闭'
        }],
        baseFeeRateNums:[{　//基本费率车道数 数组
          value: '1',
          label: 4
        },{
          value: '2',
          label: 6
        }],
        feeRateOneDrivewayNums:[{　// 费率1车道数　数组
          value: '1',
          label: 4
        },{
          value: '2',
          label: 6
        }],
        regions: [{　// 区间闭合标识　数组
          value: '1',
          label: '前开后闭'
        }, {
          value: '2',
          label: '前闭后开'
        }, {
          value: '3',
          label: '前闭后闭'
        }],
        truckWeightTableContent:[{
          weightTotalFirst:'', // 正常装载级别吨数范围（车货总重)
          weightTotalSecond:'', // 正常装载级别吨数范围（车货总重)
          closedLabel:'1', // 区间闭合标识
          tonnageRangeFirst:'', // 正常转载区间吨数范围
          tonnageRangeSecond:'', // 正常转载区间吨数范围
          feeRateUpLimit:'', // 费率上限
          feeRateDownLimit:'', // 费率下限
          baseFeeRate:'', // 基本费率
          baseFeeRateNum:'1', // 基本费率车道数
          feeRateOne:'', // 费 率 1
          feeRateOneDrivewayNum:'1', // 费率1车道数
          lowerweight:'', // 最低计重
          lowerCharge:''// 最低收费
        }],
      }
    },
    methods:{
      numberConvertToUppercase:function (num){
        let upperCaseNumber = ['一', '二', '三', '四'];
        return upperCaseNumber[num];
      },
      addItem:function () {
        if(this.truckWeightTableContent.length === 4){
          return;
        }
        this.truckWeightTableContent.push({
          weightTotalFirst:this.seatSectionFirst,
          weightTotalSecond:this.seatSectionSecond,
          closedLabel:this.Notunnel,
          tonnageRangeFirst:this.laneNum,
          tonnageRangeSecond:this.tunnelFee,
          feeRateUpLimit:this.trainFee,
          feeRateDownLimit:this.caseSizeNum,
          baseFeeRate:this.shaftNum,
          baseFeeRateNum:this.wheelNum,
          feeRateOne:this.modelNum,
          feeRateOneDrivewayNum:this.lowerFee,
          lowerweight:this.feeRate,
          lowerCharge:this.laneNumFeeRate,
        });
      },
      deleteItem:function () {
        if (this.truckWeightTableContent.length === 1) {
          return;
        }
        this.truckWeightTableContent.splice(this.truckWeightTableContent.length-1,1);
      },
      saveItem:function () {
      }
    }
  }
</script>

<style scoped>
  .tableTop{
    padding:25px 0;
  }
  .tableTop　span{
    display: inline-block;
  }
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

