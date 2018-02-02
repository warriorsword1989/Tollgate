<template>
<vue-draggable-resizable
  class="dragWindow"
  style="background:#fff;box-shadow:0 4px 20px #5c78a7;display:flex;flex-direction:column;height:auto"
  :w="920"
  :h="525"
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
  <el-table @selection-change="selectChange" ref="multipleTable" :data="tableData" :max-height="100" tooltip-effect="light">
    <el-table-column label="序号" type="index" width="120"></el-table-column>
    <el-table-column prop="id" label="收费站ID"></el-table-column>
    <el-table-column prop="id" label="收费站名称"></el-table-column>
    <el-table-column prop="kind" label="收费站类型" show-overflow-tooltip></el-table-column>
    <el-table-column type="selection" width="55"></el-table-column>
  </el-table>
  <el-collapse :v-model="'1'" @change="toggleTable" style="flex:1">
    <el-collapse-item name="1">
      <template slot="title">
        <div style="text-align:center;background: rgb(241, 241, 241)">
          <i style="font-size: 1.8em;color:#636ef5;vertical-align: sub;" :class="isTableShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          <span style="color:#636ef5;">{{isTableShow ? '隐藏编辑面板' : '显示编辑面板'}}</span>
        </div>
      </template>
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
        <el-tab-pane :label="isEdit[3]?'* 货车计重装载费率(广东不超限)':'货车计重装载费率(广东不超限)'">
          <sc-toll-load-gd @tabStatusChange="changeTabStatus"></sc-toll-load-gd>
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
    </el-collapse-item>
  </el-collapse>
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
  import scTollLoadGd from './scTollLoadGd';
  import scTollOverLoad from './scTollOverLoad';
  import scTollRdlinkBt from './scTollRdlinkBt';
  import scTollSpecialPay from './scTollSpecialPay';
  import scTollTruck from './scTollTruck';
  import {getTollGate} from '../../dataService/api';
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
      scTollLoadGd,
      scTollOverLoad,
      scTollRdlinkBt,
      scTollSpecialPay,
      scTollTruck
    },
    data() {
      return {
        serachShow: false,
        topDis:200,
        leftDis:300,
        activeIndex: 0,
        tabPosition: 'left',
        isEdit: [false,false,false,false,false,false,false,false,false],
        isTableShow: false,
        multipleSelection: [],
        tableData: [],
        workFlag: 'static'
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
        let pids = [];
        selection.forEach(item => {
          pids.push(item.id);
        });
        this.$store.commit('changeEditSelectedData', pids);
      },
      tabOnActive(e){
        this.activeIndex = parseInt(e.index);
      }
    },
    mounted() {
      this.workFlag = appUtil.getGolbalData().workType
      this.tableData = this.$store.state.selectedData;
      let self = this;
      setTimeout(function () {
        self.toggleSelection(self.tableData);
      })
    },
    beforeMount() {
      let viewWidth = document.documentElement.clientWidth;
      let viewHeight = document.documentElement.clientHeight;
      this.leftDis = (viewWidth - 920) /2;
      this.topDis = (viewHeight - 525) /2;
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
