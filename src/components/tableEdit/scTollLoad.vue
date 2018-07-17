<template>
  <div :style="diyStyle" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">装载类别添加</el-button>
        <el-button @click="minusOuter" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">装载类别删除</el-button>
      </div>
    </div>
    <div v-for="(dataItem, outerIndex) in dataModels" :key="outerIndex" :inline="true" class="wraper">
      <div style="margin-bottom: 5x;display:flex;flex-direction:column" class="grid-content">
        <el-form v-for="(innerDataItem, innerIndex) in dataItem" :key="innerIndex" :model="innerDataItem" ref="dataItem" style="display: flex;flex-direction: column;padding:0" class="grid-list">

          <div v-show="outerIndex==0 && innerIndex==0 && !activeInnerPanel" class="grid-wraper">
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
            <el-button @click="deleteBridge()" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-delete"></el-button>
          </div>

          <div v-show="innerIndex==0" style="justify-content: flex-end;" class="grid-wraper">
            <el-button @click="addInner(outerIndex)" style="padding:5px;height:28px;margin:3px" type="primary" class="btn-icon" icon="el-icon-circle-plus-outline">装载区间添加</el-button>
            <el-button @click="minusInner(outerIndex, innerIndex)" style="padding:5px;height:28px;margin:3px" type="primary" class="btn-icon" icon="el-icon-minus">装载区间删除</el-button>
          </div>
          <div v-show="innerIndex==0" class="grid-wraper">
            <div class="grid-list">
              <div class="labelText">
                <span style="font-weight:bold;font-size:14px;color:#66b1ff">{{innerDataItem.loading_class}}类装载：</span>
              </div>
              <div style="width:180px" class="labelText">区间闭合标识：</div>
              <div class="inputPart">
                <el-select @change="changeTunnage" size="mini" v-model.number="innerDataItem.tunnage_flag" placeholder="请选择">
                  <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="grid-list">
              <div class="labelText" title="正常装载级别吨数范围(车货总重)">正常装载级别吨数范围(车货总重)：</div>
              <div class="inputPart">
                <el-form-item prop="tunnage_min">
                  <el-input v-model.number="innerDataItem.tunnage_min" disabled size="mini"></el-input>
                </el-form-item>
                <span style="display:block;line-height:28px">-</span>

                <el-form-item v-if="isGuangdong && outerIndex!=4 && outerIndex!=dataModels.length-1" prop="tunnage_max" :rules="[{ validator: validateTunnage1, trigger: 'change' },{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字'}]">
                  <el-input v-model.number="innerDataItem.tunnage_max" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
                <el-form-item v-if="isGuangdong && outerIndex!=4 && outerIndex==dataModels.length-1" prop="tunnage_max" :rules="[{ validator: validateTunnage2, trigger: 'change' },{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字'}]">
                  <el-input v-model.number="innerDataItem.tunnage_max" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
                <el-form-item v-if="isGuangdong && outerIndex==4" prop="tunnage_max">
                  <el-input v-model.number="innerDataItem.tunnage_max" :disabled="outerIndex==4" size="mini"></el-input>
                </el-form-item>

                <el-form-item v-if="!isGuangdong && outerIndex!=dataModels.length-1" prop="tunnage_max" :rules="[{ validator: validateTunnage1, trigger: 'change' },{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字'}]">
                  <el-input v-model.number="innerDataItem.tunnage_max" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
                <el-form-item v-if="!isGuangdong && outerIndex==dataModels.length-1" prop="tunnage_max" :rules="[{ validator: validateTunnage2, trigger: 'change' },{ required: true, message: '不能为空'},{ type: 'number', message: '必须为数字'}]">
                  <el-input v-model.number="innerDataItem.tunnage_max" @change="setLevelRelate" size="mini"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>

          <div style="display:flex;flex-direction: row;">
            <fieldset :style="innerDataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend style="font-size:12px">{{innerDataItem.loading_subclss}} 区间</legend>
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
                    <el-form-item prop="interval_min" :rules="[{ type: 'number', message: '必须为数字'}]">
                      <el-input v-model.number="innerDataItem.interval_min" @change="setMinRangeRelate" size="mini"></el-input>
                    </el-form-item>
                      <span style="display:block;line-height:28px">-</span>
                      <el-form-item v-if="isGuangdong && innerIndex!=4" prop="interval_max" :rules="[{ type: 'number', message: '必须为数字'}]">
                        <el-input v-model.number="innerDataItem.interval_max" @change="setMaxRangeRelate" size="mini"></el-input>
                      </el-form-item>
                      <el-form-item v-if="isGuangdong && innerIndex==4" prop="interval_max">
                        <el-input v-model.number="innerDataItem.interval_max" disabled size="mini"></el-input>
                      </el-form-item>

                      <el-form-item v-if="!isGuangdong && innerIndex!=dataModels[outerIndex].length-1" prop="interval_max" :rules="[{ type: 'number', message: '必须为数字'}]">
                        <el-input v-model.number="innerDataItem.interval_max" @change="setMaxRangeRelate" size="mini"></el-input>
                      </el-form-item>
                      <el-form-item v-if="!isGuangdong && innerIndex==dataModels[outerIndex].length-1" prop="interval_max">
                        <el-input v-model.number="innerDataItem.interval_max" disabled size="mini"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="基本费率：" class="labelText">基本费率：</div>
                  <div class="inputPart">
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="rate_base">
                      <el-input @change="validateRateBase" v-model="innerDataItem.rate_base" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率上限(广东为倍数)：" class="labelText">费率上限(广东为倍数)：</div>
                  <div class="inputPart">
                    <el-form-item :rules="isGuangdong ? [{ required: true, message: '不能为空'}] : [{ validator: validateNum, trigger: 'change' },{ required: true, message: '不能为空'}]" prop="rate_max">
                      <el-input @change="validateRateMin" v-model="innerDataItem.rate_max" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率下限(广东为倍数)：" class="labelText">费率下限(广东为倍数)：</div>
                  <div class="inputPart">
                    <el-form-item :rules="isGuangdong ? [{ required: true, message: '不能为空'}] : [{ validator: validateNum, trigger: 'change' },{ required: true, message: '不能为空'}]" prop="rate_min">
                      <el-input v-model="innerDataItem.rate_min" size="mini"></el-input>
                    </el-form-item>
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
                    <el-form-item :rules="isGuangdong?[{ validator: validateNum, trigger: 'change' }]:[]" prop="rate_base1">
                      <el-input :disabled="!isGuangdong" v-model="innerDataItem.rate_base1" size="mini"></el-input>
                    </el-form-item>
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
                    <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="weight_min">
                      <el-input @change="validateWeightMin" v-model="innerDataItem.weight_min" size="mini"></el-input>
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
  import { updateTollGate, getTollGate, deleteCarTruckTollGate } from '../../dataService/api';
  import { appUtil } from '../../Application';
  export default {
    name: 'scTollCar',
    props: ['activeInnerPanel'],
    components: {searchName},
    data() {
      return {
        hasData: false,
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
          charge_min: null,
          weight_min: null,
          rate_base: null,
          lane_num: null,
          rate_base1: null,
          lane_num1: null,
          name_bt_id: 1,
          name_bt: '',
          source: this.$store.state.source
        },
        numberTable: ['一','二','三','四','五'],
        mountFlag: false,
        feeOptions: [{
          value: null,
          label: '空'
        }, {
          value: 4,
          label: '4'
        }, {
          value: 6,
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
        }]
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
    computed: {
      diyStyle: function () {
        if (this.isGuangdong) {
          return 'height:350px; overflow-y: auto';
        }
        return 'height:280px; overflow-y: auto';
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
      // 装载机别数
      validateTunnage1 (rule, value, callback) {
        if (value >55 || value < 0) {
          callback(new Error('装载级别吨数不能大于55'));
        } else {
          callback();
        }
      },
      // 装载机别数
      validateTunnage2 (rule, value, callback) {
        if (value >1000) {
          callback(new Error('装载级别吨数不能大于1000'));
        } else {
          callback();
        }
      },
      // 最低收费
      validateChargeMin(value) {
        if (value > 20) {
          this.$alert('最低收费值大于20!', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false
          });
        }
      },
      // 最低计重吨数
      validateWeightMin (value) {
        if (value > 10) {
          this.$alert('最低计重值大于10?', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false
          });
        }
      },
      // 正常装载费率上限必须小于3，否则提示确认
      validateRateMin (value) {
        if (value >= 3) {
          this.$alert('费率上限必须小于3!', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false
          });
        }
      },
      // 基本费率
      validateRateBase (value) {
        if (value > 10 || value < 0) {
          this.$alert('基本费率值大于10或者小于0!', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false
          });
        }
      },
      // 区间闭合标识改变的维护；
      changeTunnage (value) {
        this.dataModels.forEach((outer,outerIndex) => {
          outer.forEach((inner,innerIndex) => {
            if (innerIndex!=0) {
              inner.tunnage_flag = outer[0].tunnage_flag;
            }
          });
        });
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
      },
      // 装载区间吨位关联维护
      setMaxRangeRelate (value) {
        this.dataModels.forEach((outer,outerIndex) => {
          outer.forEach((inner, innerIndex) => {
            if(innerIndex != 0) {
              inner.interval_min = outer[innerIndex - 1].interval_max;
            }
          });
        });
      },
      setMinRangeRelate (value) {
        this.dataModels.forEach((outer,outerIndex) => {
          outer.forEach((inner, innerIndex) => {
            if(innerIndex != 0) {
              outer[innerIndex - 1].interval_max = inner.interval_min;
            }
          });
        });
      },
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      // 删除桥梁隧道名称;
      deleteBridge () {
        this.dataModels.forEach(item => {
          item.forEach(innerItem => {
            innerItem.name_bt_id = null;
            innerItem.name_bt = null;
          });
        });
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
      _setRateMinMax (outerIndex, innerIndex, obj) {
        let tableBox = [
          [{rateMax: 1.25,rateMin: 1.25}],
          [{rateMax: 1.1,rateMin: 1.1},{rateMax: 1,rateMin: 0.83}],
          [{rateMax: 1,rateMin: 1},{rateMax: 1,rateMin: 0.3}],
          [{rateMax: 1,rateMin: 1},{rateMax: 0.3,rateMin: 0.3}],
          [{rateMax: 1,rateMin: 1}]
        ];
        if (tableBox[outerIndex][innerIndex]) {
          obj.rate_max = tableBox[outerIndex][innerIndex].rateMax;
          obj.rate_min = tableBox[outerIndex][innerIndex].rateMin;
        }
      },
      addOuter() {
        if (this.isGuangdong && this.dataModels.length===5)return;
        let newLoadingClass = this.dataModels.length;
        let newObj = Object.assign({}, this.originModel, {insertFlag: true, loading_class: newLoadingClass+1});
        if(this.dataModels.length) {
          newObj.tunnage_min = this.dataModels[newLoadingClass - 1][0].tunnage_max;
          newObj.tunnage_max = newObj.tunnage_min + 1;
        } else {
          newObj.tunnage_min = 0;
        }
        if (this.isGuangdong && this.dataModels.length === 4) {
          newObj.tunnage_max = 1000;
        }
        newObj.interval_min = 0;
        newObj.interval_max = newObj.tunnage_max;
        // 设置桥梁隧道;
        newObj.name_bt = this.dataModels[0]?this.dataModels[0][0].name_bt:this.originModel.name_bt;
        newObj.name_bt_id = this.dataModels[0]?this.dataModels[0][0].name_bt_id:this.originModel.name_bt_id;
        // 如果是广东，自动维护装载费率上线和下限;
        this.isGuangdong && this._setRateMinMax(this.dataModels.length,0,newObj);
        this.$set(this.dataModels, newLoadingClass, []);
        this.$set(this.dataModels[newLoadingClass], 0, newObj);
      },
      minusOuter() {
        this.dataModels.pop();
      },
      addInner(index) {
        if (this.isGuangdong && this.dataModels[index].length===5)return;
        let newSubLoadingClass = this.dataModels[index].length;
        let newObj = Object.assign({}, this.originModel, {insertFlag: true});
        newObj.loading_class = index+1;
        newObj.loading_subclss = newSubLoadingClass + 1;
        newObj.tunnage_max = this.dataModels[index][0].tunnage_max;
        newObj.tunnage_min = this.dataModels[index][0].tunnage_min;
        newObj.tunnage_flag = this.dataModels[index][0].tunnage_flag;

        newObj.interval_min = this.dataModels[index][newSubLoadingClass - 1].interval_max;
        newObj.interval_max = this.dataModels[index][newSubLoadingClass - 1].tunnage_max;
        // 设置桥梁隧道;
        newObj.name_bt = this.dataModels[0][0].name_bt;
        newObj.name_bt_id = this.dataModels[0][0].name_bt_id;
        // 如果是广东，自动维护装载费率上线和下限;
        this.isGuangdong && this._setRateMinMax(index,this.dataModels[index].length,newObj);
        // this._setRateMinMax(index,this.dataModels[index].length,newObj);
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
              cloneData.source = this.$store.state.source;
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
          adminCode: appUtil.getGolbalData().adminCode,
          whichKind: this.activeInnerPanel
        };
        this.loading = true;
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
                tabIndex: 2
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
            throw new Error(err);
          });
      },
      onSubmit(formName) {
        let validateFlag = true;
        if (!this.$store.state.editSelectedData.length) return false;
        if (!this.dataModels.length) {
          let params = {
            table: this.isGuangdong? 'SC_TOLL_LOAD_GD' : 'SC_TOLL_LOAD',
            pid: this.$store.state.editSelectedData[0],
            workFlag: appUtil.getGolbalData().workType,
            whichKind: this.activeInnerPanel
          };
          this.loading = true;
          deleteCarTruckTollGate(params)
          .then(res =>{
            let {errorCode,message,updateFlag} = res;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 2
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
            throw new Error(err);
          });
        } else {
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
            if (!this.isGuangdong && !this.activeInnerPanel && !item[0].name_bt) {
              validateFlag = false;
              alertMessage += `在收费站桥隧道下桥梁隧道信息不能为空!`;
            }
            if(item[0].tunnage_min >= item[0].tunnage_max) {
              validateFlag = false;
              alertMessage += `${index+1}类型装载吨位最小值必须比最大值小;<br />`;
            }
            item.forEach((innerItem,innerIndex) => {
              if(innerItem.interval_min >= innerItem.interval_max) {
                validateFlag = false;
                alertMessage += `${index+1}类型下的${innerIndex+1}区间装载吨位最小值必须比最大值小;<br />`;
              }
            });
            item.forEach((innerItem,innerIndex) => {
              if (!this.isGuangdong) {
                if(parseFloat(innerItem.rate_max) < parseFloat(innerItem.rate_min)) {
                  validateFlag = false;
                  alertMessage += `${index+1}类型下的${innerIndex+1}区间费率上限不能小于下限;<br />`;
                }
              }
            });
            //
            item.forEach((innerItem,innerIndex) => {
              if(!innerItem.lane_num && this.isGuangdong) {
                validateFlag = false;
                alertMessage += `在广东省${index+1}类型下的${innerIndex+1}区间费率车道数不能为空;<br />`;
              }
            });
            item.forEach((innerItem,innerIndex) => {
              if(!innerItem.lane_num1 && this.isGuangdong) {
                validateFlag = false;
                alertMessage += `在广东省${index+1}类型下的${innerIndex+1}区间费率1车道数不能为空;<br />`;
              }
            });
            item.forEach((innerItem,innerIndex) => {
              if(!innerItem.rate_base && this.isGuangdong) {
                validateFlag = false;
                alertMessage += `在广东省${index+1}类型下的${innerIndex+1}区间费率不能为空;<br />`;
              }
            });
            item.forEach((innerItem,innerIndex) => {
              if(!innerItem.rate_base1 && this.isGuangdong) {
                validateFlag = false;
                alertMessage += `在广东省${index+1}类型下的${innerIndex+1}区间费率1不能为空;<br />`;
              }
            });
          });
          if (validateFlag) {
            this.afterSave();
          } else {
            alertMessage && this.$alert(alertMessage, '错误提示', {
              confirmButtonText: '确定',
              type: 'error',
              dangerouslyUseHTMLString: true,
              showClose: false
            })
          }
        }
      }
    },
    mounted() {
      this.mountFlag = true;
      this.isGuangdong = appUtil.getGolbalData().adminCode == '440000';
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
          this.hasData = result.data.length ? true : false;
          // 根据tab页的index数值来对数据根据有桥隧道和没有桥隧道进行过滤(非广东的情况)。
          if (!this.isGuangdong) {
            data = data.filter(item => !item.name_bt == !!this.activeInnerPanel);
          }
          let classObjResult = _.groupBy(data, 'loading_class');
          let classArrResult = [];
          Object.keys(classObjResult).forEach(item => {
            let innerArr = [];
            classObjResult[item] = _.groupBy(classObjResult[item], 'loading_subclss');
            Object.keys(classObjResult[item]).forEach(innerItem => {
              let dataItemObj = classObjResult[item][innerItem][0];
              if (!this.isGuangdong) {
                dataItemObj.rate_max = dataItemObj.rate_max ? parseFloat(parseFloat(dataItemObj.rate_max).toFixed(5)) : dataItemObj.rate_max;
                dataItemObj.rate_min = dataItemObj.rate_min ? parseFloat(parseFloat(dataItemObj.rate_min).toFixed(5)) : dataItemObj.rate_min;
              }
              dataItemObj.rate_base = dataItemObj.rate_base ? parseFloat(parseFloat(dataItemObj.rate_base).toFixed(5)) : dataItemObj.rate_base;
              dataItemObj.rate_base1 = dataItemObj.rate_base1 ? parseFloat(parseFloat(dataItemObj.rate_base1).toFixed(5)) : dataItemObj.rate_base1;
              innerArr.push(dataItemObj);
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
    margin: 15px 0;
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
    margin-bottom: 0;
    margin-right: 0;
  }
</style>
