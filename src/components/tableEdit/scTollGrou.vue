<template>
  <div 
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(243, 239, 239, 0.5);">
    <!-- 把这一行拿出来防止没有记录 -->
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">区间添加</el-button>
        <el-button @click="removeLimitItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">区间删除</el-button>
      </div>
    </div>
    <el-form
    v-for="(dataItem, index) in dataModels"
    :key="index"
    :model="dataItem"
    ref="dataItem"
    :inline="true"
    :rules="rules"
    class="tableEditPanel">
      <div class="grid-content">
        <fieldset :style="dataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
          <legend>{{index+1}} 区间</legend>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="区域标识：" class="labelText">区域标识：</div>
              <div class="inputPart">
                <el-input :disabled="true" v-model="dataItem.system_id" size="mini"></el-input>
              </div>
            </div>
            <div class="grid-list">
              <div title="ETC打折类型：" class="labelText">ETC打折类型：</div>
              <div class="inputPart">
              <el-form-item prop="etc_type">
                <el-select size="mini" @change="etcTypeChange" v-model.number="dataItem.etc_type" placeholder="请选择">
                  <el-option v-for="item in etcTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="ETC打折：" class="labelText">ETC打折：</div>
              <div class="inputPart">
                <el-form-item prop="etc_d">
                  <el-input type="number" v-model="dataItem.etc_d" size="mini">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="免费车型：" class="labelText">免费车型：</div>
              <div class="inputPart">
                <el-form-item prop="free_type">
                  <el-select size="mini" v-model="dataItem.free_type" @change='onSelectChange' multiple placeholder="请选择">
                    <el-option v-for="item in freeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="是否有绿色通道：" class="labelText">是否有绿色通道：</div>
              <div class="inputPart">
                <el-form-item prop="green_path">
                  <el-select size="mini" v-model.number="dataItem.green_path" placeholder="请选择">
                    <el-option v-for="item in geenPathOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="客车优惠车型：" class="labelText">客车优惠车型：</div>
              <div class="inputPart">
                <el-form-item prop="pre_car">
                  <el-select size="mini" v-model.number="dataItem.pre_car" placeholder="请选择">
                    <el-option v-for="item in carTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="客车优惠降低量：" class="labelText">客车优惠降低量：</div>
              <div class="inputPart">
                <el-form-item prop="dec_car">
                  <el-select size="mini" v-model.number="dataItem.dec_car" placeholder="请选择">
                    <el-option v-for="item in carTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="货车优惠空载车型：" class="labelText">货车优惠空载车型：</div>
              <div class="inputPart">
                <el-form-item prop="pre_truck_0">
                  <el-select size="mini" v-model.number="dataItem.pre_truck_0" placeholder="请选择">
                    <el-option v-for="item in truckTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="货车空载优惠降低量：" class="labelText">货车空载优惠降低量：</div>
              <div class="inputPart">
                <el-form-item prop="dec_truck">
                  <el-select size="mini" v-model.number="dataItem.dec_truck" placeholder="请选择">
                    <el-option v-for="item in truckTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="货车正常装载优惠吨数区间：" class="labelText">货车正常装载优惠吨数区间：</div>
              <div class="inputPart">
                <el-form-item style="flex:5" prop="pre_truck_loadmin">
                  <el-input @change="loadminChange" v-model="dataItem.pre_truck_loadmin" size="mini"></el-input>
                </el-form-item>
                <div style="flex:1">--</div>
                <el-form-item style="flex:5" prop="pre_truck_loadmax">
                  <el-input @change="loadmaxChange" v-model="dataItem.pre_truck_loadmax" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="货车正常装载优惠计费吨数：" class="labelText">货车正常装载优惠计费吨数：</div>
              <div class="inputPart">
                <el-form-item prop="pre_truck_load">
                  <el-input v-model="dataItem.pre_truck_load" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list">
              <div title="最低收费金额：" class="labelText">最低收费金额：</div>
              <div class="inputPart">
                <el-form-item prop="fee_limit">
                  <el-input @change="check_fee_limit" v-model="dataItem.fee_limit" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="grid-wraper">
            <div class="grid-list">
              <div title="收费取整：" class="labelText">收费取整：</div>
              <div class="inputPart">
                <el-form-item prop="round">
                <el-select size="mini" v-model.number="dataItem.round" placeholder="请选择">
                  <el-option v-for="item in roundTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="grid-list"></div>
          </div>
        </fieldset>
      </div>
    </el-form>
    <div  v-show="((hasData && $store.state.handleFlag=='update')||dataModels.length) || (dataModels.length && $store.state.handleFlag=='insert')" style="padding:10px 10px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {updateTollGate, getTollGate, deleteCarTruckTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollGrou',
    data() {
      let _self = this;
      // 如果存在的换验证数字是否为>=0的数字；
      let validateNum = (rule, value, callback) => {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        } else {
          callback();
        }
      };
      return {
        hasData: false,
        loading: false,
        mountFlag: false,
        dataModels: [],
        originModel: {
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
          source:this.$store.state.source,
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
          value: null,
          label: '空'
        },{
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
          value: null,
          label: '空'
        },{
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
            { validator: validateNum, trigger: 'change'}
          ],
          pre_truck_loadmax: [
            { validator: validateNum, trigger: 'change'}
          ],
          pre_truck_load: [
            { validator: validateNum, trigger: 'change'}
          ],
          fee_limit: [
            { validator: validateNum, trigger: 'change'}
          ],
          etc_d: [
            { validator: validateNum, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      onSelectChange (value) {
        if (!value.length) {
          this.$set(value, value.length, '0');
        }
        if (value.length > 1) {
          if (value[value.length-1] == '0') {
            value.length = 0;
            return this.$set(value, 0, '0');
          }
          if (value[0] == '0') {
            return value.shift();
          }
        }
      },
      addItem() {
        let newObj = Object.assign({insertFlag: true}, this.originModel);
        this.$set(this.dataModels, this.dataModels.length, newObj);
      },
      removeLimitItem() {
        this.dataModels.pop();
      },
      // ETC打折类型改变的事件监听;
      etcTypeChange (value) {
        this.$refs['dataItem'].forEach(item => {
          item.validateField('etc_d');
        });
      },
      loadmaxChange (value) {
        this.$refs['dataItem'].forEach(item => {
          item.validateField('pre_truck_loadmin');
        });
      },
      loadminChange (value) {
        this.$refs['dataItem'].forEach(item => {
          item.validateField('pre_truck_loadmax');
        });
      },
      check_fee_limit(value) {
        if (value > 20) {
          this.$confirm('最低收费金额大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      onSubmit(formName) {
        let _self = this;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        if (!this.dataModels.length) {
          let params = {
            table: 'SC_TOLL_GROUP_DETAIL',
            pid: this.$store.state.editSelectedData[0],
            workFlag: appUtil.getGolbalData().workType
          };
          this.loading = true;
          deleteCarTruckTollGate(params)
          .then(res =>{
            let {errorCode,message,updateFlag} = res;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 6
              });
              updateFlag && fastmap.mapApi.scene.SceneController.getInstance().redrawLayerByGeoLiveTypes(['RDTOLLGATE']);
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
            if ((item.pre_truck_loadmin && item.pre_truck_loadmax) && item.pre_truck_loadmin >= item.pre_truck_loadmax) {
              validateFlag = false;
              alertMessage += `${index+1}区间优惠吨数最小值必须比最大值小;`;
            }
            if ((!item.etc_type && item.etc_d) || (item.etc_type && !item.etc_d)) {
              validateFlag = false;
              alertMessage += `${index+1}区间etc类型与etc打折必须同时有值或同时为空;`;
            }
          });

          if (validateFlag) {
            let submitData = [];
            this.$store.state.editSelectedData.forEach(outer => {
              this.dataModels.forEach(item => {
                let cloneData = Object.assign({},item);
                cloneData.group_id = outer;
                cloneData.free_type = item.free_type ? item.free_type.join('|') : '0';
                delete item.insertFlag;
                delete cloneData.insertFlag;
                submitData.push(cloneData);
              });
            });
            let params = {
              table: 'SC_TOLL_GROUP_DETAIL',
              data: submitData,
              workFlag: appUtil.getGolbalData().workType,
              adminCode: appUtil.getGolbalData().adminCode
            };
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
                  tabIndex: 6
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
        let param = {table: 'SC_TOLL_GROUP_DETAIL', pid: this.$store.state.editSelectedData[0],workFlag: appUtil.getGolbalData().workType};
        this.loading = true;
        getTollGate(param)
        .then(result => {
          let {errorCode, data} = result;
          this.hasData = data.length ? true : false;
          if (errorCode == 0) {
            data.forEach(item => {
                item.free_type = item.free_type ? item.free_type.split('|') : ["0"];
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
      } else {
        this.hasData = true;
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
    flex: 1;
    margin-right: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
  }
  .grid-content .inputPart {
    flex: 2;
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
