<template>
<vue-draggable-resizable
  class="dragWindow"
  style="background:#fff;box-shadow:0 4px 20px #5c78a7;display:flex;flex-direction:column;height:auto"
  :w="980"
  :h="530"
  :x="leftDis"
  :y="topDis"
  :z="10"
  :parent="true"
  :drag-handle="'.drag'"
  :resizable="true"
  :handles="['mr']"
  :append-to-body="true">
  <!-- title-->
  <div style="display:flex;flex-direction:row;" class="windowTitle">
    <div style="flex:1"><i class="el-icon-edit-outline drag"> 收费站信息编辑 {{this.workFlag=='static'? '[静态作业]': '[动态作业]'}}</i></div>
    <div style="width=50px"><i @click="closeDialog" class="el-icon-close"></i></div>
  </div>
  <!-- table-->
  <el-collapse value="1" :v-model="'1'" @change="toggleTable" style="flex:1">
    <el-collapse-item name="1">
      <template slot="title">
        <div style="text-align:center;background: rgb(241, 241, 241)">
          <i style="font-size: 1.8em;color:#636ef5;vertical-align: sub;" :class="isTableShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          <span style="color:#636ef5;">{{isTableShow ? '隐藏收费站列表' : '显示收费站列表'}}</span>
        </div>
      </template>
      <el-table v-loading="loading" element-loading-text="查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);" @selection-change="selectChange" ref="multipleTable" :data="tableData" :max-height="100" tooltip-effect="light">
        <el-table-column label="序号" type="index" width="120"></el-table-column>
        <el-table-column prop="pid" label="收费站ID"></el-table-column>
        <el-table-column prop="name" label="收费站名称"></el-table-column>
        <el-table-column v-if="$store.state.source==1" prop="type" label="收费站类型" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="$store.state.source!=1" prop="source" label="信息来源" show-overflow-tooltip></el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>
  <el-tabs @tab-click='tabOnActive'  :tab-position="tabPosition">
    <el-tab-pane :label="isEdit[0]?'* 客车车型划分及费率':'客车车型划分及费率'">
      <sc-toll-car @tabStatusChange="changeTabStatus"></sc-toll-car>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[1]?'* 货车车型划分及空载费率': '货车车型划分及空载费率'">
      <sc-toll-truck @tabStatusChange="changeTabStatus"></sc-toll-truck>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[2]?'* 货车计重装载费率(不超限)':'货车计重装载费率(不超限)'">
      <sc-toll-load @tabStatusChange="changeTabStatus"></sc-toll-load>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[4]?'* 货车计重装载费率(超限)':'货车计重装载费率(超限)'">
      <sc-toll-over-load @tabStatusChange="changeTabStatus"></sc-toll-over-load>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[5]?'* 收费站加费信息表':'收费站加费信息表'">
      <sc-toll-gate-fee @tabStatusChange="changeTabStatus"></sc-toll-gate-fee>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[6]?'* 收费站区间表': '收费站区间表'">
      <sc-toll-grou @tabStatusChange="changeTabStatus"></sc-toll-grou>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[7]?'* 限制载重信息表' : '限制载重信息表'">
      <sc-toll-limit @tabStatusChange="changeTabStatus"></sc-toll-limit>
    </el-tab-pane>
    <el-tab-pane :label="isEdit[8] ? '* 桥隧道收费附加表': '桥隧道收费附加表'">
      <sc-toll-rdlink-bt @tabStatusChange="changeTabStatus"></sc-toll-rdlink-bt>
    </el-tab-pane>
    <el-tab-pane v-if="workFlag!='static'" :label="isEdit[9] ? '* 节假日收费浮动信息': '节假日收费浮动信息'">
      <sc-toll-holiday @tabStatusChange="changeTabStatus"></sc-toll-holiday>
    </el-tab-pane>
    <el-tab-pane v-if="workFlag!='static'" :label="isEdit[10] ? '* 特殊收费浮动信息': '特殊收费浮动信息'">
      <sc-toll-special-pay @tabStatusChange="changeTabStatus"></sc-toll-special-pay>
    </el-tab-pane>
  </el-tabs>
</vue-draggable-resizable>
</template>

<script>
  import Vue from 'vue'
  import scTollCar from './scTollCar';
  import scTollGateFee from './scTollGateFee';
  import scTollGrou from './scTollGrou';
  import scTollHoliday from './scTollHoliday';
  import scTollLimit from './scTollLimit';
  import scTollLoad from './scTollLoad';
  import scTollOverLoad from './scTollOverLoad';
  import scTollRdlinkBt from './scTollRdlinkBt';
  import scTollSpecialPay from './scTollSpecialPay';
  import scTollTruck from './scTollTruck';
  import {getTollGate, getTollName} from '../../dataService/api';
  import { appUtil } from '../../Application';
  export default {
    name: 'tabDiag',
    props: ['dialogTableVisible', 'handleFlag'],
    components: {
      scTollCar,
      scTollGateFee,
      scTollGrou,
      scTollHoliday,
      scTollLimit,
      scTollLoad,
      scTollOverLoad,
      scTollRdlinkBt,
      scTollSpecialPay,
      scTollTruck
    },
    data() {
      return {
        loading: true,
        serachShow: false,
        topDis:200,
        leftDis:300,
        activeIndex: 0,
        tabPosition: 'left',
        isEdit: [false,false,false,false,false,false,false,false,false],
        isTableShow: false,
        multipleSelection: [],
        tableData: [],
        workFlag: 'static',
        tollType: {
          0:'未调查',
          1:'领卡',
          2:'交卡付费',
          3:'固定收费(次费)',
          4:'交卡付费后再领卡',
          5:'交卡付费并代收固定费用',
          6:'验票(无票收费)值先保留',
          7:'领卡并代收固定费用',
          8:'持卡打标识不收费',
          9:'验票领卡',
          10:'交卡不收费',
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('dialogClose');
      },
      toggleTable() {
        this.isTableShow = !this.isTableShow;
      },
      changeTabStatus(eData){
        //直接通过索引更新数组视图无法更新;这样就能被vue监控到，更新视图 
        Vue.set(this.isEdit,eData.tabIndex,eData.status) 
      },
      toggleSelection(rows){
        let self = this;
        if (rows.length) {
          rows.forEach(row => {
            self.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      },
      selectChange (selection) {
        let pids = selection.map(item => item.pid);
        this.$store.commit('changeEditSelectedData', pids);
      },
      tabOnActive(e){
        this.activeIndex = parseInt(e.index);
      },
      async transfromSelectedData(arr) {
        let param = { table: 'RD_TOLLGATE_NAME', pid: arr};
        let result = await getTollName(param);
        this.tableData = result.data.map(item => {
          item.type = this.tollType[item.type];
          item.source = ['情报道路对象','情报点对象','情报省份对象'][this.$store.state.source-2];
          return item;
        });
        this.loading = false;
        this.$nextTick(() => {
          this.toggleSelection(this.tableData);
        });
      }
    },
    mounted() {
      // 查询获得收费站名称;
      this.workFlag = appUtil.getGolbalData().workType;
      this.transfromSelectedData(this.$store.state.editSelectedData);
    },
    beforeMount() {
      let viewWidth = document.documentElement.clientWidth;
      let viewHeight = document.documentElement.clientHeight;
      this.leftDis = (viewWidth - 980) /2;
      this.topDis = (viewHeight - 530) /2;
    }
  }
</script>

<style scoped>
  .windowTitle {
     background:#636ef5;
     height:40px;
     line-height:40px;
     color:#fff;
     padding:0 10px;
     font-size:16px;
     cursor: move;
     display: flex;
     flex-direction: row;
  }
  .windowTitle .el-icon-edit-outline {
     width:90%;
     line-height:40px;
  }
  .windowTitle .el-icon-close {
    width: 40px;
    line-height:40px;
    cursor:pointer;
    text-align: center;
    cursor: pointer;
  }
</style>
