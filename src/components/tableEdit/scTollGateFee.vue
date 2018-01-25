<template>
  <div class="tableEditPanel" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" :inline="true" class="wraper">
      <div class="grid-content">
        <div class="labelText">费用金额：</div>
        <div class="inputPart">
          <el-input v-model="dataModels.out_fee" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">内埠车牌范围：</div>
        <div class="inputPart">
          <el-input v-model="dataModels.local_plate" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">收费类型：</div>
        <div class="inputPart">
          <el-select size="mini" v-model.number="dataModels.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="padding:10px 10px 0 0;text-align: right;" class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit('dataModels')">保 存</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    updateTollGate
  } from '../../dataService/api';
  import {
    getTollGate
  } from '../../dataService/api';
  export default {
    name: 'scTollGateFee',
    props: ['tableName', 'selectedData'],
    data() {
      return {
        loading: true,
        dataModels: {
          local_plate: '',
          out_fee: 0,
          source: 1,
          toll_pid: this.selectedData.id,
          type: 1
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
      dataModels: {
        handler(newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {
              status: true,
              tabIndex: 5
            });
          } else {
            this.mountFlag = false;
          }
        },
        deep: true
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              table: 'SC_TOLL_TOLLGATEFEE',
              data: [this.dataModels]
            };
            this.loading = true;
            updateTollGate(params)
              .then(result => {
                let {
                  errorCode
                } = result;
                const h = this.$createElement;
                if (errorCode === 0) {
                  this.$emit('tabStatusChange', {
                    status: false,
                    tabIndex: 5
                  });
                  return this.$message({
                    message: '数据更新成功！',
                    type: 'success'
                  });
                } else {
                  return this.$message({
                    message: '数据更新失败！',
                    type: 'warning'
                  });
                }
              })
              .finally(() => {
                this.loading = false;
                console.log('finally');
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      let _self = this;
      this.mountFlag = true;
      let param = {
        table: 'SC_TOLL_TOLLGATEFEE',
        pid: this.selectedData.id
      };
      getTollGate(param)
        .then(result => {
          let {errorCode,data} = result;
          if (data.length) {
            _self.dataModels = data[0]
          }
        })
        .finally(() => {
          _self.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

</script>

<style scoped>
  .grid-content {
    display: flex;
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
  .el-select--mini {
    display: block;
    width: 100%;
  }

</style>
