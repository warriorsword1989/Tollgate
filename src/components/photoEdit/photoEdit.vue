<template>
  <div
  v-loading="loading"
  style="overflow:auto"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="photoEdit">
    <el-form :inline="true" :model="dataModel" label-position="right" size="mini" label-width="80px" class="demo-form-inline">
      <el-form-item label="Tips反馈:">
        <el-select v-model.number="dataModel.is_adopted">
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
  import { updateTollGateTip, getTollGateTip } from '../../dataService/api';
  import { appUtil } from '../../Application';
  export default {
    name: 'photoEdit',
    components: { },
    data() {
      return {
        loading: true,
        dataModel: {
          is_adopted: 1,
          memo: '描述信息',
          rowkey: ''
        },
        options: [{
          value: 1,
          label: '未处理'
        }, {
          value: 2,
          label: '已处理'
        }, {
          value: 3,
          label: '无法处理'
        }]
      }
    },
    methods: {
      onSumbit(event) {
        this.loading = true;
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
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        })
      }
    },
     mounted () {
       let _self = this;
       // 加载tips信息；
        let param = {rowkey: appUtil.getGolbalData().rowkey};
        getTollGateTip(param)
        .then(result => {
          let { errorCode, data } = result;
          if (errorCode == 0) {
              _self.dataModel = {
                is_adopted: data[0].is_adopted,
                rowkey: data[0].rowkey,
                memo: data[0].memo || ''
              }
            }
        })
        .finally(() => {
          this.loading = false;
        }).catch(err => {
          console.log(err);
        });
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
