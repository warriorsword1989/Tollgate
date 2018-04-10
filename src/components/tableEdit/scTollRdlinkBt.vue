<template>
  <div v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);">
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div title="桥梁或隧道名称：" class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="(this.dataModels.length && this.dataModels[0].name_bt) || originModel.name_bt" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div title="桥梁或隧道名称组号：" class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="(this.dataModels.length && this.dataModels[0].name_bt_id) || originModel.name_bt_id" size="mini"></el-input>
          </div>
        </div>
        <el-button @click="toggleSearchPanel(true)" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
        <el-button @click="deleteBridge()" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-delete"></el-button>
        <el-button @click="addItem()" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus"></el-button>
      </div>
    </div>
    <el-form
    v-for="(dataItem, index) in dataModels"
    :key="index"
    :model="dataItem"
    ref="dataItem"
    :inline="true"
    :inline-message="false"
    class="wraper">
      <div v-show="index==0" style="display: flex;" class="grid-content">
        <div class="grid-list">
          <div style="flex:1" title="收费类型：" class="labelText">收费类型：</div>
          <div style="flex:9" class="inputPart">
            <el-form-item prop="rate_class">
              <el-select @change="rateClassChange(dataItem.rate_class,index)" size="mini" v-model.number="dataItem.rate_class" placeholder="请选择">
                <el-option v-for="item in feeClass" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center" class="grid-content">
        <fieldset style="flex: 1" :style="dataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5'">
          <legend>{{index + 1}} 型桥梁隧道详情</legend>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="实际收费的长度倍数：" class="labelText">实际收费的长度倍数：</div>
              <div class="inputPart">
                <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="rato">
                  <el-input :disabled="dataModels[0].rate_class!=4" v-model="dataItem.rato" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="加费：" class="labelText">加费：</div>
              <div class="inputPart">
                <el-form-item :rules="[{ validator: check_addFee, trigger: 'change'}]" prop="rate_add">
                  <el-input :disabled="dataModels[0].rate_class!=2" v-model="dataItem.rate_add" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="客车车型编号：" class="labelText">客车车型编号：</div>
              <div class="inputPart">
                <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="car_class">
                  <el-input :disabled="dataModels[0].rate_class!=2" v-model="dataItem.car_class" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="货车车型编号：" class="labelText">货车车型编号：</div>
              <div class="inputPart">
                <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="truck_class">
                  <el-input :disabled="dataModels[0].rate_class!=2" v-model="dataItem.truck_class" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
              <div class="inputPart">
                <el-form-item prop="tunnage_flag">
                  <el-select :disabled="dataModels[0].rate_class!=2" size="mini" v-model.number="dataItem.tunnage_flag" placeholder="请选择">
                    <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="计重吨数区间：" class="labelText">计重吨数区间：</div>
              <div class="inputPart">
                <el-form-item :rules="[{ validator: checkTunage_min, trigger: 'change'}]" style="flex:5" prop="tunnage_min">
                  <el-input :disabled="dataModels[0].rate_class!=2" v-model.number="dataItem.tunnage_min" size="mini"></el-input>
                </el-form-item>
                <div style="flex:1">-</div>
                <el-form-item :rules="[{ validator: checkTunage_max, trigger: 'change'}]" style="flex:5" prop="tunnage_max">
                  <el-input :disabled="dataModels[0].rate_class!=2" v-model.number="dataItem.tunnage_max" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list"></div>
          </div>
        </fieldset>
        <el-button @click="deleteItem(index)" style="padding:5px;margin-left: 5px" type="primary" class="btn-icon" icon="el-icon-minus"></el-button>
      </div>
    </el-form>
    <div v-show="((hasData && $store.state.handleFlag=='update')||dataModels.length) || (dataModels.length && $store.state.handleFlag=='insert')" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
    <search-name @selectBtName="setBtNameAndGetBriage" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import searchName from './searchName';
  import {updateTollGate, getTollGate, deleteRdLinkBt} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollRdlinkBt',
    components: {searchName},
    data() {
      return {
        hasData: false,
        loading: false,
        serachShow: false,
        dataModels: [],
        originModel: {
          car_class:null,
          group_id: null,
          name_bt:'',
          name_bt_id:1,
          rate_add:null,
          rate_class:1,
          rato:null,
          source:this.$store.state.source,
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
        }]
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
      addItem () {
        if (!this.originModel.name_bt) {
          return this.$message({
                  message: '请先录入合法的桥梁隧道',
                  type: 'warning'
                });
        }
        let newObj = Object.assign({insertFlag: true}, this.originModel);
        this.$set(this.dataModels, this.dataModels.length, newObj);
        this.setBtName();
      },
      deleteItem () {
        this.dataModels.splice(index, 1);
      },
      checkTunage_max  (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        }
        if (value && (value <0 || value>1000 || value.toString().split('.').length > 1)) {
          callback(new Error('吨数区间最小值必须是0-1000内的整数'));
        }
        callback();
      },
      checkTunage_min (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        }
        if (value && (value < 0 || value > 1000 || value.toString().split('.').length > 1)) {
          callback(new Error('吨数区间最大值必须是0-1000内的整数'));
        }
        callback();
      },
      check_addFee (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        }
        if (value && (value < 0 || value > 80)) {
          callback(new Error('加费字段值域错误,必须为0-80的数字'));
        }
        callback();
      },
      // 如果存在的换验证数字是否为>=0的数字；
      validateNum (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        } else {
          callback();
        }
      },
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      deleteBridge () {
        this.dataModels.splice(0,this.dataModels.length);
      },
      rateClassChange(value, index) {
        this.dataModels.forEach(item => {
          if (value != 4) {
            item.rato = null;
          }
          if (value != 2) {
            item.car_class = null;
            item.rate_add = null;
            item.truck_class = null;
            item.tunnage_flag = null;
            item.tunnage_max = null;
            item.tunnage_min = null;
          }
        });
      },
      getTollgateBridge () {
        let param = {
          table: 'SC_TOLL_RDLINK_BT',
          pid: this.originModel.name_bt_id,
          workFlag: appUtil.getGolbalData().workType
        };
        this.loading = true;
        getTollGate(param)
        .then(result => {
          let {errorCode, data} = result;
          this.hasData = data.length ? true : false;
          if (errorCode == 0) {
            data.forEach(item => {
              item.rato = item.rato ? parseFloat(item.rato.toFixed(5)) : item.rato;
            });
            this.dataModels = data;
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
      },
      setBtName() {
        this.originModel.name_bt_id = this.$store.state.btData.name_groupid;
        this.originModel.name_bt = this.$store.state.btData.name;
        this.dataModels.forEach(item => {
          item.name_bt_id = this.$store.state.btData.name_groupid;
          item.name_bt = this.$store.state.btData.name;
        });
      },
      setBtNameAndGetBriage () {
        this.setBtName();
        this.getTollgateBridge();
      },
      onSubmit(formName) {
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        if (!this.dataModels.length) {
          let params = {
            table: 'SC_TOLL_RDLINK_BT',
            pid: this.originModel.name_bt_id,
            workFlag: appUtil.getGolbalData().workType
          };
          this.loading = true;
          deleteRdLinkBt(params)
          .then(res =>{
            let {errorCode,message,updateFlag} = res;
            if (errorCode === 0) {
              this.originModel.name_bt = null;
              this.originModel.name_bt_id = null;
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
          .finally(()=> {
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
        } else {
          let validateFlag = true;
          this.$refs[formName].forEach((formItem, index) => {
            formItem.validate((valid) => {
              if (!valid) {
                return validateFlag = false;
              }
            });
          });
          // 验证最小值不能大与最大值
          let alertMessage = '';
          this.dataModels.forEach((item,index) => {
            if (item.rate_class==2 && item.tunnage_min && item.tunnage_max && item.tunnage_min >= item.tunnage_max) {
              validateFlag = false;
              alertMessage += `${index+1}型桥梁隧道最小值必须比最大值小;`;
            }
          });

          if (validateFlag) {
            this.loading = true;
            let submitData = [];
            this.dataModels.forEach(item => {
              let cloneData = Object.assign({},item);
              cloneData.rate_class = this.dataModels[0].rate_class;
              delete item.insertFlag;
              delete cloneData.insertFlag;
              submitData.push(cloneData);
            });
            let params = {
              table: 'SC_TOLL_RDLINK_BT',
              data: submitData,
              workFlag: appUtil.getGolbalData().workType,
              adminCode: appUtil.getGolbalData().adminCode
            };
            updateTollGate(params)
            .then(result => {
              let {errorCode} = result;
              let messageStr = '数据更新成功！'
              if (result.message) {
                messageStr = result.message
              }
              const h = this.$createElement;
              if (errorCode === 0) {
                this.$emit('tabStatusChange', {
                  status: false,
                  tabIndex: 8
                });
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
            })
            .catch(err => {
              console.log(err);
            });
          } else {
            alertMessage && this.$alert(alertMessage, '错误提示', {
              confirmButtonText: '确定',
              type: 'error'
            })
          }
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
