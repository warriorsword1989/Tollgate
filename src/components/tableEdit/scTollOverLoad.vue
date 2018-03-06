<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <!-- 一条没有的显示 -->
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">装载类别添加</el-button>
        <el-button @click="minusOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">装载类别删除</el-button>
      </div>
    </div>

    <div v-for="(dataItem, outerIndex) in dataModels" :key="outerIndex" class="wraper">
      <div style="margin-bottom: 5x;display:flex;flex-direction:column" class="grid-content">
        <el-form v-for="(innerDataItem, innerIndex) in dataItem" :key="innerIndex" :model="innerDataItem" ref="dataItem"  style="display: flex;flex-direction: column;;padding:0" class="grid-list">
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
                <span style="font-weight:bold;font-size:14px;color:#66b1ff">{{numberTable[innerDataItem.overloading_clss - 1]}}类装载：</span>
              </div>
              <div style="width:180px" class="labelText">区间闭合标识：</div>
              <div class="inputPart">
                <el-select size="mini" v-model.number="innerDataItem.rato_flag" placeholder="请选择">
                  <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="grid-list">
              <div title="超载级别百分比范围(超载情况，车货总重)：" class="labelText">超载级别百分比范围(超载情况，车货总重)：</div>
              <div class="inputPart">
                <el-form-item prop="rato_min">
                  <el-input v-model="innerDataItem.rato_min" disabled size="mini"></el-input>
                </el-form-item>
                -
                <el-form-item prop="rato_max">
                  <el-input v-model="innerDataItem.rato_max" :rules="[{ validator: validateTunnage, trigger: 'change' }]" v-show="outerIndex!=4" :disabled="outerIndex!=4" @change="setLevelRelate" size="mini"></el-input>
                  <el-input v-model="innerDataItem.rato_max" v-show="outerIndex==4" :disabled="outerIndex==4" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-show="innerIndex==0" class="grid-wraper">
            <div class="grid-list">
              <div title="本级别正常装载部分的基本费率：" class="labelText">本级别正常装载部分的基本费率：</div>
              <div class="inputPart">
                <el-input v-model="innerDataItem.rate_base" size="mini"></el-input>
              </div>
            </div>
            <div class="grid-list">
              <div title="本级别最低计重(吨)：" class="labelText">本级别最低计重(吨)：</div>
              <div class="inputPart">
                <el-input v-model="innerDataItem.weight_min" size="mini"></el-input>
              </div>
            </div>
          </div>
          <div style="display:flex;flex-direction: row;">
            <fieldset :style="innerDataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend style="font-size:12px">{{numberTable[innerDataItem.overloading_subclss - 1]}} 区间</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
                  <div class="inputPart">
                    <el-select size="mini" v-model.number="innerDataItem.interval_flag" placeholder="请选择">
                      <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="超装载区间百分比范围：" class="labelText">超装载区间百分比范围：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-input disabled v-model="innerDataItem.interval_min" placeholder="%" size="mini"></el-input> -
                      <el-input :disabled="innerIndex==dataItem.length-1" @change="setRangeRelate" v-model="innerDataItem.interval_max" placeholder="%" size="mini"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="超载区间基本费率：" class="labelText">超载区间基本费率：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.sub_rate_base" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="超载基本费率的倍数上限：" class="labelText">超载基本费率的倍数上限：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.multiple_max" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="超载基本费率的倍数下限：" class="labelText">超载基本费率的倍数下限：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.multiple_min" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="超载基本费率车道数：" class="labelText">超载基本费率车道数：</div>
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
                  <div title="超载区间的基本费率1：" class="labelText">超载区间的基本费率1：</div>
                  <div class="inputPart">
                    <el-input :disabled="!isGuangdong" v-model="innerDataItem.sub_rate_base1" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="超载区间的基本费率1对应车道数：" class="labelText">超载区间的基本费率1对应车道数：</div>
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
                  <div title="超限值费率：" class="labelText">超限值费率：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.rate_limit" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="超载区间划分吨数限值：" class="labelText">超载区间划分吨数限值：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.ton_limit" size="mini"></el-input>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="超限值基本费率：" class="labelText">超限值基本费率：</div>
                  <div class="inputPart">
                    <el-input v-model="innerDataItem.multiple_limit" size="mini"></el-input>
                  </div>
                </div>
                <div class="grid-list"></div>
              </div>
            </fieldset>
          </div>
        </el-form>
      </div>
    </div>
    <div style="padding:10px 20px 0 0;text-align: right;" v-show="dataModels.length" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit('dataItem')">保 存</el-button>
      </el-row>
    </div>
    <search-name @selectBtName="setBtName" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import {
    updateTollGate,
    getTollGate
  } from '../../dataService/api';
  import searchName from './searchName';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollCar',
    components: {searchName},
    props: ['tableName', 'selectedData'],
    data() {
      return {
        loading: false,
        isGuangdong: false,
        serachShow: false,
        dataModels: [],
        originModel: {
          group_id: this.$store.state.editSelectedData[0],
          overloading_clss: 1,
          rato_flag: 1,
          rato_min: 1,
          rato_max: 1,
          rate_base: 1,
          weight_min: 1,
          overloading_subclss: 1,
          interval_flag: 1,
          interval_min: 1,
          interval_max: 1,
          sub_rate_base: 0,
          multiple_min: 0,
          multiple_max: 0,
          lane_num: 0,
          sub_rate_base1: 0,
          lane_num1: 0,
          name_bt_id: 0,
          name_bt: 0,
          ton_limit: 0,
          multiple_limit: 0,
          rate_limit: 0,
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
              tabIndex: 4
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
          callback(new Error('超载级别不能大于49')); 
        } else {
          callback();
        }
      },
      // 装载级别吨位关联维护
      setLevelRelate (value) {
        this.dataModels.forEach((outer,outerIndex,datas) => {
          var rato_max = 0;
          var rato_min = 0;
          if (outerIndex != 0) {
            outer[0].rato_min = datas[outerIndex - 1][0].rato_max;
          }
          outer.forEach((inner, innerIndex) => {
            if (innerIndex === 0) {
              rato_max = parseInt(inner.rato_max);
              rato_min = parseInt(inner.rato_min);
            }
            inner.rato_max = rato_max;
            inner.rato_min = rato_min;
            if (innerIndex == outer.length - 1){
              inner.interval_max = rato_max;
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
              inner.interval_min = outer[0].rato_min;
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
        let newObj = Object.assign({}, this.originModel, {insertFlag: true, overloading_clss: newLoadingClass+1});
        if(this.dataModels.length) {
          newObj.rato_min = this.dataModels[newLoadingClass - 1][0].rato_max;
          newObj.rato_max = newObj.rato_min + 1;
        } else {
          newObj.rato_min = 0;
        }
        if (this.dataModels.length === 4) {
          newObj.rato_max = 1000;
        }
        newObj.interval_min = newObj.rato_min;
        newObj.interval_max = newObj.rato_max;
        // 设置桥梁隧道;
        newObj.name_bt = this.dataModels[0] ? this.dataModels[0][0].name_bt : this.originModel.name_bt;
        newObj.name_bt_id = this.dataModels[0] ? this.dataModels[0][0].name_bt_id : this.originModel.name_bt;
        this.$set(this.dataModels, newLoadingClass, []);
        this.$set(this.dataModels[newLoadingClass], 0, newObj);
      },
      minusOuter(index) {
        this.dataModels.pop();
      },
      addInner(index) {
        if (this.dataModels[index].length===5)return;
        let newSubLoadingClass = this.dataModels[index].length;
        let newObj = Object.assign({}, this.originModel, {insertFlag: true});
        newObj.overloading_clss = index+1;
        newObj.overloading_subclss = newSubLoadingClass + 1;
        newObj.interval_min = this.dataModels[index][newSubLoadingClass - 1].interval_max;
        newObj.interval_max = this.dataModels[index][newSubLoadingClass - 1].rato_max;
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
          table: 'SC_TOLL_OVERLOAD',
          data: submitData,
          workFlag: appUtil.getGolbalData().workType,
          adminCode: appUtil.getGolbalData().adminCode
        }
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
                tabIndex: 4
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
          if(item[0].rato_min >= item[0].rato_max) {
            validateFlag = false;
            alertMessage += `${index+1}类型超载最小百分比值必须比最大值小;`;
          }
          item.forEach((innerItem,innerIndex) => {
            if(innerItem.interval_min >= innerItem.interval_max) {
              validateFlag = false;
              alertMessage += `${index+1}类型下的${innerIndex+1}区间超载最小百分比值必须比最大值小;`;
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
      this.isGuangdong = appUtil.getGolbalData().adminCode == '210000';
      this.mountFlag = true;
      if (this.$store.state.handleFlag === 'update') {
        let param = {
          table: 'SC_TOLL_OVERLOAD',
          pid: this.$store.state.editSelectedData[0],
          workFlag: appUtil.getGolbalData().workType
        };
        this.loading = true;
        getTollGate(param)
          .then(result => {
            let {errorCode,data} = result;
            let classObjResult = _.groupBy(data, 'overloading_clss');
            let classArrResult = [];
            Object.keys(classObjResult).forEach(item => {
              let innerArr = [];
              classObjResult[item] = _.groupBy(classObjResult[item], 'overloading_subclss');
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
      }else {
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
