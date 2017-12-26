<template>
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="height:68px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>收费站区间信息</span>
      </div>
      <div class="tableTopTitle">
        <span>区域标识</span>
        <div style="display: inline-block">
          <el-input v-model="areaLogo" size="mini"></el-input>
        </div>
      </div>
    </div>
    <div class="scroll_style" style="height:calc(100% - 118px);background-color:#FFFFFF;">
      <div class="tableTopTitle">
        <span>ETC 打折 类型：</span>
        <el-select v-model="saleType" placeholder="请选择" size="mini">
          <el-option v-for="item in saleTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>ETC打折：</span>
        <div style="display: inline-block">
          <el-input v-model="etcSale" size="mini"></el-input>
        </div>
        <span>%</span>
      </div>
      <div class="tableTopTitle">
        <span>免费车型：</span>
        <el-select v-model="freeCarType" placeholder="请选择" size="mini">
          <el-option v-for="item in freeCarTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>是否有绿色通道：</span>
        <el-select v-model="Passageway" placeholder="请选择" size="mini">
          <el-option v-for="item in Passageways" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>客车优惠车型：</span>
        <el-select v-model="carsType" placeholder="请选择" size="mini">
          <el-option v-for="item in carsTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>客车优惠降低量：</span>
        <el-select v-model="carsReduction" placeholder="请选择" size="mini">
          <el-option v-for="item in carsReductions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>货车优惠空载车型：</span>
        <el-select v-model="truckType" placeholder="请选择" size="mini">
          <el-option v-for="item in truckTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
      <span>货车空载优惠降低量：</span>
      <el-select v-model="trucksReduction" placeholder="请选择" size="mini">
        <el-option v-for="item in trucksReductions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      </div>
      <div class="tableTopTitle">
        <span>货车正常装载优惠吨数区间:</span>
        <div style="display: inline-block">
          <el-input v-model="truckTonnageRangeOne" size="mini"></el-input>
        </div>
          <span>-</span>
        <div style="display: inline-block">
          <el-input v-model="truckTonnageRangeTwo" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>货车正常装载优惠计费吨数:</span>
        <div style="display: inline-block">
          <el-input v-model="truckFeeTonnage" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>最低收费金额:</span>
        <div style="display: inline-block">
          <el-input v-model="lowerMoney" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>收费取整：</span>
        <el-select v-model="parseFee" placeholder="请选择" size="mini">
          <el-option v-for="item in parseFees" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div style="padding-left: 85%;background-color:#FFFFFF;">
        <el-button @click="saveItem()">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "TollgateInterval",
        data(){
          return {
            areaLogo:'',//区域标识
            saleType:'',//ETC 打折 类型
            etcSale:'',//ETC打折
            freeCarType:'',//免费车型
            saleTypes:[{
              value: '1',
              label: '无'
            }, {
              value: '2',
              label: '客车'
            }, {
              value: '3',
              label: '货车'
            }],
            freeCarTypes:[{
              value: '1',
              label: '无'
            }, {
              value: '2',
              label: '军车'
            }, {
              value: '3',
              label: '鲜活农产品'
            }],
            Passageway:'',//是否有绿色通道
            Passageways:[{
              value: '1',
              label: '无'
            }, {
              value: '2',
              label: '有'
            }],
            carsType:'',//客车优惠车型
            carsTypes:[{
              value: '1',
              label: '空'
            }, {
              value: '2',
              label: '1'
            }, {
              value: '3',
              label: '2'
            }, {
              value: '4',
              label: '3'
            }, {
              value: '5',
              label: '4'
            }],
            carsReduction:'',//客车优惠降低量
            carsReductions:[{
              value: '1',
              label: '空'
            }, {
              value: '2',
              label: '1'
            }, {
              value: '3',
              label: '2'
            }, {
              value: '4',
              label: '3'
            }, {
              value: '5',
              label: '4'
            }],
            truckType:'',//货车优惠空载车型
            truckTypes:[{
              value: '1',
              label: '空'
            }, {
              value: '2',
              label: '1'
            }, {
              value: '3',
              label: '2'
            }, {
              value: '4',
              label: '3'
            }, {
              value: '5',
              label: '4'
            }, {
              value: '6',
              label: '5'
            }],
            trucksReduction:'',//货车空载优惠降低量
            trucksReductions:[{
              value: '1',
              label: '空'
            }, {
              value: '2',
              label: '1'
            }, {
              value: '3',
              label: '2'
            }, {
              value: '4',
              label: '3'
            }, {
              value: '5',
              label: '4'
            }, {
              value: '6',
              label: '5'
            }],
            truckTonnageRangeOne:'',//货车正常装载优惠吨数区间
            truckTonnageRangeTwo:'',//货车正常装载优惠吨数区间
            truckFeeTonnage:'',//货车正常装载优惠计费吨数
            lowerMoney:'',//低收费金额
            parseFee:'',//收费取整
            parseFees:[{
              value: '1',
              label: '无取整'
            }, {
              value: '2',
              label: '将元位作三舍为零四进入五，七舍为五八进入十处理'
            }, {
              value: '3',
              label: '直接取整'
            }, {
              value: '4',
              label: '四舍五入'
            }, {
              value: '5',
              label: '2.5元以下舍，2.51至7.5元归5元，7.51至9.99元进10'
            }, {
              value: '6',
              label: '3.49元以下舍，3.5至7.49元归5元，7.5至9.99元归10元'
            }],
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
    font-size: 14px;
    display:inline-block;
    color: #000000;
    padding-right: 5px;
  }
</style>
