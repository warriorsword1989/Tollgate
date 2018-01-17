<template>
  <el-form :inline="true" class="wraper">
    <div class="grid-content">
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">桥梁或隧道名称：</div>
          <div class="inputPart">
            <el-input v-model="tableData.name_bt" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">桥梁或隧道名称组号：</div>
          <div class="inputPart">
            <el-input v-model="tableData.name_bt_id" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">收费类型：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.rate_class" placeholder="请选择">
              <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">实际收费的长度倍数：</div>
          <div class="inputPart">
            <el-input v-model="tableData.rato" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">加费：</div>
          <div class="inputPart">
            <el-input v-model="tableData.rate_add" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">客车车型编号：</div>
          <div class="inputPart">
            <el-input v-model="tableData.car_class" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div class="grid-wraper">
        <div class="grid-list">
          <div class="labelText">货车车型编号：</div>
          <div class="inputPart">
            <el-input v-model="tableData.truck_class" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list">
          <div class="labelText">区间闭合标识：</div>
          <div class="inputPart">
            <el-select size="mini" v-model.number="tableData.tunnage_flag" placeholder="请选择">
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
            <el-input v-model="tableData.tunnage_min" size="mini"></el-input> -
            <el-input v-model="tableData.tunnage_max" size="mini"></el-input>
          </div>
        </div>
        <div class="grid-list"></div>
      </div>
    </div>
    <div style="padding:20px;text-align: right;" class="footerPart">
      <el-row :gutter="5">
        <el-button type="primary" @click="onSubmit">保 存</el-button>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import {updateTollGate} from '../../dataService/api';
  export default {
    name: 'scTollRdlinkBt',
    props: ['tableData'],
    data() {
      return {
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
    methods: {
      onSubmit() {
        let params = {
          table: 'SC_TOLL_RDLINK_BT'
        };
        Object.assign(params, this.tableData);
        updateTollGate(params)
          .then(result => {
           let {errorCode} = result;
            const h = this.$createElement;
            if (errorCode === 0) {
              return this.$message({message: '数据更新成功！', type: 'success'});
            } else {
              return this.$message({message: '数据更新失败！', type: 'warning'});
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
    destroyed() {
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
    width: 150px;
    text-align: right;
  }

  .grid-content .inputPart {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

</style>
