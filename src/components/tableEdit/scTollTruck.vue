<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div style="width:140px" class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input v-model="dataModels[0] && dataModels[0].name_bt_id||originModel.name_bt_id" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div style="width:120px" class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input v-model="dataModels[0] && dataModels[0].name_bt||originModel.name_bt" size="mini"></el-input>
          </div>
        </div>
        <el-button @click="editBrage" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus"></el-button>
      </div>
    </div>
    <el-form v-for="(dataItem, index) in dataModels" :key="index" :model="dataItem" ref="dataItem" :inline="true" class="wraper">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <fieldset>
              <legend>{{index + 1}} 型车</legend>
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
                      <el-input v-model="dataItem.tunnage_min" size="mini"></el-input> -
                      <el-input v-model="dataItem.tunnage_max" size="mini"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">费率（元/公里）非桥隧道：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.rate" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">集装箱尺寸数：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.container" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">轴数：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="dataItem.axle_num" placeholder="请选择">
                      <el-option v-for="item in axleOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">型号：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.wheel_num" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">型号：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.model" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">桥隧道费率（元/车次）：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.rate_bt" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">车次加费（元）：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.fee_add" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">最低收费（元）：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.charge_min" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">固定收费站对应次费：</div>
                  <div class="inputPart">
                    <el-input v-model="dataItem.fix_fee" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list"></div>
              </div>
            </fieldset>
          </div>
          <el-button @click="removeLimitItem(index)" style="padding: 5px;height: 28px;margin: 100px 0;" type="primary" class="btn-icon"
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
      return {
        loading: true,
        dataModels: [],
        originModel: {
          group_id: 1,
          truck_class: 1,
          axle_num: null,
          wheel_num: null,
          model: null,
          tunnage_flag: 1,
          tunnage_min: 1,
          tunnage_max: 1,
          container: null,
          rate: null,
          fee_add: null,
          rate_bt: null,
          charge_min: null,
          lane_num: null,
          rate1: null,
          lane_num1: null,
          name_btId: null,
          name_bt: null,
          fix_fee: null
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
        if (this.dataModels.length > 4) {
          return console.log('不能大于5');
        }
        let addItemData = Object.assign({}, this.originModel);
        addItemData.truck_class = this.dataModels.length;
        addItemData.group_id = this.selectedData.tollgateId;
        this.dataModels.push(addItemData);
      },
      removeLimitItem(index) {
        this.dataModels.length > 1 && this.dataModels.splice(index, 1);
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
          let params = {
            table: 'SC_TOLL_TRUCK',
            data: this.dataModels
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
      this.mountFlag = true;
      let param = {
        table: 'SC_TOLL_TRUCK',
        pid: 55796611
      };
      getTollGate(param)
        .then(result => {
          let {
            errorCode,
            data
          } = result;
          _self.dataModels = data;
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
