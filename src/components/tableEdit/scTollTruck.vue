<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div style="width:140px" class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].name_bt_id||originModel.name_bt_id" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div style="width:120px" class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].name_bt||originModel.name_bt" size="mini"></el-input>
          </div>
        </div>
        <el-button @click="editBrage" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus"></el-button>
      </div>
    </div>
    <el-form v-for="(dataItem,keys, index) in dataModels" :rules="truckRules" :key="index" :model="dataItem" ref="dataItem" :inline="true" class="wraper">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <fieldset>
              <legend>{{dataItem.truck_class}} 型车</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">区间闭合标识：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="dataItem.tunnage_flag" placeholder="请选择">
                      <el-option v-for="item in tunnageFlagClass" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">各车型吨数区间：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-form-item prop="tunnage_min">
                        <el-input v-model="dataItem.tunnage_min" :disabled="index == 0" size="mini"></el-input>
                      </el-form-item>
                       -
                      <el-form-item prop="tunnage_max">
                        <el-input v-model="dataItem.tunnage_max" :disabled="index == 5" size="mini"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">费率（元/公里）非桥隧道：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate">
                      <el-input v-model="dataItem.rate" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">费率车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="isGuangdong" size="mini" v-model.number="dataItem.lane_num" placeholder="请选择">
                      <el-option v-for="item in laneNumOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">集装箱尺寸数：</div>
                  <div class="inputPart">
                    <el-form-item prop="container">
                      <el-input v-model="dataItem.container" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">轴数：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="dataItem.axle_num" placeholder="请选择">
                      <el-option v-for="item in axleOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
               <div class="grid-list">
                  <div class="labelText">轮数：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.wheel_num" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">型号：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.model" size="mini"></el-input>
                  </div>
                </div>
               
              </div>
              <div class="grid-wraper">
                 <div class="grid-list">
                  <div class="labelText">桥隧道费率（元/车次）：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate_bt">
                      <el-input v-model="dataItem.rate_bt" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list" v-show="isZheJiang">
                  <div class="labelText">车次加费（元）：</div>
                  <div class="inputPart">
                    <el-form-item prop="fee_add">
                      <el-input v-model="dataItem.fee_add" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">最低收费（元）：</div>
                  <div class="inputPart">
                    <el-form-item prop="charge_min">
                      <el-input v-model="dataItem.charge_min" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">费率1(元/公里)：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate1">
                      <el-input :disabled="isGuangdong" v-model="dataItem.rate1" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">费率1车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="isGuangdong" size="mini" v-model.number="dataItem.lane_num1" placeholder="请选择">
                      <el-option v-for="item in laneNumOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">固定收费站对应次费：</div>
                  <div class="inputPart">
                    <el-form-item prop="fix_fee">
                      <el-input v-model="dataItem.fix_fee" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <el-button @click="removeLimitItem(keys)" style="padding: 5px;height: 28px;margin: 100px 0;" type="primary" class="btn-icon"
            icon="el-icon-minus"></el-button>
        </div>
      </div>
    </el-form>
    <div style="padding:10px 20px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
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
    name: 'scTollCar',
    props: ['tableName', 'selectedData'],
    data() {
      let validateContainer = (rule, value, callback) => {
        let self = this;
        if (value != 20 || value != 40) {
          this.$confirm('集装箱尺寸数不等于20或40, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return callback();
          }).catch(() => {
            return callback(new Error('集装箱尺寸数不等于20或40'));         
          });
        }
      };
      // 费率
      let validateRate = (rule, value, callback) => {
        let self = this;
        if (value < 0 || value > 3) {
          this.$confirm('费率值小于0或者大于3, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return callback();
          }).catch(() => {
            return callback(new Error('费率值必须大于0或者小于3'));         
          });
        }
      };
      // 费率1
      let validateRate1 = (rule, value, callback) => {
        let self = this;
        if (value > 20) {
          this.$confirm('费率1大于20, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback();
          }).catch(() => {
            callback(new Error('费率1必须小于20'));         
          });
        }
      };
      let validateFeeAdd = (rule, value, callback) => {
        let self = this;
        if (value > 20) {
          this.$confirm('车次加费大于20, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return callback();
          }).catch(() => {
            return callback(new Error('车次加费不能大于20'));         
          });
        }
      };
      // 隧道桥费率
      let validateRateBt = (rule, value, callback) => {
        let self = this;
        if (value > 20) {
          this.$confirm('隧道桥费率值大于20, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback();
          }).catch(() => {
            callback(new Error('隧道桥费率值必须小于20'));         
          });
        }
      };
      // 最低收费
      let validateChargeMin = (rule, value, callback) => {
        let self = this;
        if (value > 20) {
          this.$confirm('最低收费值大于20, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback();
          }).catch(() => {
            callback(new Error('最低收费值必须小于20'));         
          });
        }
      };
      // 固定收费站对应次费
      let validateFixFee = (rule, value, callback) => {
        let self = this;
        if (value > 10 || value < 0) {
          this.$confirm('固定收费站对应次费值大于10或者小于0, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            callback();
          }).catch(() => {
            callback(new Error('固定收费站对应次费值必须大于0小于10'));         
          });
        }
      };
      // 车位
      let validateSeatNum = (rule, value, callback) => {
        let self = this;
        if (value >55 || value < 0) {
          callback(new Error('座位数必须大于0小于55')); 
        } else {
          callback();
        }
      };
      return {
        isGuangdong: false,
        isZheJiang: false,
        loading: true,
        dataModels: [],
        originModel: {
          group_id: this.selectedData.id,
          truck_class: 1,
          axle_num: 2,
          wheel_num: 0,
          model: 0,
          tunnage_flag: 1,
          tunnage_min: 1,
          tunnage_max: 1,
          container: 0,
          rate: 0,
          fee_add: 0,
          rate_bt: 0,
          charge_min: 0,
          lane_num: 0,
          rate1: 0,
          lane_num1: 0,
          name_bt_id: 0,
          name_bt: 0,
          fix_fee: 0,
          source: 0
        },
        truckRules: {
          container: [
            { validator: validateContainer, trigger: 'blur' }
          ],
          rate: [{ validator: validateRate, trigger: 'blur' }],
          rate1: [{ validator: validateRate1, trigger: 'blur' }],
          fee_add: [{ validator: validateFeeAdd, trigger: 'blur' }],
          rate_bt: [{ validator: validateRateBt, trigger: 'blur' }],
          charge_min: [{ validator: validateChargeMin, trigger: 'blur' }],
          fix_fee: [{ validator: validateFixFee, trigger: 'blur' }],
          tunnage_min: [{ validator: validateSeatNum, trigger: 'blur' }],
          tunnage_max: [{ validator: validateSeatNum, trigger: 'blur' }]
        },
        mountFlag: false,
        axleOptions: [{
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }, {
          value: 4,
          label: '4'
        }, {
          value: 5,
          label: '5'
        }, {
          value: 6,
          label: '6'
        }],
        tunnageFlagClass: [{
          value: 1,
          label: '前开后闭'
        }, {
          value: 2,
          label: '前闭后开'
        }, {
          value: 3,
          label: '前闭后闭'
        }],
        laneNumOptions: [{
          value: 0,
          label: '空'
        }, {
          value: 1,
          label: '4'
        }, {
          value: 2,
          label: '6'
        }]
      }
    },
    watch: {
      dataModels: {
        handler(newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {
              status: true,
              tabIndex: 1
            });
          } else {
            this.mountFlag = false;
          }
        },
        deep: true
      }
    },
    methods: {
      editBrage() {

      },
      addItem() {
        let _self = this;
        let existsKeys = Object.keys(this.dataModels);
        let allKeys = ['1', '2', '3', '4', '5'];
        let leftKeys = _.difference(allKeys, existsKeys);
        let validFlag = true;
        for (let i = 0; i < this.$refs.dataItem.length; i++) {
          this.$refs.dataItem[i].validate((valid) => {
            if (!valid) {
              validFlag = false;
            }
          })
        }
        if (validFlag && leftKeys.length) {
          let newObj = Object.assign({}, _self.originModel);
          if (leftKeys[0] === '1') {
            newObj.tunnage_min = 0;
          } else {
            newObj.tunnage_min = this.dataModels[leftKeys[0] - 1].tunnage_max;
            // 最后类型的最大值为1000
            if (leftKeys[0] === allKeys[allKeys.length - 1]) {
              newObj.tunnage_max = 1000;
            } else {
              // 控制最大值比最小值大1
              newObj.tunnage_max = newObj.tunnage_min + 1;
            }
          }
          newObj.truck_class = leftKeys[0];
          _self.$set(_self.dataModels, leftKeys[0], newObj);
        } else {
          this.$message({
            type: 'info',
            message: `输入不合法，请检查输入`
          });
        }
      },
      removeLimitItem(index) {
        this.$delete(this.dataModels, index);
      },
      onSubmit(formName) {
        let validateFlag = true;
        this.$refs[formName].forEach((formItem, index) => {
          formItem.validate((valid) => {
            if (valid) {
              this.loading = true;
            } else {
              return validateFlag = false;
            }
          });
        });
        if (validateFlag) {
          let submitData = [];
          Object.keys(this.dataModels).forEach(item => {
            submitData.push(this.dataModels[item]);
          });
          let params = {
            table: 'SC_TOLL_TRUCK',
            data: submitData
          };
          updateTollGate(params)
          .then(result => {
            let {
              errorCode
            } = result;
            const h = this.$createElement;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 1
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
        }
      }
    },
    mounted() {
      let _self = this;
      this.isGuangdong = this.$route.params.adminCode == '440000';
      this.isZheJiang = this.$route.params.adminCode == '330000';
      this.mountFlag = true;
      let param = {
        table: 'SC_TOLL_TRUCK',
        pid: this.selectedData.id
      };
      getTollGate(param)
        .then(result => {
          let {
            errorCode,
            data
          } = result;
          let transfromData = _.groupBy(data, 'truck_class');
          Object.keys(transfromData).forEach(item => {
            transfromData[item] = transfromData[item][0]
          });
          _self.dataModels = transfromData;
          console.log(transfromData);
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
  fieldset {
    padding: 0;
    border: 1px dashed #636ef5;
  }

  fieldset legend {
    color: #151616;
    font-size: 14px;
    font-weight: bold;
  }

  .grid-wraper {
    display: flex;
    flex-direction: row;
    margin: 10px 0;
  }

  .grid-content {
    padding: 0 15px;
  }

  .grid-content .grid-list {
    flex: 1;
    padding: 0 5px;
    display: flex;
    flex-direction: row;
  }

  .grid-content .labelText {
    width: 100px;
    margin-right: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
  }

  .grid-content .inputPart {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .el-select,
  .el-select--mini {
    display: block;
    width: 100%;
  }

</style>
