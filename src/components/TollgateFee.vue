<template>
  <div style="background-color: #ffffff;height: 100%;width: 100%">
      <div style="padding-left: 20px;padding-bottom: 20px;padding-top:25px;font-size: 16px">
        <span>收费站加费信息</span>
      </div>
      <div class="tableTopTitle">
        <span>费  用  金  额：</span>
        <div style="display: inline-block">
          <el-input v-model="feeMoney" size="mini"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>内埠车牌范围：</span>
        <div style="display: inline-block">
          <el-input v-model="licenseRange" size="mini" @change="limit()"></el-input>
        </div>
      </div>
      <div class="tableTopTitle">
        <span>收  费  类  型:</span>
        <el-select v-model="feeType" placeholder="请选择" size="mini">
          <el-option v-for="item in feeTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div style="padding-left: 85%;background-color:#FFFFFF;">
        <el-button @click="saveItem()">保存</el-button>
      </div>
  </div>
</template>

<script>
  export default {
    name: "TollgateFee",
    data(){
      return {
        feeMoney:'',//费用金额
        licenseRange:'',//内埠车牌范围
        feeType:'1',//收费类型
        feeTypes:[{
          value: '1',
          label: '当前收费站有代收费'
        }, {
          value: '2',
          label: '当前收费站为固定收费站'
        }, {
          value: '3',
          label: '当前收费站为跨界收费站'
        }]
      }
    },
    methods:{
      saveItem:function () {
      },
      limit:function () {
        let reg = /^.*[a-z]+.*$/;
        if(reg.test(this.licenseRange)){
         alert("输入内容存在字母，请输入大写")
          return this.licenseRange='';
        }
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
