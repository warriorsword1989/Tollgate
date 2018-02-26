<template>
  <div
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="tipsEdit">
    <div  class="row-wraper">
      <div class="row-list">
        <label>Tips反馈：</label>
        <div>
          <el-select style="width:100%" size="mini" v-model.number="dataModel.is_adopted">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div  class="row-wraper">
      <div class="row-list">
          <label>备注信息：</label>
          <div>
            <el-input size="mini" resize="none" type="textarea" v-model="dataModel.memo"></el-input>
          </div>
        </div>
    </div>
    <div class="row-wraper">
      <el-button style="position: absolute;right: 5px;" size="mini" type="primary" @click.prevent="onSumbit">提 交</el-button>
    </div>
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
  .tipsEdit .row-wraper{
    padding: 5px;
    display: flex;
    flex-direction: row;
  }
  .tipsEdit .row-wraper .row-list {
    flex:1;
    display: flex;
    flex-direction: row;
  }
  .tipsEdit .row-wraper .row-list > div {
    flex: 1;
  }
  .tipsEdit .row-wraper .row-list label{
    display:block;
    width: 100px;
    font-size: 12px;
    font-weight: bold;
    color: #606266;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
