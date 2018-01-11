<template>
  <el-dialog title="收费站信息编辑" width="1200px" custom-class="tableDialog" @close='closeDialog' modal.boolean=false :visible="dialogTableVisible">
    <el-tabs :tab-position="tabPosition" style="height: 350px;">
      <el-tab-pane label="客车车型划分及费率">
        <sc-toll-car></sc-toll-car>
      </el-tab-pane>
      <el-tab-pane label="货车车型划分及空载费率">
        <sc-toll-truck></sc-toll-truck>
      </el-tab-pane>
      <el-tab-pane label="货车计重装载费率(不超限)">
        <sc-toll-load></sc-toll-load>
      </el-tab-pane>
      <el-tab-pane label="货车计重装载费率(不超限)">
        <sc-toll-load-gd></sc-toll-load-gd>
      </el-tab-pane>
      <el-tab-pane label="货车计重装载费率(超限)">
        <sc-toll-over-load></sc-toll-over-load>
      </el-tab-pane>
      <el-tab-pane label="收费站加费信息表">
        <sc-toll-gate-fee></sc-toll-gate-fee>
      </el-tab-pane>
      <el-tab-pane label="收费站区间表">
        <sc-toll-grou></sc-toll-grou>
      </el-tab-pane>
      <el-tab-pane label="限制载重信息表">
        <sc-toll-limit></sc-toll-limit>
      </el-tab-pane>
      <el-tab-pane label="桥隧道收费附加表">
        <sc-toll-rdlink-bt></sc-toll-rdlink-bt>
      </el-tab-pane>
      <el-tab-pane label="节假日收费浮动信息">
        <sc-toll-holiday></sc-toll-holiday>
      </el-tab-pane>
      <el-tab-pane label="特殊收费浮动信息">
        <sc-toll-special-pay></sc-toll-special-pay>
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
        tabPosition: 'left'
      }
    },
    methods: {
      closeDialog() {
        this.$emit('DialogClose')
      }
    }
  }

</script>

<style scoped>
  .tableDialog {
    background: #636ef5;
  }

</style>
