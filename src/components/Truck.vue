<template>
  <!--货车车型划分及费率页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div class="scroll_style" style="height:89px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>货车车型划分及费率</span>
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
      <div v-for="(item,index) in truckTableContent">
        <div style="font-size: 14px; padding-left: 20px;padding-bottom: 20px;" v-text="numberConvertToUppercase(index)+'型车'">{</div>
        <div class="tableContentAdd">
          <span>各车型座位数区间&nbsp&nbsp>&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input v-model="item.seatSectionFirst" size="mini"></el-input>
          </div>
          <span>&nbsp&nbsp<=&nbsp&nbsp</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.seatSectionSecond" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率（元/公里）非桥隧道</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.Notunnel" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率车道数</span>
          <el-select v-model="item.laneNum" placeholder="请选择" size="mini">
            <el-option v-for="item in laneNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>集装箱尺寸数</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.caseSizeNum" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>轴数</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.shaftNum" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>轮数</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.wheelNum" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>型号</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.modelNum" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>桥隧道费率（元/车次）</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.tunnelFee" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>车次加费（元）</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.trainFee " size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>最低收费（元）</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.lowerFee" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率1（元/公里）</span>
          <div style="display: inline-block">
            <el-input placeholder="" v-model="item.feeRate" size="mini"></el-input>
          </div>
        </div>
        <div class="tableContentAdd">
          <span>费率1车道数</span>
          <el-select v-model="item.laneNumFeeRate" placeholder="请选择" size="mini">
            <el-option v-for="item in laneNumFeeRates" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="tableContentAdd">
          <span>固定收费站对应次费</span>
          <div style="display: inline-block">
            <el-input placeholder="" size="mini" v-model="item.tollGateFee"></el-input>
          </div>
        </div>
        <div style="border : 1px dashed #409eff; margin-bottom : 20px;margin-left:25px;" v-show=" index !== (truckTableContent.length - 1)"></div>
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
    name: "Truck",
    data(){
      return {
        region:'1', // 区间闭合标识
        bridgeGroupName:'', // 桥梁隧道名称
        bridgeGroupNum:'', // 桥梁隧道名称组号
        seatSectionFirst:'', // 各车型座位数区间
        seatSectionSecond:'', // 各车型座位数区间
        Notunnel:'', // 费率（元/公里）非桥隧道
        laneNum:'1', // 费率车道数
        caseSizeNum:'', // 集装箱尺寸数
        shaftNum:'', // 轴数
        wheelNum:'', // 轮数
        modelNum:'', // 型号
        tunnelFee:'', // 桥隧道费率
        trainFee:'', // 车次加费
        lowerFee:'', // 最低收费
        feeRate:'', // 费率1
        laneNumFeeRate:'1', // 费率1车道数
        tollGateFee:'', // 固定收费站对应次费
        laneNums:[{ // 费率车道数 数组
          value: '1',
          label: '请选择'
        },{
          value: '2',
          label: 4
        },{
          value: '3',
          label: 6
        }],
        laneNumFeeRates:[{ // 费率1车道数 数组
          value: '1',
          label: '空'
        },{
          value: '2',
          label: 4
        },{
          value: '3',
          label: 6
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
        truckTableContent:[{
          seatSectionFirst:'',
          seatSectionSecond:'',
          Notunnel:'',
          laneNum:'1',
          caseSizeNum:'',
          shaftNum:'',
          wheelNum:'',
          tunnelFee:'',
          modelNum:'',
          trainFee:'',
          lowerFee:'',
          feeRate:'',
          laneNumFeeRate:'1',
          tollGateFee:'',
        }],
      }
    },
    methods:{
      numberConvertToUppercase:function (num){
        let upperCaseNumber = ['一', '二', '三', '四'];
        return upperCaseNumber[num];
      },
      addItem:function () {
        if(this.truckTableContent.length === 4){
          return;
        }
        this.truckTableContent.push({
          seatSectionFirst:this.seatSectionFirst,
          seatSectionSecond:this.seatSectionSecond,
          Notunnel:this.Notunnel,
          laneNum:this.laneNum,
          tunnelFee:this.tunnelFee,
          trainFee:this.trainFee,
          caseSizeNum:this.caseSizeNum,
          shaftNum:this.shaftNum,
          wheelNum:this.wheelNum,
          modelNum:this.modelNum,
          lowerFee:this.lowerFee,
          feeRate:this.feeRate,
          laneNumFeeRate:this.laneNumFeeRate,
          tollGateFee:this.tollGateFee,
        });
      },
      deleteItem:function () {
        if (this.truckTableContent.length === 1) {
          return;
        }
        this.truckTableContent.splice(this.truckTableContent.length-1,1);
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
