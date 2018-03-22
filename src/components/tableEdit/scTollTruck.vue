<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <!-- 把这一行拿出来防止没有记录 -->
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">车型添加</el-button>
        <el-button @click="removeLimitItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">车型删除</el-button>
      </div>
    </div>
    <!-- 车型循环 -->
    <el-form v-for="(dataItem, index) in dataModels" :key="index" :model="dataItem" ref="dataItem" :inline="true" class="wraper">
      <div class="grid-content">
        <div v-show="index==0" class="grid-wraper">
          <div class="grid-list">
            <div title="桥梁或隧道名称组号：" class="labelText">桥梁或隧道名称组号：</div>
            <div class="inputPart">
              <el-input :disabled="true" v-model="dataItem.name_bt_id" size="mini"></el-input>
            </div>
          </div>
          <div class="grid-list">
            <div title="桥梁或隧道名称：" class="labelText">桥梁或隧道名称：</div>
            <div class="inputPart">
              <el-input :disabled="true" v-model="dataItem.name_bt" size="mini"></el-input>
            </div>
          </div>
          <el-button @click="toggleSearchPanel(true)" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
        </div>
        <div class="grid-wraper">
          <div class="grid-list">
            <fieldset :style="dataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend>{{numberTable[dataItem.truck_class-1]}} 型车</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="dataItem.tunnage_flag" placeholder="请选择">
                      <el-option v-for="item in tunnageFlagClass" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="各车型吨数区间：" class="labelText">各车型吨数区间：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-form-item prop="tunnage_min">
                        <el-input v-model.number="dataItem.tunnage_min" disabled size="mini"></el-input>
                      </el-form-item>
                      <span style="display:block;line-height:28px">-</span>
                      <el-form-item prop="tunnage_max" v-if="dataItem.truck_class!=5" :rules="[ { required: true, message: '不能为空'},{ type: 'number', message: '必须为数字'},{  validator: validateSeat0_55, trigger: 'change' }]">
                        <el-input v-model.number="dataItem.tunnage_max" @change="maxTunnageNumChange" size="mini"></el-input>
                      </el-form-item>
                      <el-form-item prop="tunnage_max" v-if='dataItem.truck_class==5'>
                        <el-input v-model.number="dataItem.tunnage_max" :disabled="dataItem.truck_class == 5" size="mini"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率（元/公里）非桥隧道：" class="labelText">费率（元/公里）非桥隧道：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateFloat1, trigger: 'change' }]" prop="rate">
                      <el-input @change="validateRate" v-model="dataItem.rate" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率车道数：" class="labelText">费率车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="dataItem.lane_num" placeholder="请选择">
                      <el-option v-for="item in laneNumOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="集装箱尺寸数：" class="labelText">集装箱尺寸数：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="container">
                      <el-input @change="validateContainer" v-model="dataItem.container" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="轴数：" class="labelText">轴数：</div>
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
                  <div title="轮数：" class="labelText">轮数：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="wheel_num">
                      <el-input v-model="dataItem.wheel_num" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="型号：" class="labelText">型号：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="model">
                      <el-input v-model="dataItem.model" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
               
              </div>
              <div class="grid-wraper">
                 <div class="grid-list">
                  <div title="桥隧道费率（元/车次）：" class="labelText">桥隧道费率（元/车次）：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate_bt">
                      <el-form-item :rules="[{ validator: validateFloat1, trigger: 'change' }]" prop="rate_bt">
                        <el-input @change="validateRateBt" v-model="dataItem.rate_bt" size="mini"></el-input>
                      </el-form-item>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list" v-show="isZheJiang">
                  <div title="车次加费（元）：" class="labelText">车次加费（元）：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="fee_add">
                      <el-input @change="validateFeeAdd" v-model="dataItem.fee_add" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list" v-show="!isZheJiang"></div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="最低收费（元）：" class="labelText">最低收费（元）：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="charge_min">
                      <el-input @change="validateChargeMin" v-model="dataItem.charge_min" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率1(元/公里)：" class="labelText">费率1(元/公里)：</div>
                  <div class="inputPart">
                    <el-form-item v-if="!isGuangdong" prop="rate1">
                      <el-input disabled @change="validateRate1" v-model="dataItem.rate1" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item v-if="isGuangdong" :rules="[{ validator: validateFloat1, trigger: 'change' }]" prop="rate1">
                      <el-input @change="validateRate1" v-model="dataItem.rate1" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率1车道数：" class="labelText">费率1车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="dataItem.lane_num1" placeholder="请选择">
                      <el-option v-for="item in laneNumOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="固定收费站对应次费：" class="labelText">固定收费站对应次费：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="fix_fee">
                      <el-input @change="validateFixFee" v-model="dataItem.fix_fee" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </el-form>
    <div v-show="((hasData && $store.state.handleFlag=='update')||dataModels.length) || (dataModels.length && $store.state.handleFlag=='insert')" style="padding:10px 20px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
    <search-name @selectBtName="setBtName" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import searchName from './searchName';
  import {updateTollGate,getTollGate,deleteCarTruckTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollCar',
    components: {searchName},
    data() {
      return {
        hasData: false,
        isClickSave: false,
        isGuangdong: false,
        isZheJiang: false,
        loading: false,
        serachShow: false,
        dataModels: [],
        originModel: {
          group_id: this.$store.state.editSelectedData[0],
          truck_class: 1,
          axle_num: null,
          wheel_num: null,
          model: null,
          tunnage_flag: 1,
          tunnage_min: 0,
          tunnage_max: 1,
          container: null,
          rate: null,
          fee_add: null,
          rate_bt: null,
          charge_min: null,
          lane_num: null,
          rate1: null,
          lane_num1: null,
          name_bt_id: 1,
          name_bt: '',
          fix_fee: null,
          source: this.$store.state.source
        },
        numberTable: ['一','二','三','四','五'],
        mountFlag: false,
        axleOptions: [{
          value: null,
          label: '空'
        },{
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
      // 如果存在的换验证数字是否为>=0的数字；
      validateNum (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        } else {
          callback();
        }
      },
      // 如果存在的换验证数字是正实数小数点一位；
      validateFloat1 (rule, value, callback) {
        if ((value!==null && value!=='') && !/^[0-9]+(\.[0-9]{1})+$/.test(value)) {
          callback(new Error('输入的数字必须保留一位小数点')); 
        } else {
          callback();
        }
      },
      validateContainer(value) {
        if (this.isClickSave)return;
        if (value != 20 && value != 40) {
          this.$alert('集装箱尺寸数不等于20或40!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      validateRate(value) {
        if (this.isClickSave)return;
        if (value < 0 || value > 3) {
          this.$alert('费率值小于0或者大于3!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      validateRate1(value) {
        if (this.isClickSave)return;
        if (value > 20) {
          this.$alert('费率1大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      validateFeeAdd(value) {
        if (this.isClickSave)return;
        if (value > 20) {
          this.$alert('车次加费大于20, 是否继续!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 隧道桥费率
      validateRateBt(value) {
        if (this.isClickSave)return;
        if (value > 20) {
          this.$alert('隧道桥费率值大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 最低收费
      validateChargeMin(value) {
        if (this.isClickSave)return;
        if (value > 20) {
          this.$alert('最低收费值大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 固定收费站对应次费
      validateFixFee(value) {
        if (this.isClickSave)return;
        if (value > 10 || value < 0) {
          this.$alert('固定收费站对应次费值大于10或者小于0!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      validateSeat0_55(rule, value, callback){
        if (value >55 || value < 0) {
          callback(new Error('吨数区间为0-55')); 
        } else {
          callback();
        }
      },
      maxTunnageNumChange() {
        for (let i=0;i<this.dataModels.length;i++) {
          if (i!=0) {
            this.dataModels[i].tunnage_min = this.dataModels[i-1].tunnage_max;
          }
        }
      },
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      setBtName() {
        this.originModel.name_bt_id = this.$store.state.btData.name_groupid;
        this.originModel.name_bt = this.$store.state.btData.name;
        this.dataModels.forEach(item => {
          item.name_bt_id = this.$store.state.btData.name_groupid;
          item.name_bt = this.$store.state.btData.name;
        });
      },
      // 添加车型;
      addItem() {
        if (this.dataModels.length===5)return;
        let modelLength = this.dataModels.length;
        let newObj = Object.assign({insertFlag: true}, this.originModel);
        newObj.truck_class = modelLength + 1;
        if (newObj.truck_class == 1) {
          newObj.tunnage_min = 0;
        } else {
          newObj.tunnage_min = this.dataModels.length?this.dataModels[modelLength - 1].tunnage_max:this.originModel.tunnage_max;
          // 最后类型的最大值为1000
          if (newObj.truck_class == 5) {
            newObj.tunnage_max = 1000;
          } else {
            // 控制最大值比最小值大1
            newObj.tunnage_max = parseInt(newObj.tunnage_min) + 1;
          }
        }
        this.$set(this.dataModels, this.dataModels.length, newObj);
        this.setBtName();
      },
      // 删除车型;
      removeLimitItem(index) {
        this.dataModels.pop();
      },
      afterValidate() {
        let submitData = [];
        this.$store.state.editSelectedData.forEach(outer => {
          this.dataModels.forEach(item => {
            let cloneData = Object.assign({},item);
            cloneData.group_id = outer;
            cloneData.source = this.$store.state.source;
            delete item.insertFlag;
            delete cloneData.insertFlag;
            submitData.push(cloneData);
          });
        });
        let params = {
          table: 'SC_TOLL_TRUCK',
          data: submitData,
          workFlag: appUtil.getGolbalData().workType,
          adminCode: appUtil.getGolbalData().adminCode
        };
        this.loading = true;
        updateTollGate(params)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          let messageStr = '数据更新成功！'
          if (result.message) {
            messageStr = result.message
          }
          if (errorCode === 0) {
            this.$emit('tabStatusChange', {
              status: false,
              tabIndex: 1
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
      },
      onSubmit(formName) {
        this.isClickSave = true;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        if (!this.dataModels.length) {
          let params = {
            table: 'SC_TOLL_TRUCK',
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
                tabIndex: 1
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
            if (item.tunnage_min >= item.tunnage_max) {
              validateFlag = false;
              alertMessage += `${index+1}车型最小值必须比最大值小;`;
            }
          });
          if (validateFlag) {
            this.loading = true;
            this.afterValidate();
          } else {
            alertMessage && this.$alert(alertMessage, '错误提示', {
              confirmButtonText: '确定',
              type: 'error'
            })
          }
        }
      }
    },
    mounted() {
      this.isGuangdong = appUtil.getGolbalData().adminCode == '210000';
      this.isZheJiang = appUtil.getGolbalData().adminCode == '130000';
      this.mountFlag = true;
      if (this.$store.state.handleFlag === 'update') {
        let param = {
          table: 'SC_TOLL_TRUCK',
          pid: this.$store.state.editSelectedData[0],
          workFlag: appUtil.getGolbalData().workType
        };
        this.loading = true;
        getTollGate(param)
          .then(result => {
            let {errorCode,data} = result;
            this.hasData = data.length ? true : false;
            this.dataModels = data;
          })
          .finally(() => {
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.loading = false;
        this.hasData = true;
      }
    }
  }

</script>

<style scoped>
  .content {
    margin: 0 15px;
  }
  fieldset {
    width:100%;
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
    flex:1;
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
    margin-bottom: 0;
    margin-right: 0;
  }

</style>
