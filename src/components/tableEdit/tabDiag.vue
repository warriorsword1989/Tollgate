<template>
<vue-draggable-resizable
  class="dragWindow"
  style="background:#fff;z-index:10;position:absolute;box-shadow:0 4px 20px #5c78a7;display:flex;flex-direction:column;height:auto;"
  v-if="dialogTableVisible"
  :w="1000"
  :h="525"
  :drag-handle="'.drag'"
  :resizable="false"
  :maximize="true"
  :handles="['br']"
  :append-to-body="false">
  <!-- title-->
  <div class="drag windowTitle">
    <i style="line-height:40px;width:950px" class="el-icon-edit-outline"> 收费站信息编辑</i>
    <i @click="closeDialog" style="line-height:40px;cursor:pointer;width: 40px;text-align: center;cursor: pointer;" class="el-icon-close"></i>
  </div>
  <!-- table-->
  <el-table border ref="multipleTable" :data="tableData3" :max-height="70" tooltip-effect="light">
    <el-table-column label="序号" prop="index" width="120"></el-table-column>
    <el-table-column prop="tollgateId" label="收费站ID"></el-table-column>
    <el-table-column prop="tollgateName" label="收费站名称"></el-table-column>
    <el-table-column prop="tollgateType" label="收费站类型" show-overflow-tooltip></el-table-column>
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
          <sc-toll-car @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-car>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[1]?'* 货车车型划分及空载费率': '货车车型划分及空载费率'">
          <sc-toll-truck @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-truck>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[2]?'* 货车计重装载费率(不超限)':'货车计重装载费率(不超限)'">
          <sc-toll-load @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-load>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[3]?'* 货车计重装载费率[广东](不超限)':'货车计重装载费率[广东](不超限)'">
          <sc-toll-load-gd @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-load-gd>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[4]?'* 货车计重装载费率(超限)':'货车计重装载费率(超限)'">
          <sc-toll-over-load @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-over-load>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[5]?'* 收费站加费信息表':'收费站加费信息表'">
          <sc-toll-gate-fee @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-gate-fee>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[6]?'* 收费站区间表': '收费站区间表'">
          <sc-toll-grou @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-grou>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[7]?'* 限制载重信息表' : '限制载重信息表'">
          <sc-toll-limit @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-limit>
        </el-tab-pane>
        <el-tab-pane :label="isEdit[8] ? '* 桥隧道收费附加表': '桥隧道收费附加表'">
          <sc-toll-rdlink-bt @tabStatusChange="changeTabStatus" :selected-data='tableData3[0]'></sc-toll-rdlink-bt>
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
  export default {
    name: 'tabDiag',
    props: ['dialogTableVisible'],
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
        activeIndex: 0,
        tabPosition: 'left',
        isEdit: [false,false,false,false,false,false,false,false,false],
        tableData3: [{
          index: 1,
          tollgateId: '55796611',
          tollgateName: '云南省',
          tollgateType: '安宁西（温泉）收费站'
        }],
        isTableShow: false,
        isDialogShow: true,
        multipleSelection: []
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
      destroyedChild(){},
      tabOnActive(e){
        this.activeIndex = parseInt(e.index);
      }
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
</style>
