<template>
  <el-dialog title="收费站信息编辑"
    width="1200px"
    custom-class="tableDialog"
    @close='closeDialog'
    modal.boolean=false
    :visible="dialogTableVisible">
    <el-tabs @tab-click='tabOnActive'  :tab-position="tabPosition" style="height: 350px;">
      <el-tab-pane label="客车车型划分及费率">
        <sc-toll-car ng-if="activeIndex==0" :table-data="tableData"></sc-toll-car>
      </el-tab-pane>
      <el-tab-pane label="货车车型划分及空载费率">
        <sc-toll-truck ng-if="activeIndex==1" :table-data="tableData"></sc-toll-truck>
      </el-tab-pane>
      <el-tab-pane label="货车计重正常装载费率(不超限)">
        <sc-toll-load ng-if="activeIndex==2" :table-data="tableData"></sc-toll-load>
      </el-tab-pane>
      <el-tab-pane label="货车计重装载费率(不超限)">
        <sc-toll-load-gd ng-if="activeIndex==3" :table-data="tableData"></sc-toll-load-gd>
      </el-tab-pane>
      <el-tab-pane label="货车计重装载费率(超限)">
        <sc-toll-over-load ng-if="activeIndex==4" :table-data="tableData"></sc-toll-over-load>
      </el-tab-pane>
      <el-tab-pane label="收费站加费信息表">
        <sc-toll-gate-fee ng-if="activeIndex==5" :table-data="tableData"></sc-toll-gate-fee>
      </el-tab-pane>
      <el-tab-pane label="收费站区间表">
        <sc-toll-grou ng-if="activeIndex==6" :table-data="tableData"></sc-toll-grou>
      </el-tab-pane>
      <el-tab-pane label="限制载重信息表">
        <sc-toll-limit ng-if="activeIndex==7" :table-data="tableData"></sc-toll-limit>
      </el-tab-pane>
      <el-tab-pane label="桥隧道收费附加表">
        <sc-toll-rdlink-bt ng-if="activeIndex==8" :table-data="tableData"></sc-toll-rdlink-bt>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>



<script>
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
        tableData: {}
      }
    },
    methods: {
      closeDialog() {
        this.$emit('DialogClose')
      },
      tabOnActive(e){
        this.activeIndex = parseInt(e.index);
        let tables = ['SC_TOLL_CAR','SC_TOLL_TRUCK','SC_TOLL_LOAD','SC_TOLL_LOAD_GD','SC_TOLL_OVERLOAD','SC_TOLL_TOLLGATEFEE','SC_TOLL_GROU', 'SC_TOLL_LIMIT','SC_TOLL_RDLINK_BT'];
        let param = {table: tables[e.index], pid: 55796611}
        getTollGate(param)
        .then(result => {
          console.log(result);
          let {errorCode, data} = result;
          this.tableData = data[0];
        })
        .finally(() => {
          console.log('finally');
        })
        .catch(err => {
          console.log(err);
        });
      }
    }
  }

</script>

<style scoped>
  .tableDialog {
    background: #636ef5;
  }
</style>
