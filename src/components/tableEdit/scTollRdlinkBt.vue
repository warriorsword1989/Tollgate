<template>
  <div v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form
    :model="dataModels"
    ref="dataModels"
    :inline="true"
    :rules="rules"
    :inline-message="false"
    class="wraper">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <div title="桥梁或隧道名称：" class="labelText">桥梁或隧道名称：</div>
            <div class="inputPart">
              <el-form-item prop="name_bt">
                <el-input :disabled="true" v-model="dataModels.name_bt" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div title="桥梁或隧道名称组号：" class="labelText">桥梁或隧道名称组号：</div>
            <div class="inputPart">
              <el-form-item prop="name_bt_id">
                <el-input :disabled="true" v-model="dataModels.name_bt_id" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-button @click="toggleSearchPanel(true)" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div title="收费类型：" class="labelText">收费类型：</div>
            <div class="inputPart">
              <el-form-item prop="rate_class">
                <el-select @change="rateClassChange" size="mini" v-model.number="dataModels.rate_class" placeholder="请选择">
                  <el-option v-for="item in feeClass" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div title="实际收费的长度倍数：" class="labelText">实际收费的长度倍数：</div>
            <div class="inputPart">
              <el-form-item prop="rato">
                <el-input type="number" :disabled="dataModels.rate_class!=4" v-model="dataModels.rato" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div title="加费：" class="labelText">加费：</div>
            <div class="inputPart">
              <el-form-item prop="rate_add">
                <el-input type="number" v-model.number="dataModels.rate_add" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div title="客车车型编号：" class="labelText">客车车型编号：</div>
            <div class="inputPart">
              <el-form-item prop="car_class">
                <el-input type="number" :disabled="dataModels.rate_class!=2" v-model="dataModels.car_class" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div title="货车车型编号：" class="labelText">货车车型编号：</div>
            <div class="inputPart">
              <el-form-item prop="truck_class">
                <el-input type="number" :disabled="dataModels.rate_class!=2" v-model="dataModels.truck_class" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list">
            <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
            <div class="inputPart">
              <el-form-item prop="tunnage_flag">
                <el-select :disabled="dataModels.rate_class!=2" size="mini" v-model.number="dataModels.tunnage_flag" placeholder="请选择">
                  <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <div title="计重吨数区间：" class="labelText">计重吨数区间：</div>
            <div class="inputPart">
              <el-form-item style="flex:5" prop="tunnage_min">
                <el-input type="number" :disabled="dataModels.rate_class!=2" v-model.number="dataModels.tunnage_min" size="mini"></el-input>
              </el-form-item>
              <div style="flex:1">--</div>
              <el-form-item style="flex:5" prop="tunnage_max">
                <el-input type="number" :disabled="dataModels.rate_class!=2" v-model.number="dataModels.tunnage_max" size="mini"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid-list"></div>
        </div>
      </div>
      <div class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit('dataModels')">保 存</el-button>
        </el-row>
      </div>
    </el-form>
    <search-name @selectBtName="setBtName" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import searchName from './searchName';
  import {updateTollGate, getTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollRdlinkBt',
    components: {searchName},
    data() {
      let _self = this;
      let checkTunage_max = (rule, value, callback) => {
        if (value && value <= _self.dataModels.tunnage_min) {
          callback(new Error('吨数区间最小值必须小于最大值'));
        }
        if (value && (value <0 || value>1000 || value.toString().split('.').length > 1)) {
          callback(new Error('吨数区间最小值必须是0-1000内的整数'));
        }
        callback();
      };
      let checkTunage_min = (rule, value, callback) => {
        if (value && (value >= _self.dataModels.tunnage_max || value.toString().split('.').length > 1)) {
          callback(new Error('吨数区间最小值必须小于最大值'));
        }
        if (value && (value < 0 || value > 1000 || value.toString().split('.').length > 1)) {
          callback(new Error('吨数区间最大值必须是0-1000内的整数'));
        }
        callback();
      };
      let check_addFee = (rule, value, callback) => {
        if (value && (value < 0 || value > 10)) {
          callback(new Error('加费字段值域错误,必须为0-10的数字'));
        }
        callback();
      };
      return {
        loading: false,
        serachShow: false,
        dataModels: {
          car_class:null,
          group_id: 1,
          name_bt:'',
          name_bt_id:1,
          rate_add:0,
          rate_class:1,
          rato:null,
          source:1,
          truck_class:null,
          tunnage_flag:null,
          tunnage_max:null,
          tunnage_min:null,
        },
        originModel: {
          car_class:null,
          group_id: 1,
          name_bt:'',
          name_bt_id:1,
          rate_add:0,
          rate_class:1,
          rato:null,
          source:1,
          truck_class:null,
          tunnage_flag:null,
          tunnage_max:null,
          tunnage_min:null,
        },
        mountFlag: false,
        options: [{
          value: 0,
          label: '空'
        }, {
          value: 1,
          label: '4'
        }, {
          value: 2,
          label: '6'
        }],
        feeClass: [{
          value: 1,
          label: '按正常里程收费，无特殊加费'
        }, {
          value: 2,
          label: '按正常里程收费，同时有殊加费'
        }, {
          value: 3,
          label: '按特定桥隧道收费标准收费'
        }, {
          value: 4,
          label: '特定桥隧道收费标准为正常里程的倍数'
        }],
        flagOptions: [{
          value: 1,
          label: '前开后闭'
        }, {
          value: 2,
          label: '前闭后开'
        }, {
          value: 3,
          label: '前闭后闭'
        }],
        rules: {
          tunnage_min: [
            { type: 'number', message: '计重吨数必须为数字'},
            { validator: checkTunage_min, trigger: 'change'}
          ],
          tunnage_max: [
            { type: 'number', message: '计重吨数必须为数字'},
            { validator: checkTunage_max, trigger: 'change'}
          ],
          rate_add: [
            { type: 'number', message: '加费必须为数字'},
            { validator: check_addFee, trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      dataModels: {
        handler (newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {status: true, tabIndex: 8});
          } else {
            this.mountFlag = false;
          }
        },
        deep:true
      }
    },
    methods: {
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      rateClassChange(value){
        if (value != 4) {
          this.dataModels.rato = null;
        }
        if (value != 2) {
          this.dataModels.truck_class = null;
          this.dataModels.tunnage_flag = null;
          this.dataModels.tunnage_max = null;
          this.dataModels.tunnage_min = null;
        }
      },
      setBtName() {
        this.dataModels.name_bt_id = this.$store.state.btData.name_groupid;
        this.dataModels.name_bt = this.$store.state.btData.name;
        let param = {table: 'SC_TOLL_RDLINK_BT', pid: this.dataModels.name_bt_id, workFlag: appUtil.getGolbalData().workType};
        this.loading = true;
        getTollGate(param)
        .then(result => {
          let {errorCode, data} = result;
          if (data.length) {
            this.dataModels = Object.assign({},data[0]);
          } else {
            this.dataModels = Object.assign({},this.originModel);
            this.dataModels.name_bt_id = this.$store.state.btData.name_groupid;
            this.dataModels.name_bt = this.$store.state.btData.name;
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
      },
      onSubmit(formName) {
        let validateFlag = true;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            validateFlag = false;
          }
        });
        this.loading = true;
        if (validateFlag) {
          let params = {
            table: 'SC_TOLL_RDLINK_BT',
            data: [this.dataModels],
            workFlag: appUtil.getGolbalData().workType,
            adminCode: appUtil.getGolbalData().adminCode
          };
          updateTollGate(params)
          .then(result => {
            let {errorCode} = result;
            const h = this.$createElement;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 8
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
    mounted () {
      this.mountFlag = true;
    }
  }
</script>

<style scoped>
  .grid-content {
    padding: 10px
  }
  .grid-wraper {
    display: flex;
    flex-direction: row;
    margin: 15px 0;
  }
  .grid-content .grid-list {
    flex: 1;
    margin: 0 10px;
    display: flex;
    flex-direction: row;
  }
  .grid-content .labelText {
    flex: 1;
    margin-right: 5px;
    white-space:nowrap;
    text-overflow:ellipsis; 
    overflow:hidden;
    text-align: right;
  }
  .grid-content .inputPart {
    flex: 2;
    display: flex;
    flex-direction: row;
  }
  .footerPart {
     padding:10px 20px 0 0;
     text-align: right;
  }
  .el-select,.el-select--mini{
    display: block;
    width: 100%;
  }
  .inputPart .el-form-item {
    width: 100%;
    margin-bottom: 0
  }
</style>
