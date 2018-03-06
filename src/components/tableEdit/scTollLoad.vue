<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <!-- 一条没有的显示 -->
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">装载类别添加</el-button>
        <el-button @click="minusOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">装载类别删除</el-button>
      </div>
    </div>
    <div v-for="(dataItem, outerIndex) in dataModels" :key="outerIndex" :inline="true" class="wraper">
      <div style="margin-bottom: 5x;display:flex;flex-direction:column" class="grid-content">
        <el-form v-for="(innerDataItem, innerIndex) in dataItem" :key="innerIndex" :model="innerDataItem" ref="dataItem" style="display: flex;flex-direction: column;padding:0" class="grid-list">
          <!-- 桥梁隧道名称 -->
          <div v-show="outerIndex==0 && innerIndex==0" class="grid-wraper">
            <div class="grid-list">
              <div title="桥梁或隧道名称组号：" class="labelText">桥梁或隧道名称组号：</div>
              <div class="inputPart">
                <el-input :disabled="true" v-model="innerDataItem.name_bt_id" size="mini"></el-input>
              </div>
            </div>
            <div class="grid-list">
              <div title="桥梁或隧道名称：" class="labelText">桥梁或隧道名称：</div>
              <div class="inputPart">
                <el-input :disabled="true" v-model="innerDataItem.name_bt" size="mini"></el-input>
              </div>
            </div>
            <el-button @click="toggleSearchPanel(true)" style="padding:5px;height:28px;margin:3px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
          </div>
          <!-- 装载类型显示 -->
          <div v-show="innerIndex==0" style="justify-content: flex-end;" class="grid-wraper">
            <el-button @click="addInner(outerIndex)" style="padding:5px;height:28px;margin:3px" type="primary" class="btn-icon" icon="el-icon-circle-plus-outline">装载区间添加</el-button>
            <el-button @click="minusInner(outerIndex, innerIndex)" style="padding:5px;height:28px;margin:3px" type="primary" class="btn-icon" icon="el-icon-minus">装载区间添加</el-button>
          </div>
          <div v-show="innerIndex==0" class="grid-wraper">
            <div class="grid-list">
              <div class="labelText">
                <span style="font-weight:bold;font-size:14px;color:#66b1ff">{{numberTable[innerDataItem.loading_class - 1]}}类装载：</span>
              </div>
              <div style="width:180px" class="labelText">区间闭合标识：</div>
              <div class="inputPart">
                <el-select size="mini" v-model.number="innerDataItem.tunnage_flag" placeholder="请选择">
                  <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="grid-list">
              <div class="labelText" title="正常装载级别吨数范围(车货总重)">正常装载级别吨数范围(车货总重)：</div>
              <div class="inputPart">
                > 
                <el-form-item prop="tunnage_min">
                  <el-input v-model="innerDataItem.tunnage_min" disabled size="mini"></el-input>
                </el-form-item>
                <= 
                <el-form-item prop="tunnage_max">
                  <el-input v-model="innerDataItem.tunnage_max" :rules="[{ validator: validateTunnage, trigger: 'change' }]" v-show="outerIndex!=4" @change="setLevelRelate" size="mini"></el-input>
                  <el-input v-model="innerDataItem.tunnage_max" v-show="outerIndex==4" :disabled="outerIndex==4" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- 装载类型内装载区间数据循环 -->
          <div style="display:flex;flex-direction: row;">
            <fieldset :style="innerDataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend style="font-size:12px">{{numberTable[innerDataItem.loading_subclss - 1]}} 区间</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="innerDataItem.interval_flag" placeholder="请选择">
                      <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="正常装载区间吨数范围：" class="labelText">正常装载区间吨数范围：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-input disabled v-model="innerDataItem.interval_min" size="mini"></el-input> -
                      <el-input :disabled="innerIndex==dataItem.length-1" @change="setRangeRelate" v-model="innerDataItem.interval_max" size="mini"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="基本费率：" class="labelText">基本费率：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate_base">
                      <el-input @change="validateRateBase" v-model="innerDataItem.rate_base" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率上限(广东为倍数)：" class="labelText">费率上限(广东为倍数)：</div>
                  <div class="inputPart">
                    <el-input @change="validateRateMin" v-model="innerDataItem.rate_min" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率下限(广东为倍数)：" class="labelText">费率下限(广东为倍数)：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.rate_max" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="基本费率车道数：" class="labelText">基本费率车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="innerDataItem.lane_num" placeholder="请选择">
                      <el-option v-for="item in feeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费 率 1：" class="labelText">费 率 1：</div>
                  <div class="inputPart">
                    <el-input :disabled="!isGuangdong" v-model="innerDataItem.rate_base1" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率1车道数：" class="labelText">费率1车道数：</div>
                  <div class="inputPart">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="innerDataItem.lane_num1" placeholder="请选择">
                      <el-option v-for="item in feeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="最低计重(吨)：" class="labelText">最低计重(吨)：</div>
                  <div class="inputPart">
                    <el-form-item prop="weight_min">
                      <el-input v-model="innerDataItem.weight_min" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="最低收费(元)：" class="labelText">最低收费(元)：</div>
                  <div class="inputPart">
                    <el-form-item prop="charge_min">
                      <el-input @change="validateChargeMin" v-model="innerDataItem.charge_min" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </el-form>
      </div>
    </div>
    <div v-show="dataModels.length" style="padding:10px 20px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
    <search-name @selectBtName="setBtName" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import searchName from './searchName';
  import {updateTollGate,getTollGate} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollCar',
    props: ['tableName', 'selectedData'],
    components: {searchName},
    data() {
      return {
        loading: false,
        isGuangdong: false,
        dataModels: [],
        serachShow: false,
        originModel: {
          group_id: this.$store.state.editSelectedData[0],
          loading_class: 1,
          tunnage_flag: 1,
          tunnage_min: 1,
          tunnage_max: 1,
          loading_subclss: 1,
          interval_flag: 1,
          interval_min: 1,
          interval_max: 1,
          rate_max: 1,
          rate_min: 1,
          charge_min: 0,
          weight_min: 0,
          rate_base: 0,
          lane_num: 0,
          rate_base1: 0,
          lane_num1: 0,
          name_bt_id: 0,
          name_bt: '',
          source: 1
        },
        numberTable: ['一','二','三','四','五'],
        mountFlag: false,
        feeOptions: [{
          value: 0,
          label: '空'
        }, {
          value: 1,
          label: '4'
        }, {
          value: 2,
          label: '6'
        }],
        seatFlagClass: [{
          value: 1,
          label: '前开后闭'
        }, {
          value: 2,
          label: '前闭后开'
        }, {
          value: 3,
          label: '前闭后闭'
        }],
        sceneCtrl: fastmap.mapApi.scene.SceneController.getInstance()
      }
    },
    watch: {
      dataModels: {
        handler(newValue, oldValue) {
          if (!this.mountFlag) {
            this.$emit('tabStatusChange', {
              status: true,
              tabIndex: 2
            });
          } else {
            this.mountFlag = false;
          }
        },
        deep: true
      }
    },
    methods: {
      // 装载机别数
      validateTunnage (rule, value, callback) {
        if (value >49 || value < 0) {
          callback(new Error('座位数必须大于0小于49')); 
        } else {
          callback();
        }
      },
      // 最低收费
      validateChargeMin(value) {
        if (value > 20) {
          this.$alert('最低收费值大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 最低计重吨数
      validateWeightMin (value) {
        if (value > 10) {
          this.$alert('最低收费值大于10?', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 正常装载费率上限必须小于3，否则提示确认
      validateRateMin (value) {
        if (value >= 3) {
          this.$alert('费率上限必须小于3!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 基本费率
      validateRateBase (value) {
        if (value > 10 || value < 0) {
          this.$alert('基本费率值大于10或者小于0!', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }
      },
      // 装载级别吨位关联维护
      setLevelRelate (value) {
        this.dataModels.forEach((outer,outerIndex,datas) => {
          var tunnage_max = 0;
          var tunnage_min = 0;
          if (outerIndex != 0) {
            outer[0].tunnage_min = datas[outerIndex - 1][0].tunnage_max;
          }
          outer.forEach((inner, innerIndex) => {
            if (innerIndex === 0) {
              tunnage_max = parseInt(inner.tunnage_max);
              tunnage_min = parseInt(inner.tunnage_min);
            }
            inner.tunnage_max = tunnage_max;
            inner.tunnage_min = tunnage_min;
            if (innerIndex == outer.length - 1){
              inner.interval_max = tunnage_max;
            }
          });
        });
        this.setRangeRelate();
      },
      // 装载区间吨位关联维护
      setRangeRelate (value) {
        this.dataModels.forEach((outer,outerIndex) => {
          outer.forEach((inner, innerIndex) => {
            if(innerIndex != 0) {
              inner.interval_min = outer[innerIndex - 1].interval_max;
            } else {
              inner.interval_min = outer[0].tunnage_min;
            }
          });
        });
      },
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      setBtName() {
        this.originModel.name_bt_id = this.$store.state.btData.name_groupid;
        this.originModel.name_bt = this.$store.state.btData.name;
        this.dataModels.forEach(item => {
          item.forEach(innerItem => {
            innerItem.name_bt_id = this.$store.state.btData.name_groupid;
            innerItem.name_bt = this.$store.state.btData.name;
          });
        });
      },
      addOuter() {
        if (this.dataModels.length===5)return;
        let newLoadingClass = this.dataModels.length;
        let newObj = Object.assign({}, this.originModel, {insertFlag: true, loading_class: newLoadingClass+1});
        if(this.dataModels.length) {
          newObj.tunnage_min = this.dataModels[newLoadingClass - 1][0].tunnage_max;
          newObj.tunnage_max = newObj.tunnage_min + 1;
        } else {
          newObj.tunnage_min = 0;
        }
        if (this.dataModels.length === 4) {
          newObj.tunnage_max = 1000;
        }
        newObj.interval_min = newObj.tunnage_min;
        newObj.interval_max = newObj.tunnage_max;
        // 设置桥梁隧道;
        newObj.name_bt = this.dataModels[0]?this.dataModels[0][0].name_bt:this.originModel.name_bt;
        newObj.name_bt_id = this.dataModels[0]?this.dataModels[0][0].name_bt_id:this.originModel.name_bt_id;
        this.$set(this.dataModels, newLoadingClass, []);
        this.$set(this.dataModels[newLoadingClass], 0, newObj);
      },
      minusOuter() {
        this.dataModels.pop();
      },
      addInner(index) {
        if (this.dataModels[index].length===5)return;
        let newSubLoadingClass = this.dataModels[index].length;
        let newObj = Object.assign({}, this.originModel, {insertFlag: true});
        newObj.loading_class = index+1;
        newObj.loading_subclss = newSubLoadingClass + 1;
        newObj.interval_min = this.dataModels[index][newSubLoadingClass - 1].interval_max;
        newObj.interval_max = this.dataModels[index][newSubLoadingClass - 1].tunnage_max;
        // 设置桥梁隧道;
        newObj.name_bt = this.dataModels[0][0].name_bt;
        newObj.name_bt_id = this.dataModels[0][0].name_bt_id;
        this.$set(this.dataModels[index], newSubLoadingClass, newObj);
      },
      minusInner(outerIndex, innerIndex) {
        this.dataModels[outerIndex].length > 1 && this.dataModels[outerIndex].pop();
      },
      afterSave() {
        let submitData = [];
        this.$store.state.editSelectedData.forEach(outer => {
          this.dataModels.forEach(item => {
            item.forEach(innerItem => {
              let cloneData = Object.assign({},innerItem);
              cloneData.group_id = outer;
              delete innerItem.insertFlag;
              delete cloneData.insertFlag;
              submitData.push(cloneData);
            });
          });
        });
        let params = {
          table: this.isGuangdong? 'SC_TOLL_LOAD_GD' : 'SC_TOLL_LOAD',
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
            const h = this.$createElement;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 2
              });
              this.sceneCtrl.redrawLayerByGeoLiveTypes(['RDTOLLGATE']);
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
      },
      onSubmit(formName) {
        let validateFlag = true;
        if (!this.$store.state.editSelectedData.length) return false;
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
          if(item[0].tunnage_min >= item[0].tunnage_max) {
            validateFlag = false;
            alertMessage += `${index+1}类型装载吨位最小值必须比最大值小;`;
          }
          item.forEach((innerItem,innerIndex) => {
            if(innerItem.interval_min >= innerItem.interval_max) {
              validateFlag = false;
              alertMessage += `${index+1}类型下的${innerIndex+1}区间装载吨位最小值必须比最大值小;`;
            }
          });
        });
        if (validateFlag) {
          this.afterSave();
        } else {
          this.$alert(alertMessage, '错误提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      }
    },
    mounted() {
      this.mountFlag = true;
      this.isGuangdong = appUtil.getGolbalData().adminCode == '210000';
      if (this.$store.state.handleFlag === 'update') {
        let param = {
          table: this.isGuangdong? 'SC_TOLL_LOAD_GD' : 'SC_TOLL_LOAD',
          pid: this.$store.state.editSelectedData[0],
          workFlag: appUtil.getGolbalData().workType
        };
        this.loading = true;
        getTollGate(param)
        .then(result => {
          let {errorCode,data} = result;
          let classObjResult = _.groupBy(data, 'loading_class');
          let classArrResult = [];
          Object.keys(classObjResult).forEach(item => {
            let innerArr = [];
            classObjResult[item] = _.groupBy(classObjResult[item], 'loading_subclss');
            Object.keys(classObjResult[item]).forEach(innerItem => {
              innerArr.push(classObjResult[item][innerItem][0]);
            });
            classArrResult.push(innerArr);
          });          
          this.dataModels = classArrResult;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          throw new Error('货车计重不超载装载费率表查询失败');
        });
      } else {
        this.loading = false;
      }
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
    margin: 0 15px;
  }

  .grid-content .grid-list {
    flex: 1;
    padding:  0 5px;
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
