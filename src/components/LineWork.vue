<template>
  <div class="fm-panel">
    <div class="header"><div class="title"><span>线作业</span></div></div>
    <!-- 线作业顶部搜索 -->
    <div style="padding: 5px;">
      <el-input placeholder="请输入内容" size="small" v-model="roadName" class="input-with-select">
        <template slot="prepend">道路名称</template>
        <el-button type="primary" slot="append" icon="el-icon-search" @click="searchToll()"></el-button>
      </el-input>
    </div>
    <!-- 线作业数据列表 -->
    <div v-show="tollData.length">
      <el-table :data="tollData" border :height="getTableHeight()" @row-click="showInMap" @selection-change="handleSelectionChange">
        <el-table-column width="35" type="selection"></el-table-column>
        <el-table-column width="50" prop="id" label="序号" type="index" align="center"></el-table-column>
        <el-table-column width="125" prop="name" label="收费站名称" align="center" ></el-table-column>
        <el-table-column prop="pid" label="ID" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 线作业编辑按钮 -->
    <div class="bottomBtn" v-show="tollData.length">
      <el-button type="primary" size="small" @click="addOrEditTollData('update')">编辑收费站信息</el-button>
      <el-button type="primary" size="small" @click="addOrEditTollData('insert')">新增收费站信息</el-button>
    </div>
  </div>
</template>

<script>
    import { getTollListByRdName, getTollListByTollId,getSearchData } from '../dataService/api';
    import { getCityNameByCode } from '../config/CityList';
    import '../uikits/controllers/EventController';
    import { appUtil } from '../Application';
    export default {
      name: "line-work",
      data() {
        return {
          feedbackCtrl: fastmap.mapApi.FeedbackController.getInstance(),
          feedback: new fastmap.mapApi.Feedback(),
          pointSymbol: fastmap.mapApi.symbol.GetSymbolFactory().getSymbol('pt_relation_border'),
          roadName: '',
          tollData: [],
          multipleSelection: [],
          tollIds: [],
          eventController: fastmap.uikit.EventController()
        }
      },
      methods: {
        clearFeedBack: function () {
          this.feedback.clear();
          this.feedbackCtrl.refresh();
        },
        getTableHeight() {
          const documentObj = document.documentElement;
          return documentObj.clientHeight - 140;
        },
        showInMap(row, event, column) {
          getSearchData({type: 1,searchText: row.pid, systemId: getCityNameByCode(appUtil.getGolbalData().adminCode).systemId})
            .then(data => {
              if (data.errorCode === 0) {
                let geometryAlgorithm = new fastmap.mapApi.geometry.GeometryAlgorithm();
                let point = geometryAlgorithm.wktToGeojson(data.data[0].geometry);
                const map = window.map;
                map.getLeafletMap().setView([point.coordinates[1], point.coordinates[0]], 17);
                setTimeout(() => {
                  this.feedback.clear();
                  this.feedback.add(point, this.pointSymbol);
                  this.feedbackCtrl.refresh();
                }, 500);
              }
            });
        },
        searchToll: function () {
          if (this.roadName === '') {
            return;
          }
          const self = this;
          const param = {
            roadName: this.roadName,
            adminCode: appUtil.getGolbalData().adminCode
          };
          getTollListByRdName(param).then(function (data) {
            if (data.errorCode === 0) {
              self.tollData = data.data;
            }
          });
        },
        addOrEditTollData: function (handleFlag) {
          if (this.multipleSelection.length === 0) {
            return;
          }
          const self = this;
          let id = [];
          let existToll = [];
          let notExistToll = [];
          let actualArray = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            id.push(this.multipleSelection[i].pid)
          }
          const param = {tollIds: id};
          getTollListByTollId(param).then(function (data) {
            if (data.errorCode === 0) {
              for (let j = 0; j < data.data.length; j++) {
                existToll.push(data.data[j].toll_pid);
              }
              notExistToll = id.filter(item => !existToll.includes(item));
              actualArray = handleFlag === 'update' ? notExistToll : existToll;
              if (actualArray.length > 0) {
                self.$confirm(actualArray.toString() + `${handleFlag === 'update' ? '没有' : '已有'}收费信息, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  self.tollIds = id;
                  self.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: id, event: event, flag:handleFlag,sourceFlag: 2 });
                }).catch(() => {
                  self.$message({
                    type: 'info',
                    message: `已取消${handleFlag === 'update' ? '编辑' : '新增'}收费站`
                  });
                });
              } else {
                self.tollIds = id;
                self.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: id, event: event, flag:handleFlag,sourceFlag: 2 });
              }
            }
          });
        },
        handleSelectionChange: function (val) {
          this.multipleSelection = val;
        }
      },
      mounted() {
        this.feedbackCtrl.add(this.feedback);
      },
      destroyed(e) {
        this.clearFeedBack();
      }
    }
</script>

<style scoped>
  .bottomBtn {
    display: flex;
    margin-top: 15px;
    flex-direction: row;
    justify-content: center;
  }
</style>
