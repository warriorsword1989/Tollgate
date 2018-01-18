<template>
  <div class="tableEditPanel">
    <el-form 
      :inline="true"
      class="wraper"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(243, 239, 239, 0.5);"
     >
      <div class="grid-content">
        <div class="labelText">费用金额：</div>
        <div class="inputPart">
          <el-input v-model="dataModel.out_fee" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">内埠车牌范围：</div>
        <div class="inputPart">
          <el-input v-model="dataModel.local_plate" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">收费类型：</div>
        <div class="inputPart">
          <el-select size="mini" v-model.number="dataModel.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="padding:10px 10px 0 0;text-align: right;" class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit">保 存</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>


<script>
  import {updateTollGate} from '../../dataService/api';
  import {getTollGate} from '../../dataService/api';
  export default {
    name: 'scTollGateFee',
    props: ['tableName'],
    data() {
      return {
        loading: true,
        dataModel: {
          local_plate:'',
          out_fee:null,
          source:1,
          toll_pid:1,
          type:1
        },
         mountFlag: false,
        options: [{
          value: 1,
          label: '当前收费站有代收费'
        }, {
          value: 2,
          label: '当前收费站为固定收费站'
        }, {
          value: 3,
          label: '当前收费站为跨界收费站'
        }]
      }
    },
    watch: {
      dataModel: {
        handler (newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {status: true, tabIndex: 5});
          } else {
            this.mountFlag = false;
          }
        },
        deep:true
      }
    },
    methods: {
      onSubmit(){
        let params = {
          table: 'SC_TOLL_TOLLGATEFEE',
          data: Object.assign(this.dataModel, {command: 'update'})
        };
        this.loading = true;
        updateTollGate(params)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          if (errorCode === 0) {
            this.$emit('tabStatusChange', {status: false, tabIndex: 5});
            return this.$message({message: '数据更新成功！', type: 'success'});
          } else {
            return this.$message({message: '数据更新失败！', type: 'warning'});
          }
        })
        .finally(() => {
          this.loading = false;
          console.log('finally');
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    mounted () {
      this.mountFlag = true;
      let param = {table: 'SC_TOLL_TOLLGATEFEE', pid: 55796611};
      getTollGate(param)
      .then(result => {
        let {errorCode, data} = result;
        this.dataModel = data[0];
      })
      .finally(() => {
        this.loading = false;
        console.log('finally');
      })
      .catch(err => {
        console.log(err);
      });
      console.log('mounted scTollGateFee')
    },
    destroyed() {
      this.$emit('childDestroyed scTollGateFee');
    }
  }

</script>

<style scoped>
  .grid-content {
    display:flex;
    flex-direction: row;
    margin: 10px;
  }
  .grid-content .labelText {
    width: 110px;
    text-align: right;
  }
  .grid-content .inputPart {
    flex: 1
  }
  .el-select,
  .el-select--mini{
    display: block;
    width: 100%;
  }
</style>
