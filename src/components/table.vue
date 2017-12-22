<template>
  <!--客车车型划分及费率页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div class="scroll_style" style="height:89px;padding:25px 0;">
      <div style="padding-left: 20px;padding-bottom: 20px;font-size: 16px">
        <span>客车车型划分及费率</span>
      </div>
      <div class="tableTopTitle">
        <span>区间闭合标识</span>
        <el-select v-model="region" clearabl placeholder="请选择" size="mini">
          <el-option v-for="item in regions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="tableTopTitle">
        <span>桥梁隧道名称组号</span>
        <div style="display: inline-block">
          <el-input v-model="bridgeGroupNum" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>桥梁隧道名称</span>
        <div style="display: inline-block">
          <el-input v-model="bridgeGroupName" size="mini"></el-input>
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
        <div v-for="(item,index) in tableContent" >
          <div style="font-size: 14px; padding-left: 20px;padding-bottom: 20px;">
            <span v-text="numberConvertToUppercase(index)+'型车'"></span>
          </div>
          <div class="tableContentAdd">
            <span>各车型座位数区间&nbsp&nbsp>&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.seatSectionFirst" size="mini" :disabled="item.disable"></el-input>
            </div>
              <span>&nbsp&nbsp<=&nbsp&nbsp</span>
            <div style="display: inline-block">
              <el-input v-model="item.seatSectionSecond" size="mini" @change="change"></el-input>
            </div>
          </div>
          <div class="tableContentAdd">
            <span>费率（元/公里）非桥隧道</span>
            <div style="display: inline-block">
              <el-input placeholder="" v-model="item.Notunnel" size="mini" value="number" @change="show(index,'Notunnel')"></el-input>
            </div>
          </div>
          <div class="tableContentAdd">
            <span>费率车道数</span>
            <el-select v-model="item.laneNum" placeholder="请选择" size="mini" >
              <el-option v-for="item in laneNums" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
          <div class="tableContentAdd">
            <div class="block">
              <span>截止日期</span>
              <el-date-picker v-model="item.finalDay" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" size="mini" ></el-date-picker>
            </div>
          </div>
          <div style="border : 1px dashed #409eff; margin-bottom : 20px;margin-left:25px;" v-show=" index !== (tableContent.length - 1)"></div>
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
        name: "table",
        data(){
            return {
              region:'1',// 区间闭合标识
              bridgeGroupName:'', // 桥梁隧道名称
              bridgeGroupNum:'', // 桥梁隧道名称组号
              seatSectionFirst:'', // 各车型座位数区间
              seatSectionSecond:'', // 各车型座位数区间
              Notunnel:'', // 费率（元/公里）非桥隧道
              tunnelFee:'', // 桥隧道费率
              trainFee:'', // 车次加费
              lowerFee:'', // 最低收费
              feeRate:'', // 费率1
              laneNumFeeRate:'1', // 费率1车道数
              tollGateFee:'', // 固定收费站对应次费
              finalDay:'', // 截止日期
              laneNum:'1', // 费率车道数
              laneNumFeeRates:[{　// 费率1车道数 数组
                value: '1',
                label: '空'
              },{
                value: '2',
                label: 4
              },{
                value: '3',
                label: 6
              }],
              laneNums:[{　// 费率车道数　数组
                value: '1',
                label: '空'
              },{
                value: '2',
                label: 4
              },{
                value: '3',
                label: 6
              }],
              regions: [{　 // 区间闭合标识　数组
                value: '1',
                label: '前开后闭'
              }, {
                value: '2',
                label: '前闭后开'
              }, {
                value: '3',
                label: '前闭后闭'
              }],
              tableContent:[{　// data　数组
                disable:false,
                seatSectionFirst:'0',
                seatSectionSecond:'',
                Notunnel:'',
                laneNum:'1',
                tunnelFee:'',
                trainFee:'',
                lowerFee:'',
                feeRate:'',
                laneNumFeeRate:'1',
                tollGateFee:'',
                finalDay:'2016/12/23'
              }],
            }
        },
         methods:{
               numberConvertToUppercase:function (num){
                   let upperCaseNumber = ['一', '二', '三', '四'];
                     return upperCaseNumber[num];
                  },
                addItem:function () {
                  if(this.tableContent.length === 4){
                    return;
                  }
                  this.tableContent.push({
                    seatSectionFirst:this.seatSectionFirst,
                    seatSectionSecond:this.seatSectionSecond,
                    Notunnel:this.Notunnel,
                    laneNum:this.laneNum,
                    tunnelFee:this.tunnelFee,
                    trainFee:this.trainFee,
                    lowerFee:this.lowerFee,
                    feeRate:this.feeRate,
                    laneNumFeeRate:this.laneNumFeeRate,
                    tollGateFee:this.tollGateFee,
                    finalDay:this.finalDay,
                  });
                },
                 deleteItem:function () {
                   if (this.tableContent.length === 1) {
                     return;
                   }
                   this.tableContent.splice(this.tableContent.length-1,1);
                 },
                 saveItem:function () {

                 },
                 change:function () {
                   for(let i=0;i< this.tableContent.length;i++) {
                     if ( this.tableContent[i].seatSectionFirst > this.tableContent[i].seatSectionSecond){
                       console.log(11);
                     }
                     this.tableContent[0].disable = true;
                     this.tableContent[i+1].seatSectionFirst = this.tableContent[i].seatSectionSecond;
                   }
                 },
                 //提示信息
                 show:function (index,name){
                   if(this.tableContent[index][name] < 0){
                     this.$confirm('输入值小于０, 是否继续?', '提示', {
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       type: 'warning'
                     }).then(() => {
                       this.$message({
                         type: 'success',
                         message: '操作成功!'
                       });
                     }).catch(() => {
                       this.$message({
                         type: 'fail',
                         message: '已取消此操作'
                       });
                     });
                   }else if (this.tableContent[index][name] > '3'){
                     this.$confirm('输入值大于３, 是否继续?', '提示', {
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       type: 'warning'
                     }).then(() => {
                       this.$message({
                         type: 'success',
                         message: '操作成功!'
                       });
                     }).catch(() => {
                       this.$message({
                         type: 'fail',
                         message: '已取消此操作'
                       });
                     });
                   }
                 },

            }
    }
</script>

<style scoped>
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
  .seatSection .el-input{
    width: 80px;
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
