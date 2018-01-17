<template>
  <el-form :inline="true" class="wraper">
    <div class="grid-content">

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">区域标识：</div>
          <div class="inputPart">
            <el-input v-model="tableData.system_id" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">ETC打折类型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.etc_type" placeholder="请选择">
              <el-option v-for="item in etcTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">ETC打折：</div>
          <div class="inputPart">
            <el-input v-model="tableData.etc_d" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">免费车型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model="free_type_computed" multiple placeholder="请选择">
              <el-option v-for="item in freeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">是否有绿色通道：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.pre_truck_0" placeholder="请选择">
              <el-option v-for="item in geenPathOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">客车优惠车型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.pre_truck_0" placeholder="请选择">
              <el-option v-for="item in carTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">客车优惠降低量：</div>
          <div class="inputPart">
            <el-input v-model="tableData.dec_car" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">货车优惠空载车型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.pre_truck_0" placeholder="请选择">
              <el-option v-for="item in truckTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">货车空载优惠降低量：</div>
          <div class="inputPart">
            <el-input v-model="tableData.dec_truck" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">货车正常装载优惠吨数区间：</div>
          <div class="inputPart">
            <el-input v-model="tableData.pre_truck_loadmin" size="mini"></el-input> -
            <el-input v-model="tableData.pre_truck_loadmax" size="mini"></el-input>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">货车正常装载优惠计费吨数：</div>
          <div class="inputPart">
            <el-input v-model="tableData.pre_truck_load" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">最低收费金额：</div>
          <div class="inputPart">
            <el-input v-model="tableData.fee_limit" size="mini"></el-input>
          </div>
        </div>
      </div>

      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">收费取整：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.round" placeholder="请选择">
              <el-option v-for="item in roundTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div style="padding:20px;text-align: right;" class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit">保 存</el-button>
        </el-row>
      </div>

    </div>
  </el-form>
</template>

<script>
  import {
    updateTollGate
  } from '../../dataService/api';
  export default {
    name: 'scTollGrou',
    props: ['tableData'],
    data() {
      return {
        geenPathOptions: [{
          value: 0,
          label: '无'
        }, {
          value: 1,
          label: '有'
        }],
        etcTypeOptions: [{
          value: 0,
          label: '空'
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
        }]
      }
    },
    computed: {
      free_type_computed: {
        get: function () {
          return this.tableData.free_type.split('|') || ["0"];
        },
        set: function (newValue) {
          this.tableData.free_type = newValue!=0 ? newValue.join('|') : "0";
        }
      }
    },
    methods: {
      onSubmit() {
        let params = {
          table: 'SC_TOLL_GROUP'
        };
        Object.assign(params, this.tableData);
        updateTollGate(params)
          .then(result => {
            let {
              errorCode
            } = result;
            const h = this.$createElement;
            if (errorCode === 0) {
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
            console.log('finally');
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    mounted() {
      console.log('mounted scTollGrou')
    },
    destroyed() {
      console.log('childDestroyed scTollGrou')
      this.$emit('childDestroyed');
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
    width: 200px;
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
