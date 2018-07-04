<template>
  <div
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  class="tipsEdit">
    <div style="border-bottom: 1px solid #eee;color: #606266;" class="tipsData">
      <div class="row-wraper">
        <div class="row-list">
          <label>上传时间:</label><span>{{photoData.a_uploadDate}}</span>
        </div>
        <div class="row-list">
          <label>来源ID:</label><span>{{photoData.a_sourceId}}</span>
        </div>
      </div>
      <div class="row-wraper">
        <div class="row-list">
          <label>照片内容:</label><span>{{photoData.a_content}}</span>
        </div>
        <div class="row-list">
          <label>版本号:</label><span>{{photoData.a_version}}</span>
        </div>
      </div>
      <div class="row-wraper">
        <div class="row-list">
          <label>RowKey:</label><span>{{photoData.rowkey}}</span>
        </div>
      </div>
    </div>
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
      <el-button style="position: absolute;right: 10px;line-height:1;height: 25px" size="mini" type="primary" @click.prevent="onSumbit">提 交</el-button>
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
          memo: '描述信息'
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
        }],

      }
    },
    props: ['photoData'],
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
    watch: {
      photoData: {
        handler(newValue, oldValue) {
          console.log(newValue, oldValue)
        },
        deep: true
      }
    },
     mounted () {
       console.log(this.photoData);
       if (appUtil.getGolbalData().dataSource !== 1) {
         return;
       }
       let _self = this;
       // 加载tips信息；
       let param = {rowkey: appUtil.getGolbalData().rowkey};
        getTollGateTip(param)
        .then(result => {
          let { errorCode, data } = result;
          if (errorCode == 0) {
              _self.dataModel = {
                is_adopted: data[0].is_adopted,
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
    padding: 5px 10px;
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
    width: 75px;
    font-size: 12px;
    font-weight: bold;
    color: #606266;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
