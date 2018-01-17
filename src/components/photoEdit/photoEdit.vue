<template>
  <div class="photoEdit">
    <el-form :inline="true" :model="dataModel" label-position="right" size="mini" label-width="80px" class="demo-form-inline">
      <el-form-item label="Tips反馈:">
        <el-select v-model="dataModel.tipsLifecycle">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        </el-select>
      </el-form-item>
      <el-form-item class="inlineBlock" label="备注">
        <el-input resize="none" type="textarea" :rows=2 class="remark" v-model="dataModel.memo"></el-input>
      </el-form-item>
      <el-form-item class="inlineBlock send">
        <el-button type="primary" @click.prevent="onSumbit">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { updateTollGateTip } from '../../dataService/api';
  export default {
    name: 'photoEdit',
    components: { },
    props: ['dataModel'],
    data() {
      return {
        options: [{
          value: '1',
          label: '未处理'
        }, {
          value: '2',
          label: '已处理'
        }, {
          value: '3',
          label: '无法处理'
        }]
      }
    },
    methods: {
      onSumbit(event) {
        updateTollGateTip(this.dataModel)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          if (errorCode === 0) {
            return this.$message({message: '数据更新成功！', type: 'success'});
          } else {
            return this.$message({message: '数据更新失败！', type: 'warning'});
          }
        })
        .finally(() => {
          console.log('finally')
        })
        .catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
  .photoEdit .el-form .el-textarea textarea {
    display: block;
  }
  .photoEdit .el-form .inputLenght {
    width: 180px;
  }
  .photoEdit .el-form--inline .inlineBlock {
    display: block;
  }
  .photoEdit .el-form--inline .el-form-item .remark {
    width: 400px;
  }
  .photoEdit .el-form--inline .el-form-item.send {
    float: right;
  }
</style>
