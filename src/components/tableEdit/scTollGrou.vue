<template>
  <div 
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form
    :model="dataModels"
    ref="dataModels"
    :inline="true"
    :rules="rules"
    class="tableEditPanel">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">区域标识：</div>
            <div class="inputPart">
              <el-input :disabled="true" v-model="dataModels.system_id" size="mini"></el-input>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">ETC打折类型：</div>
            <div class="inputPart">
            <el-form-item prop="etc_type">
              <el-select size="mini" v-model.number="dataModels.etc_type" placeholder="请选择">
                <el-option v-for="item in etcTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">ETC打折：</div>
            <div class="inputPart">
              <el-form-item prop="etc_d">
                <el-input placeholder="%" type="number" v-model.number="dataModels.etc_d" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">免费车型：</div>
            <div class="inputPart">
              <el-form-item prop="free_type">
                <el-select size="mini" v-model="free_type_computed" multiple placeholder="请选择">
                  <el-option v-for="item in freeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">是否有绿色通道：</div>
            <div class="inputPart">
              <el-form-item prop="green_path">
                <el-select size="mini" v-model.number="dataModels.green_path" placeholder="请选择">
                  <el-option v-for="item in geenPathOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">客车优惠车型：</div>
            <div class="inputPart">
              <el-form-item prop="pre_car">
                <el-select size="mini" v-model.number="dataModels.pre_car" placeholder="请选择">
                  <el-option v-for="item in carTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">客车优惠降低量：</div>
            <div class="inputPart">
              <el-form-item prop="dec_car">
                <el-input type="number" v-model.number="dataModels.dec_car" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">货车优惠空载车型：</div>
            <div class="inputPart">
              <el-form-item prop="pre_truck_0">
                <el-select size="mini" v-model.number="dataModels.pre_truck_0" placeholder="请选择">
                  <el-option v-for="item in truckTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">货车空载优惠降低量：</div>
            <div class="inputPart">
              <el-form-item prop="dec_truck">
                <el-input type="number" v-model.number="dataModels.dec_truck" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">货车正常装载优惠吨数区间：</div>
            <div class="inputPart">
              <el-form-item style="flex:5" prop="pre_truck_loadmin">
                <el-input type="number" v-model.number="dataModels.pre_truck_loadmin" size="mini"></el-input>
              </el-form-item>
              <div style="flex:1">--</div>
              <el-form-item style="flex:5" prop="pre_truck_loadmax">
                <el-input type="number" v-model.number="dataModels.pre_truck_loadmax" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">货车正常装载优惠计费吨数：</div>
            <div class="inputPart">
              <el-form-item prop="pre_truck_load">
                <el-input type="number" v-model.number="dataModels.pre_truck_load" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div class="labelText">最低收费金额：</div>
            <div class="inputPart">
              <el-form-item prop="fee_limit">
                <el-input type="number" v-model.number="dataModels.fee_limit" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div class="labelText">收费取整：</div>
            <div class="inputPart">
              <el-form-item prop="round">
              <el-select size="mini" v-model.number="dataModels.round" placeholder="请选择">
                <el-option v-for="item in roundTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list"></div>
        </div>
        <div style="padding:10px 10px 0 0;text-align: right;" class="footerPart">
          <el-row :gutter="5">
            <el-button type="primary" @click="onSubmit('dataModels')">保 存</el-button>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {updateTollGate, getTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollGrou',
    props: ['tableName', 'selectedData'],
    data() {
      let _self = this;
      let check_max = (rule, value, callback) => {
        if (value <= _self.dataModels.pre_truck_loadmin) {
          callback(new Error('区间不合法'));
        }
        callback();
      };
      let check_min = (rule, value, callback) => {
        if (value >= _self.dataModels.pre_truck_loadmax) {
          callback(new Error('区间不合法'));
        }
        callback();
      };
      let check_etc_type = (rule, value, callback) => {
        if ((value && !_self.dataModels.etc_d) || (!value && _self.dataModels.etc_d)) {
          callback(new Error('etc类型与etc打折必须同时有值或同时为空'));
        }
        callback();
      };
      let check_etc_d = (rule, value, callback) => {
        if ((value && !_self.dataModels.etc_type) || (!value && _self.dataModels.etc_type)) {
          callback(new Error('etc类型与etc打折必须同时有值或同时为空'));
        }
        callback();
      }
      return {
        loading: false,
        mountFlag: false,
        dataModels: {
          axle_num_limit:null,
          dec_car:null,
          dec_truck:1,
          etc_d:1,
          etc_type:1,
          fee_limit:null,
          free_type:"0",
          green_path:1,
          group_id: this.$store.state.editSelectedData[0],
          model_limit:null,
          pre_car:null,
          pre_truck_0:null,
          pre_truck_load:null,
          pre_truck_loadmax:null,
          pre_truck_loadmin:null,
          round:null,
          source:1,
          system_id:appUtil.getGolbalData().adminCode,
          ton_limit:null
        },
        geenPathOptions: [{
          value: 0,
          label: '无'
        }, {
          value: 1,
          label: '有'
        }],
        etcTypeOptions: [{
          value: 0,
          label: '无'
        }, {
          value: 1,
          label: '客车'
        }, {
          value: 2,
          label: '货车'
        }],
        freeTypeOptions: [{
          value: '0',
          label: '无'
        }, {
          value: '1',
          label: '军车'
        }, {
          value: '2',
          label: '鲜活农产品'
        }],
        carTypeOptions: [{
          value: 1,
          label: '1'
        }, {
          value: 2,
          label: '2'
        }, {
          value: 3,
          label: '3'
        }, {
          value: 4,
          label: '4'
        }],
        truckTypeOptions: [{
          value: 1,
          label: '1'
        }, {
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
        }],
        roundTypeOptions: [{
          value: 0,
          label: '无取整'
        }, {
          value: 1,
          label: '将元位作三舍为零四进入五，七舍为五八进入十处理'
        }, {
          value: 2,
          label: '直接取整'
        }, {
          value: 3,
          label: '四舍五入'
        }, {
          value: 4,
          label: '2.5元以下舍，2.51至7.5元归5元，7.51至9.99元进10元'
        }, {
          value: 5,
          label: ' 3.49元以下舍，3.5-7.49元归5元，7.5-9.99元归10元'
        }],
        rules: {
          pre_truck_loadmin: [
            { type: 'number', message: '值必须为数字'},
            { validator: check_min, trigger: 'blur'}
          ],
          pre_truck_loadmax: [
            { type: 'number', message: '值必须为数字'},
            { validator: check_max, trigger: 'blur'}
          ],
          etc_type: [
            { validator: check_etc_type, trigger: 'blur'}
          ],
          etc_d: [
            { validator: check_etc_d, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      free_type_computed: {
        get: function () {
          if (this.dataModels.free_type) {
            return this.dataModels.free_type.split('|');
          }
          return ["0"];
        },
        set: function (newValue) {
          this.dataModels.free_type = newValue!=0 ? newValue.join('|') : "0";
        }
      }
    },
    methods: {
      onSubmit(formName) {
        let _self = this;
        let validateFlag = true;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
          } else {
            validateFlag = false;
          }
        });
        if (validateFlag) {
          let submitData = [];
          this.$store.state.editSelectedData.forEach(outer => {
            let cloneData = Object.assign({},_self.dataModels);
            cloneData.group_id = outer;
            submitData.push(cloneData);
          });
          let params = {
            table: 'SC_TOLL_GROUP',
            data: submitData,
            workFlag: appUtil.getGolbalData().workType,
            adminCode: appUtil.getGolbalData().adminCode
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
                tabIndex: 6
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
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
    },
    watch: {
      dataModels: {
        handler (newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {status: true, tabIndex: 6});
          } else {
            this.mountFlag = false;
          }
        },
        deep:true
      }
    },
    mounted(){
      this.mountFlag = true;
      if (this.$store.state.handleFlag === 'update') {
        let param = {table: 'SC_TOLL_GROUP', pid: this.$store.state.editSelectedData[0],workFlag: appUtil.getGolbalData().workType};
        this.loading = true;
        getTollGate(param)
        .then(result => {
          let {errorCode, data} = result;
          if (data.length) {
            this.dataModels = data[0];
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>

<style scoped>
   .grid-wraper {
    display: flex;
    flex-direction: row;
    margin: 15px 0;
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
  .inputPart .el-form-item {
    width: 100%;
    margin-bottom: 0
  }
</style>
