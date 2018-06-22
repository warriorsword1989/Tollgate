<template style="height: 100%">
  <!--主页面-->
  <div style="width: 100%;height: 100%;overflow: auto;background-color: #FFFFFF" class="homeContainer">
    <el-tabs @tab-click="toggleWork" v-model="activeName"  :tab-position="tabPosition" style="height: 100%">
      <el-tab-pane label="照片作业" name="first">
        <!--<div class="scroll_style" style="height: 190px; padding-top: 20px">
          <div class="photoProject_rightDiv_search">
              <div class="photoProject_rightDiv_choose">
                <span>行政区划：</span>
                <el-select v-model="tip.adminCode" placeholder="请选择">
                  <el-option v-for="item in tip.cityList" :key="item.adminCode" :label="item.cityName" :value="item.adminCode"></el-option>
                </el-select>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>版本号：</span>
                <div style="display: inline-block">
                  <el-input v-model="tip.tipsVersion" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>更新时间：</span>
                <el-date-picker v-model="tip.updateStartTime" type="date" placeholder="选择日期" :picker-options="pickerupdateDateBefore" value-format="yyyy-MM-dd"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="tip.updateEndTime" type="date" placeholder="选择日期" :picker-options="pickerupdateDateAfter" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>收费站名称：</span>
                <div style="display: inline-block" >
                  <el-input v-model="tip.tollName" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="photoProject_rightDiv_choose">
                <el-checkbox-group v-model="tip.isAdopted"　class="photoProject_rightDiv_choose">
                  <span>tips反馈：</span>
                  <el-checkbox label='1'>未处理</el-checkbox>
                  <el-checkbox label='2'>已处理</el-checkbox>
                  <el-checkbox label='3'>无法处理</el-checkbox>
                </el-checkbox-group>
              </div>
              <div>
                <div style="float: right;margin-right: 100px" @click="getTollGateTipList()">
                  <el-button>查询</el-button>
                </div>
              </div>
          </div>
        </div>
        <div style="height:calc(100% - 300px);padding-right: 10px">
          <el-table :data="tip.photoData.slice((tip.currentPage-1)*tip.pageSize,tip.currentPage*tip.pageSize)" border height="500 - 300" style="width: 100%;height: 100%;">
            <el-table-column prop="id" label="序号" type="index" align="center"></el-table-column>
            <el-table-column prop="toll_name" label="收费站名称" align="center"></el-table-column>
            <el-table-column prop="tollTypeName" label="收费站类型" align="center"></el-table-column>
            <el-table-column prop="toll_pnum" label="通道总数" align="center"></el-table-column>
            <el-table-column prop="tollLocName" label="是否跨省收费" align="center"></el-table-column>
            <el-table-column prop="isAdoptedName" label="tips反馈" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row, 'dynamic', 1)" disabled type="button" size="small">动态作业</el-button>
                <el-button @click="handleClick(scope.row, 'static', 1)" type="button" size="small">静态作业</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="tip.currentPage" :page-size="tip.pageSize" :page-sizes="[10, 20, 50]" layout="sizes, total, prev, pager, next" :total="tip.photoData.length"></el-pagination>
        </div>-->
      </el-tab-pane>
<!--情报作业-->
      <el-tab-pane label="情报作业" name="second">
        <!--<div class="scroll_style" style="height: 190px; padding-top: 20px">
          <div class="photoProject_rightDiv_search">
            <div class="photoProject_rightDiv_choose">
              <span>行政区划：</span>
              <el-select v-model="info.adminCode" placeholder="请选择">
                <el-option v-for="item in info.cityList" :key="item.adminCode" :label="item.cityName" :value="item.adminCode"></el-option>
              </el-select>
            </div>
            <div class="photoProject_rightDiv_choose">
              <span>情报编码：</span>
              <div style="display: inline-block">
                <el-input v-model="info.infoCode" placeholder="请输入内容"></el-input>
              </div>
            </div>
              <el-checkbox-group class="photoProject_rightDiv_choose" v-model="info.complete">
                <span>完成状态：</span>
                <el-checkbox label="1">未处理</el-checkbox>
                <el-checkbox label="2">已处理</el-checkbox>
                <el-checkbox label="3">无法处理</el-checkbox>
              </el-checkbox-group>
            <div class="photoProject_rightDiv_choose">
              <span>推送日期：</span>
              <el-date-picker v-model="info.pushBeforeTime" type="date" placeholder="选择日期" :picker-options="pushBefore" value-format="yyyy-MM-dd"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="info.pushAfterTime" type="date" placeholder="选择日期" :picker-options="pushAfter" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div>
              <div style="float: right;margin-right: 100px" @click="getTollGateInfoList()">
                <el-button>查询</el-button>
              </div>
            </div>
          </div>
        </div>
        <div style="height:calc(100% - 300px);padding-right: 10px">
          <el-table :data="info.infoData.slice((info.currentPage-1)*info.pageSize,info.currentPage*info.pageSize)" border height="500 - 300" style="width: 100%;height: 100%;">
            <el-table-column prop="id" label="序号" type="index" align="center"></el-table-column>
            <el-table-column prop="info_code" label="情报编码" align="center"></el-table-column>
            <el-table-column prop="url" label="来源网址" align="center"></el-table-column>
            <el-table-column prop="info_content" label="新闻内容" align="center"></el-table-column>
            <el-table-column prop="news_time" label="发布日期" align="center"></el-table-column>
            <el-table-column prop="public_time" label="推送日期" align="center"></el-table-column>
            <el-table-column prop="completeName" label="完成状态" align="center"></el-table-column>
            <el-table-column prop="memo" label="备注" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row, 'dynamic', 2)" disabled type="button" size="small">动态作业</el-button>
                <el-button @click="handleClick(scope.row, 'static', 2)" type="button" size="small">静态作业</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @size-change="handleInfoSizeChange" @current-change="handleInfoCurrentChange" :current-page.sync="info.currentPage" :page-size="info.pageSize" :page-sizes="[10, 20, 50]" layout="sizes, total, prev, pager, next" :total="info.infoData.length"></el-pagination>
        </div>-->
      </el-tab-pane>
      <router-view></router-view>
    </el-tabs>
    <user-tool class="userToolbar" style="50px"></user-tool>
  </div>
</template>

<script>
    import UserTool from './UserTool';
    import {appUtil} from '../Application';
    import { getTollGateTipList, getTollGateInfoList, getAdminLoc } from '../dataService/api';
    import { cityList } from '../config/CityList';
    export default {
        name: "Home",
        components: {UserTool},
        data() {
          // 显示前一个月
          let date = new Date();
          let preDate = new Date();
          preDate.setDate(new Date().getDate() - 30);
          let year = date.getFullYear();
          let preYear = preDate.getFullYear();
          let month = date.getMonth() + 1;
          let preMonth = preDate.getMonth() + 1;
          if (month < 10) {
            month = '0' + month.toString();
          } else {
            month = month.toString();
          }
          if (preMonth < 10) {
            preMonth = '0' + preMonth.toString();
          } else {
            preMonth = preMonth.toString();
          }
          let day = date.getDate();
          let preDay = preDate.getDate();
          if (day < 10) {
            day = '0' + day.toString();
          } else {
            day = day.toString();
          }
          if (preDay < 10) {
            preDay = '0' + preDay.toString();
          } else {
            preDay = preDay.toString();
          }
          let time = year.toString() + '-' + month + '-' + day.toString();
          let preTime = preYear.toString() + '-' + preMonth + '-' + preDay.toString();
          return {
            loading: true,
            activeName: 'first',
            tabPosition:'left',
            tip: {
              tollType: [
                '未调查', '领卡', '交卡付费', '固定收费(次费)',
                '交卡付费后再领卡', '交卡付费并代收固定费用',
                '验票(无票收费)', '领卡并代收固定费用', '持卡打标识不收费',
                '验票领卡', '交卡不收费'
              ],
              tipsVersion:'',
              updateStartTime:preTime,
              updateEndTime:time,
              tollName:'',
              adminCode:'110000',
              isAdopted: ['1', '2', '3'],
              photoData: [],
              pageSize:10,
              currentPage:1,
              cityList: cityList
            },
            info: {
              pushBeforeTime:preTime,
              pushAfterTime:time,
              adminCode:'110000',
              complete: ['1', '2', '3'],
              infoData: [],
              pageSize:10,
              currentPage:1,
              cityList: cityList,
              infoCode: '',
              loc: ''
            },
            tollGateNames:[{}],
            genDataPagesize:10,
            genDataCurrentPage:1,
            tollGateSearch:'',
            value: '',
            radio: '1',
            // 时间控件
            pickerupdateDateBefore:{
              disabledDate: (time) => {
                let beginDateVal = this.tip.updateEndTime;
                if (beginDateVal) {
                  return time.getTime() > beginDateVal;
                }
              }
            },
            pickerupdateDateAfter:{
              disabledDate: (time) => {
                let beginDateVal = this.tip.updateStartTime;
                if (beginDateVal) {
                  return time.getTime() < beginDateVal;
                }
              },
            },
            // 时间控件
            pushBefore:{
              disabledDate: (time) => {
                let beginDateVal = this.info.pushAfterTime;
                if (beginDateVal) {
                  return time.getTime() > beginDateVal;
                }
              }
            },
            pushAfter:{
              disabledDate: (time) => {
                let beginDateVal = this.info.pushBeforeTime;
                if (beginDateVal) {
                  return time.getTime() < beginDateVal;
                }
              },
            },
          };
        },
        methods: {
          /**
            * 切换路由
           */
          toggleWork (e) {
            const tabIndex = parseInt(e.index);
            tabIndex ? this.$router.push({ path: '/home/infosWork' }) : this.$router.push({ path: '/home/photoWork' });
          },

          handleClick:function (data, type, dataSource) {
            if (dataSource === 1) {
              this.$router.push({name:'mainMap', params:{point:data.toll_location,type: 1, data: {
                    tipsVersion: this.tip.tipsVersion,
                    updateStartTime: this.tip.updateStartTime,
                    updateEndTime: this.tip.updateEndTime,
                    tollName: this.tip.tollName,
                    adminCode: this.tip.adminCode,
                    isAdopted:this.tip.isAdopted,
                    pageSize:this.tip.pageSize,
                    currentPage:this.tip.currentPage
                  }}});
              appUtil.setGolbalData({
                workType: type,
                adminCode: this.tip.adminCode,
                rowkey: data.rowkey,
                photo_id: data.photo_id,
                dataSource: dataSource,
              });
            } else {
              this.$router.push({name:'mainMap', params:{point:this.info.loc,type: 2, data: {
                    pushBeforeTime: this.info.pushBeforeTime,
                    pushAfterTime: this.info.pushAfterTime,
                    adminCode: this.info.adminCode,
                    complete: this.info.complete,
                    pageSize: this.info.pageSize,
                    currentPage:this.info.currentPage,
                    infoCode:this.info.infoCode
                  }}});
              appUtil.setGolbalData({
                workType: type,
                adminCode: this.info.adminCode,
                dataSource: dataSource,
                infoCode: data.info_code
              });
            }
          },
          handleSizeChange:function (val) {
            this.tip.pageSize = val;
          },
          handleCurrentChange:function (val) {
            this.tip.currentPage = val;
          },
          handleInfoSizeChange:function (val) {
            this.info.pageSize = val;
          },
          handleInfoCurrentChange:function (val) {
            this.info.currentPage = val;
          },
          // 获取数据
          getTollGateTipList() {
            const self = this;
            const isAdoptedInt = [];
            for (let i = 0; i < this.tip.isAdopted.length; i++) {
              isAdoptedInt.push(parseInt(this.tip.isAdopted[i], 10));
            }
            const param = {
              adminCode: this.tip.adminCode,
              tipsVersion: this.tip.tipsVersion,
              tollName: this.tip.tollName,
              isAdopted: isAdoptedInt,
              updateStartTime: this.tip.updateStartTime,
              updateEndTime: this.tip.updateEndTime
            };
            getTollGateTipList(param).then(function (data) {
              if (data.errorCode === 0) {
                const resultData = data.data;
                for (let i = 0; i < resultData.length; i++) {
                  resultData[i].tollTypeName = self.tip.tollType[parseInt(resultData[i].toll_type, 10)];
                  resultData[i].tollLocName = parseInt(resultData[i].toll_loc, 10) === 0 ? '未调查' : parseInt(resultData[i].toll_loc, 10) === 1 ? '本省收费站' : '跨省收费站';
                  resultData[i].isAdoptedName = parseInt(resultData[i].is_adopted, 10) === 1 ? '未处理' : parseInt(resultData[i].is_adopted, 10) === 2 ? '已处理' : '无法处理';
                }
                self.tip.photoData = resultData
              }
            });
          },
          getTollGateInfoList: function () {
            const self = this;
            const complete = [];
            for (let i = 0; i < this.info.complete.length; i++) {
              complete.push(parseInt(this.info.complete[i], 10));
            }
            let pushBeforeTime = this.info.pushBeforeTime;
            let pushAfterTime = this.info.pushAfterTime;
            if (pushBeforeTime) {
              pushBeforeTime = pushBeforeTime.replace(new RegExp(/(-)/g), '');
            }
            if (pushAfterTime) {
              pushAfterTime = pushAfterTime.replace(new RegExp(/(-)/g), '');
            }
            const param = {
              adminCode: this.info.adminCode,
              infoCode: this.info.infoCode,
              complete: complete,
              pushBeforeTime: pushBeforeTime,
              pushAfterTime: pushAfterTime
            };
            const param1 = {
              adminCode: this.info.adminCode
            };
            getTollGateInfoList(param).then(function (data) {
              if (data.errorCode === 0) {
                const self1 = self;
                const resultData = data.data;
                for (let i = 0; i < resultData.length; i++) {
                  resultData[i].completeName = parseInt(resultData[i].complete, 10) === 1 ? '未处理' : parseInt(resultData[i].complete, 10) === 2 ? '已处理' : '无法处理';
                }
                self.info.infoData = resultData;
                getAdminLoc(param1).then(function (data1) {
                  if (data1.errorCode === 0) {
                    self1.info.loc = data1.data[0].geometry;
                  }
                })
              }
            });
          }
        },
        watch: {
          /**
            * 对路由的监听来切换数据
           */
          '$route': function (newVal, oldVal) {
            console.log(newVal, oldVal);
          }
        },
        mounted: function() {
          if (this.$route.params.data) {
            if (this.$route.params.type === 1) {
              this.tip.tipsVersion = this.$route.params.data.tipsVersion;
              this.tip.updateStartTime = this.$route.params.data.updateStartTime;
              this.tip.updateEndTime = this.$route.params.data.updateEndTime;
              this.tip.tollName = this.$route.params.data.tollName;
              this.tip.adminCode = this.$route.params.data.adminCode;
              this.tip.isAdopted = this.$route.params.data.isAdopted;
              this.tip.pageSize = this.$route.params.data.pageSize;
              this.tip.currentPage = this.$route.params.data.currentPage;
              this.getTollGateTipList();
            } else if (this.$route.params.type === 2) {
              this.info.pushBeforeTime = this.$route.params.data.pushBeforeTime;
              this.info.pushAfterTime = this.$route.params.data.pushAfterTime;
              this.info.adminCode = this.$route.params.data.adminCode;
              this.info.complete = this.$route.params.data.complete;
              this.info.pageSize = this.$route.params.data.pageSize;
              this.info.currentPage = this.$route.params.data.currentPage;
              this.info.infoCode = this.$route.params.data.infoCode;
              this.activeName = 'second';
              this.getTollGateInfoList();
            }
          } else {
            this.getTollGateTipList();
          }
        }
    }
</script>

<style scoped>
.photoProject_rightDiv_search{
  font-family:  Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  width: 100%;
}
.photoProject_rightDiv_search　span{
  display: inline-block;
}

.photoProject_rightDiv_choose {
  display: inline-block;
  padding-left: 20px;
  padding-bottom: 20px;
}
.photoProject_rightDiv_choose > span{
  font-size: 14px;
  display:inline-block;
  color: #000000;
  padding-right: 5px;
}
.block .el-pagination{
  float: right;
  padding:20px 60px;
}
.photoProject_rightDiv_tollGate{
  height:200px;
  width: 200px;
  background-color: #666666;
}
</style>
