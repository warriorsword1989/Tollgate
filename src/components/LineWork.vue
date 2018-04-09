<template>
  <div class="fm-panel">
    <div class="header">
      <div class="title">
            <span>
                线作业
            </span>
      </div>
    </div>
    <div>
      <ul class="list-group detailUlCss">
        <li style="padding-top: 10px">
          <div class="blockDescLiDiv">
            <span>道路名称</span>
          </div>
          <el-input v-model="roadName" placeholder="请输入道路名称" size="small" style="width: 200px"></el-input>
        </li>
      </ul>
    </div>
    <div style="float: right;padding-right: 20px;padding-top: 20px">
      <el-button type="primary" size="small" @click="searchToll()">查询</el-button>
    </div>
    <div style="height: 400px;padding: 10px" v-show="tollData.length > 0">
      <el-table :data="tollData" border height="400" style="width: 100%;height: 100%;" @row-click="showInMap" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="name" label="收费站名称" align="center" ></el-table-column>
        <el-table-column prop="pid" label="收费站ID" align="center"></el-table-column>
      </el-table>
    </div>
    <div style="float: right;padding-right: 20px;padding-top: 50px" v-show="tollData.length > 0">
      <el-button type="primary" size="small" @click="addTollData()">新增收费信息</el-button>
    </div>
  </div>
</template>

<script>
    import { getTollListByRdName, getTollListByTollId,getSearchData } from '../dataService/api';
    import '../uikits/controllers/EventController';
    export default {
      name: "line-work",
      data() {
        const symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        return {
          feedbackCtrl: fastmap.mapApi.FeedbackController.getInstance(),
          feedback: new fastmap.mapApi.Feedback(),
          pointSymbol: symbolFactory.getSymbol('pt_relation_border'),
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
        showInMap(row, event, column) {
          console.log(row,event,column)
          getSearchData({type: 1,searchText: row.pid})
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
            roadName: this.roadName
          };
          getTollListByRdName(param).then(function (data) {
            if (data.errorCode === 0) {
              self.tollData = data.data;
            }
          });
        },
        addTollData: function () {
          if (this.multipleSelection.length === 0) {
            return;
          }
          const self = this;
          let id = [];
          let existToll = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            id.push(this.multipleSelection[i].pid)
          }
          const param = {
            tollIds: id
          };
          getTollListByTollId(param).then(function (data) {
            if (data.errorCode === 0) {
              for (let j = 0; j < data.data.length; j++) {
                existToll.push(data.data[j].toll_pid);
              }
              if (existToll.length > 0) {
                self.$confirm(existToll.toString() + '已有收费信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  self.tollIds = id;
                  self.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: id, event: event, flag:'insert',sourceFlag: 2 });
                }).catch(() => {
                  self.$message({
                    type: 'info',
                    message: '已取消新增'
                  });
                });
              } else {
                self.tollIds = id;
                self.eventController.fire(L.Mixin.EventTypes.OBJECTSELECTED, { features: id, event: event, flag:'insert',sourceFlag: 2 });
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
      destroyed() {
        this.clearFeedBack();
      }
    }
</script>

<style scoped>
  .detailUlCss {
    margin-bottom: 0;
    background-color: #ffffff;
    display: block;
    box-shadow: none;
    padding-left: 20px;
  }
  .detailUlCss > li {
    list-style: none;
    background-color: #ffffff;
    font-size: 12px;
    height: auto;
    line-height: 30px;
    color: #182848;
  }
  .detailUlCss > div > li {
    list-style: none;
    background-color: #ffffff;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #182848;
  }
  .blockDescLiDiv {
    display: inline-block;
    width: 58px;
    line-height: 30px;
    vertical-align: top;
  }
</style>
