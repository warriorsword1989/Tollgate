<template>
  <el-form
  :model="dataModel"
  ref="dataModel"
  :inline="true"
  class="wraper"
  v-loading="loading"
  element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(243, 239, 239, 0.5);"
  >
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.name_bt" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.name_bt_id" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">收费类型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="dataModel.rate_class" placeholder="请选择">
              <el-option v-for="item in feeClass" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">实际收费的长度倍数：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.rato" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">加费：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.rate_add" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">客车车型编号：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.car_class" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">货车车型编号：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.truck_class" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">区间闭合标识：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="dataModel.tunnage_flag" placeholder="请选择">
              <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">计重吨数区间：</div>
          <div class="inputPart">
            <el-input v-model="dataModel.tunnage_min" size="mini"></el-input> -
            <el-input v-model="dataModel.tunnage_max" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list"></div>
      </div>
    </div>
    <div style="padding:10px 10px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataModel')">保 存</el-button>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import {updateTollGate} from '../../dataService/api';
  import {getTollGate} from '../../dataService/api';
  export default {
    name: 'scTollRdlinkBt',
    props: ['tableName'],
    data() {
      return {
        loading: true,
        dataModel: {
          car_class:null,
          group_id:1,
          name_bt:null,
          name_bt_id:1,
          rate_add:null,
          rate_class:1,
          rato:null,
          source:1,
          truck_class:null,
          tunnage_flag:null,
          tunnage_max:null,
          tunnage_min:1,
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
      dataModel: {
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
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
            table: 'SC_TOLL_RDLINK_BT',
            data: Object.assign(this.dataModel, {command: 'update'})
          };
          this.loading = true;
          updateTollGate(params)
            .then(result => {
            let {errorCode} = result;
              const h = this.$createElement;
              if (errorCode === 0) {
                this.$emit('tabStatusChange', {status: false, tabIndex: 8});
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted () {
      this.mountFlag = true;
      let param = {table: 'SC_TOLL_RDLINK_BT', pid: 55796611};
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
      console.log('mounted scTollRdlinkBt')
    },
    destroyed() {
      this.$emit('childDestroyed scTollRdlinkBt');
    }
  }
</script>

<style scoped>
  .grid-wraper {
    display: flex;
    flex-direction: row;
    margin: 10px;
  }

  .grid-content .grid-list {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  .grid-content .labelText {
    width: 150px;
    text-align: right;
  }

  .grid-content .inputPart {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .el-select,
  .el-select--mini{
    display: block;
    width: 100%;
  }
</style>
