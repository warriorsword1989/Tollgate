<template>
  <div v-loading="loading" element-loading-text="查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);" class="dataList">
    <i @click="closeDataList" class="el-icon-circle-close-outline close"></i>
    <ul>
      <li :index="index" @click="clickPid(item)" v-for="(item, index) in tableData">{{`${item.name} - ${item.pid}`}}</li>
    </ul>
  </div>
</template>

<script>
    import { getTollName } from '@/dataService/api';
    export default {
        name: "dataList",
        data() {
          return {
            loading: true,
            tableData: [],
            eventController: fastmap.uikit.EventController()
          }
        },
        methods: {
          clickPid(eData) {
            this.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: [eData.pid], systemIds: [eData.system_id], event: event, flag: 'update', sourceFlag: 3, toolType: 'tableList' });
          },
          closeDataList () {
            this.$emit('closeDataList');
          }
        },
        mounted() {
          this.eventController.off('moreData');
          this.eventController.on('moreData', data => {
            const param = { table: 'RD_TOLLGATE_NAME', pid: data.data };
            getTollName(param).then(res => {
              this.$nextTick(() => {
                this.tableData = res.data;
                this.loading = false;
              });
            });
          });
        },
    }
</script>

<style scoped>
  .dataList {
    position: absolute;
    top: 50px;
    right: 50px;
    min-width: 150px;
    min-height: 50px;
    background: #fff;
    z-index: 9;
    box-shadow: 0 0 10px #93bbff;
  }
  .close {
    position: absolute;
    right: 3px;
    top: 3px;
    color: red;
    font-size: 14px;
    cursor: pointer;
  }
  ul {
    list-style: none;
    padding: 10px;
    margin: 0
  }
  li {
    padding: 2px 0;
    text-align: center;
    cursor: pointer;
    color: #3399ff;
    text-decoration: underline;
  }
</style>
