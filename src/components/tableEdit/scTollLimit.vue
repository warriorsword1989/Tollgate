<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div style="width:140px" class="labelText">行政区域标识：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].system_id || originModel.system_id" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div style="width:120px" class="labelText">行政区划名称：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].admin_name || originModel.admin_name" size="mini"></el-input>
          </div>
        </div>
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus"></el-button>
      </div>
    </div>
    <el-form  :rules="rules" v-for="(dataItem, index) in dataModels" :key="index" :model="dataItem" ref="dataItem" :inline="true" class="wraper">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <fieldset :style="dataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend>限重标准 {{index + 1}}</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div class="labelText">轴数限载标准：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-form-item prop="axle_num_limit">
                        <el-input type="number" @change="check_axle_num_limit" v-model.number="dataItem.axle_num_limit" size="mini"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">型号限载标准：</div>
                  <div class="inputPart">
                    <el-form-item prop="model_limit">
                      <el-input type="number" v-model.number="dataItem.model_limit" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div class="labelText">吨数限载标准：</div>
                  <div class="inputPart">
                    <el-form-item prop="ton_limit">
                      <el-input type="number" @change="check_ton_limit" v-model.number="dataItem.ton_limit" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <el-button @click="removeLimitItem(index)" style="padding: 5px;height: 28px;margin-top: 40px" type="primary" class="btn-icon"
            icon="el-icon-minus"></el-button>
        </div>
      </div>
    </el-form>
    <div style="padding:10px 20px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
    </el-form>
  </div>
</template>

<script>
  import {updateTollGate, getTollGate} from '../../dataService/api';
  import {cityList, getCityNameByCode} from '../../config/CityList';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollCar',
    data() {
      return {
        isClickSave: false,
        loading: true,
        dataModels: {},
        originModel: {
          system_id: appUtil.getGolbalData().adminCode,
          admin_name: getCityNameByCode(appUtil.getGolbalData().adminCode),
          axle_num_limit: 2,
          model_limit: 0,
          ton_limit: 1,
          source: 1
        },
        mountFlag: false,
        rules: {
          axle_num_limit: [
            { required: true, message: '轴数不能为空!', trigger: 'change' },
            { type: 'number', message: '轴数必须为数字'}
          ],
          ton_limit: [
            { required: true, message: '吨数不能为空!', trigger: 'change' },
            { type: 'number', message: '吨数必须为数字'}
          ],
          model_limit: [
            { required: true, message: '型号不能为空!', trigger: 'change' },
            { type: 'number', message: '型号必须为数字'}
          ]
        } 
      }
    },
    watch: {
      dataModels: {
        handler(newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {
              status: true,
              tabIndex: 7
            });
          } else {
            this.mountFlag = false;
          }
        },
        deep: true
      }
    },
    methods: {
      check_axle_num_limit(value) {
        if (this.isClickSave)return;
        if (value < 2 || value > 10) {
          this.$alert('轴数小于2或大于10!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      check_ton_limit(value) {
        if (this.isClickSave)return;
        if (value < 0 || value > 100) {
          this.$alert('吨数小于0或大于100!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        } 
      },
      addItem() {
        let addItemData = Object.assign({insertFlag: true}, this.originModel);
        this.dataModels.push(addItemData);
      },
      removeLimitItem(index) {
        this.dataModels.length > 1 && this.dataModels.splice(index, 1);
      },
      onSubmit(formName) {
        let _self = this;
        this.isClickSave = true;
        let validateFlag = true;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        this.$refs[formName].forEach((formItem, index) => {
          formItem.validate((valid) => {
            if (!valid) {
              return validateFlag = false;
            }
          });
        });
        if (validateFlag) {
          this.loading = true;
          let submitData = [];
          this.dataModels.forEach(item => {
            let cloneData = Object.assign({},item);
            delete cloneData.insertFlag;
            delete item.insertFlag;
            submitData.push(cloneData);
          });
          let params = {
            table: 'SC_TOLL_LIMIT',
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
                tabIndex: 7
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
            this.isClickSave = false;
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
    },
    mounted() {
      this.mountFlag = true;
      let param = {
        table: 'SC_TOLL_LIMIT',
        pid: appUtil.getGolbalData().adminCode,
        workFlag: appUtil.getGolbalData().workType
      };
      getTollGate(param)
        .then(result => {
          let {errorCode,data} = result;
          this.dataModels = data;
        })
        .finally(() => {
          this.loading = false;
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
    width:100%;
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
