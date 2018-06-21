<template>
  <div style="height:350px;overflow-y: auto" class="tableEditPanel" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" :inline="false" class="wraper">
      <div class="grid-content">
        <div class="labelText">费用金额：</div>
        <div class="inputPart">
          <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="out_fee">
            <el-input v-model.number="dataModels.out_fee" size="mini"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">内埠车牌范围：</div>
        <div class="inputPart">
          <el-form-item :rules="[{ validator: check_local_plate, trigger: 'change'}]" style="display:block" prop="local_plate">
            <el-input v-model="dataModels.local_plate" size="mini"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">收费类型：</div>
        <div class="inputPart">
          <el-form-item prop="type">
            <el-select size="mini" v-model.number="dataModels.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit('dataModels')">保 存</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { updateTollGate, getTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollGateFee',
    data() {
      return {
        loading: false,
        dataModels: {
          local_plate: '',
          out_fee: 0,
          source: this.$store.state.source,
          toll_pid: this.$store.state.editSelectedData[0],
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
      // 如果存在的换验证数字是否为>=0的数字；
      validateNum (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        } else {
          callback();
        }
      },
      check_local_plate (rule, value, callback) {
        if (/[a-z]/.test(value)) {
          callback(new Error('车牌范围字母必须大写'));
        } else {
          callback();
        }
      },
      onSubmit(formName) {
        let _self = this;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let submitData = [];
            this.$store.state.editSelectedData.forEach(outer => {
              let cloneData = Object.assign({},_self.dataModels);
              cloneData.toll_pid = outer;
              submitData.push(cloneData);
            });
            let params = {
              table: 'SC_TOLL_TOLLGATEFEE',
              data: submitData,
              workFlag: appUtil.getGolbalData().workType,
              adminCode: appUtil.getGolbalData().adminCode
            };
            this.loading = true;
            updateTollGate(params)
              .then(result => {
                let {
                  errorCode
                } = result;
                let messageStr = '数据更新成功！'
                if (result.message) {
                  messageStr = result.message
                }
                const h = this.$createElement;
                if (errorCode === 0) {
                  this.$emit('tabStatusChange', {
                    status: false,
                    tabIndex: 5
                  });
                  fastmap.mapApi.scene.SceneController.getInstance().redrawLayerByGeoLiveTypes(['RDTOLLGATE']);
                  return this.$message({
                    message: messageStr,
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
          }
        });
      }
    },
    mounted() {
      let _self = this;
      this.mountFlag = true;
      if (this.$store.state.handleFlag === 'update') {
        let param = {
          table: 'SC_TOLL_TOLLGATEFEE',
          pid: this.$store.state.editSelectedData[0],
          workFlag: appUtil.getGolbalData().workType,
          adminCode: appUtil.getGolbalData().adminCode
        };
        this.loading = true;
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
  }
</script>

<style scoped>
  .grid-content {
    display: flex;
    flex-direction: row;
    margin: 15px 10px;
  }
  .grid-content .labelText {
    width: 110px;
    text-align: right;
  }
  .grid-content .inputPart {
    flex: 1
  }
  .footerPart {
    margin: 0 13px;
    text-align: right;
  }
  .el-select,.el-select--mini {
    display: block;
    width: 100%;
  }
</style>
