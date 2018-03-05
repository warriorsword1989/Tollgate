<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <!-- 把这一行拿出来防止没有记录 -->
    <div class="grid-content">
      <div style="justify-content: flex-end;" class="grid-wraper">
        <el-button @click="addItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-plus">车型添加</el-button>
        <el-button @click="removeLimitItem" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-minus">车型删除</el-button>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div title="桥梁或隧道名称组号：" class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].name_bt_id||originModel.name_bt_id" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div title="桥梁或隧道名称：" class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input :disabled="true" v-model="dataModels[0] && dataModels[0].name_bt||originModel.name_bt" size="mini"></el-input>
          </div>
        </div>
        <el-button @click="toggleSearchPanel(true)" style="padding:5px" type="primary" class="btn-icon" icon="el-icon-edit"></el-button>
      </div>
    </div>
    <!-- 车型循环 -->
    <el-form v-for="(dataItem, index) in dataModels" :rules="carRules" :key="index" :model="dataItem" ref="dataItem" :inline="true" class="wraper">
      <div class="grid-content">
        <div class="grid-wraper">
          <div class="grid-list">
            <fieldset :style="dataItem.insertFlag ? 'border: 1px dashed red': 'border: 1px dashed #636ef5;'">
              <legend>{{dataItem.car_class}} 型车</legend>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="区间闭合标识：" class="labelText">区间闭合标识：</div>
                  <div class="inputPart">
                  <el-form-item prop="seat_flag">
                    <el-select size="mini" v-model.number="dataItem.seat_flag" placeholder="请选择">
                      <el-option v-for="item in seatFlagClass" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="各车型座位数区间：" class="labelText">各车型座位数区间：</div>
                  <div class="inputPart">
                    <div class="inputPart">
                      <el-form-item prop="seat_num_min" :rules="[ {  validator: validateSeat0_55, trigger: 'change' }]">
                        <el-input v-model="dataItem.seat_num_min" disabled size="mini"></el-input>
                      </el-form-item>-
                      <el-form-item v-show='dataItem.car_class!=4' prop="seat_num_max" :rules="[ {  validator: validateSeat0_55, trigger: 'change' }]">
                        <el-input v-model="dataItem.seat_num_max" @change="maxSeatNumChange" size="mini"></el-input>
                      </el-form-item>
                      <el-form-item v-show='dataItem.car_class==4'>
                        <el-input v-model="dataItem.seat_num_max" :disabled="dataItem.car_class==4" size="mini"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率(元/公里)非桥隧道：" class="labelText">费率(元/公里)非桥隧道：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate">
                      <el-input v-model="dataItem.rate" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率车道数：" class="labelText">费率车道数：</div>
                  <div class="inputPart">
                    <el-form-item prop="lane_num">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="dataItem.lane_num" placeholder="请选择">
                      <el-option v-for="item in feeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                   </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="桥隧道费率(元/车次)：" class="labelText">桥隧道费率(元/车次)：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate_bt">
                      <el-input v-model="dataItem.rate_bt" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list" v-show="!isZheJiang"></div>
                <div class="grid-list" v-show="isZheJiang">
                  <div title="车次加费(元)：" class="labelText">车次加费(元)：</div>
                  <div class="inputPart">
                    <el-form-item prop="fee_add">
                      <el-input v-model="dataItem.fee_add" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="最低收费(元)：" class="labelText">最低收费(元)：</div>
                  <div class="inputPart">
                    <el-form-item prop="charge_min">
                      <el-input v-model="dataItem.charge_min" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="费率1(元/公里)：" class="labelText">费率1(元/公里)：</div>
                  <div class="inputPart">
                    <el-form-item prop="rate1">
                      <el-input :disabled="!isGuangdong" v-model="dataItem.rate1" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="grid-wraper">
                <div class="grid-list">
                  <div title="费率1车道数：" class="labelText">费率1车道数：</div>
                  <div class="inputPart">
                    <el-form-item prop="lane_num1">
                    <el-select :disabled="!isGuangdong" size="mini" v-model.number="dataItem.lane_num1" placeholder="请选择">
                      <el-option v-for="item in feeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="grid-list">
                  <div title="固定收费站对应次费：" class="labelText">固定收费站对应次费：</div>
                  <div class="inputPart">
                    <el-form-item prop="fix_fee">
                      <el-input v-model="dataItem.fix_fee" size="mini"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </el-form>
    <div style="padding:10px 20px 0 0;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit($event,'dataItem')">保 存</el-button>
      </el-row>
    </div>
    </el-form>
    <search-name @selectBtName="setBtName" @toggleSearch="toggleSearchPanel" v-if="serachShow"></search-name>
  </div>
</template>

<script>
  import {updateTollGate, getTollGate, updateMetaIndex} from '../../dataService/api';
  import searchName from './searchName';
  import { appUtil } from '../../Application';
  export default {
    name: 'scTollCar',
    props: ['tableName', 'selectedData', 'handleFlag'],
    components: {searchName},
    data() {
      let validateFeeAdd = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && value > 20) {
          this.$alert('车次加费大于20', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          })
        }
      };
      // 费率
      let validateRate = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && (value < 0 || value > 3)) {
          this.$alert('费率值小于0或者大于3', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          });
        }
      };
      // 费率1
      let validateRate1 = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && (value > 10 || vlaue < 0)) {
          this.$alert('费率1大于10小于0', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          });
        }
      };
      // 隧道桥费率
      let validateRateBt = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && value > 20) {
          this.$alert('隧道桥费率值大于20', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          });
        }
      };
      // 最低收费
      let validateChargeMin = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && value > 20) {
          this.$alert('最低收费值大于20', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          });
        }
      };
      // 固定收费站对应次费
      let validateFixFee = (rule, value, callback) => {
        let self = this;
        if (this.isClickSave)return;
        if (value && (value > 10 || value < 0)) {
          this.$alert('固定收费站对应次费值大于10或者小于0?', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            return callback();
          });
        }
      };
      return {
        isClickSave: false,
        serachShow: false,
        isGuangdong: false,
        isZheJiang: false,
        loading: false,
        formIndex: 0,
        dataModels: {},
        btGroupId:0,
        originModel: {
          group_id: this.$store.state.editSelectedData[0],
          car_class: 1,
          seat_flag: 1,
          name_bt_id: 1,
          name_bt: '',
          rate: 1,
          seat_num_max: 10,
          seat_num_min: 1,
          rate_bt: 4,
          fee_add: null,
          charge_min: 3,
          fix_fee: 3,
          source: 1
        },
        carRules: {
          rate: [
            { validator: validateRate, trigger: 'change' }
          ],
          rate_bt: [
            { validator: validateRateBt, trigger: 'change' }
          ],
          fee_add: [
            { validator: validateFeeAdd, trigger: 'change' }
          ],
          charge_min: [
            { validator: validateChargeMin, trigger: 'change' }
          ],
          fix_fee: [
            { validator: validateFixFee, trigger: 'change' }
          ],
          rate1: [{ validator: validateRate1, trigger: 'change' }]
        },
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
              tabIndex: 0
            });
          } else {
            this.mountFlag = false;
          }
        },
        deep: true
      }
    },
    methods: {
      // 检查车型的座位数是否合法;
      validateSeat0_55(rule, value, callback){
        if (value >55 || value < 0) {
          return callback(new Error('座位数范围在0-55')); 
        }
        return callback();
      },
      // 连续两个车型的最大值和最小值关联控制;
      maxSeatNumChange (value) {
        for (let i=0;i<this.dataModels.length;i++) {
          if (i!=0) {
            this.dataModels[i].seat_num_min = this.dataModels[i-1].seat_num_max;
          }
        }
      },
      toggleSearchPanel(flag){
        this.serachShow = flag;
      },
      setBtName() {
        this.originModel.name_bt_id = this.$store.state.btData.name_groupid;
        this.originModel.name_bt = this.$store.state.btData.name;
        Object.keys(this.dataModels).forEach(item => {
          this.dataModels[item].name_bt_id = this.$store.state.btData.name_groupid;
          this.dataModels[item].name_bt = this.$store.state.btData.name;
        });
      },
      addItem() {
        if (this.dataModels.length===4)return;
        let modelLength = this.dataModels.length;
        let newObj = Object.assign({insertFlag: true}, this.originModel);
        newObj.car_class = modelLength + 1;
        if (newObj.car_class == '1') {
          newObj.seat_num_min = 0;
        } else {
          newObj.seat_num_min = this.dataModels[modelLength - 1].seat_num_max;
          // 最后类型的最大值为1000
          if (newObj.car_class == 4) {
            newObj.seat_num_max = 1000;
          } else {
            // 控制最大值比最小值大1
            newObj.seat_num_max = newObj.seat_num_min + 1;
          }
        }
        this.$set(this.dataModels, this.dataModels.length, newObj);
      },
      removeLimitItem() {
        this.dataModels.length>1 && this.dataModels.pop();
      },
      afterValidate() {
        let submitData = [];
        this.$store.state.editSelectedData.forEach(outer => {
          this.dataModels.forEach(item => {
            let cloneData = Object.assign({},item);
            cloneData.group_id = outer;
            delete item.insertFlag;
            delete cloneData.insertFlag;
            submitData.push(cloneData);
          });
        });
        let params = {
          table: 'SC_TOLL_CAR',
          data: submitData,
          workFlag: appUtil.getGolbalData().workType,
          adminCode: appUtil.getGolbalData().adminCode
        };
        this.loading = true;
        updateTollGate(params)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          if (errorCode === 0) {
            this.$emit('tabStatusChange', {
              status: false,
              tabIndex: 0
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
          this.isClickSave = false;
        })
        .catch(err => {
          console.log(err);
        });
      },
      onSubmit(e, formName) {
        this.isClickSave = true;
        if (!this.$store.state.editSelectedData.length) {
          return false;
        }
        let validateFlag = true;
        let alertMessage = '';
        this.dataModels.forEach((item,index) => {
          if (item.seat_num_min >= item.seat_num_max) {
            validateFlag = false;
            alertMessage += `${index+1}车型最小值必须比最大值小;`;
          }
        });
        if (validateFlag) {
          this.afterValidate();
        } else {
          this.$alert(alertMessage, '错误提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      }
    },
    mounted() {
      this.isZheJiang = appUtil.getGolbalData().adminCode == '130000';
      this.isGuangdong = appUtil.getGolbalData().adminCode == '210000';
      this.mountFlag = true;
      if (this.$store.state.handleFlag === 'update') {
        let param = {
          table: 'SC_TOLL_CAR',
          pid: this.$store.state.editSelectedData[0],
          workFlag: appUtil.getGolbalData().workType
        };
        this.loading = true;
        getTollGate(param)
          .then(result => {
            let {
              errorCode,
              data
            } = result;
            let transfromData = _.groupBy(data, 'car_class');
            let tempArray = [];
            Object.keys(transfromData).forEach(item => {
              tempArray.push(transfromData[item][0])
            });
            this.dataModels = tempArray;
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
  .content {
    margin: 0 15px;
  }
  fieldset {
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
