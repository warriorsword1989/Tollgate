<template style="height: 100%">
  <!--主页面-->
  <div style="width: 100%;height: 100%;overflow: auto;background-color: #FFFFFF" class="homeContainer">
    <el-tabs v-model="activeName"  :tab-position="tabPosition" style="height: 100%">
      <el-tab-pane label="照片作业" name="first" style="height: 100%">
        <div class="scroll_style" style="height: 190px; padding-top: 20px">
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
                <el-button @click="handleClick(scope.row)" type="button" size="small">动态作业</el-button>
                <el-button @click="handleClick(scope.row)" type="button" size="small">静态作业</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="tip.currentPage" :page-size="tip.pageSize" layout="total, prev, pager, next" :total="tip.photoData.length"></el-pagination>
        </div>
      </el-tab-pane>
<!--情报作业-->
      <!--<el-tab-pane label="情报作业" name="second" style="height: 100%">-->
        <!--<div class="scroll_style" style="height: 200px;">-->
          <!--<div class="photoProject_rightDiv_search">-->
            <!--<div class="photoProject_rightDiv_choose">-->
              <!--<span>行政区划：</span>-->
              <!--<el-select v-model="cityId" placeholder="请选择">-->
                <!--<el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
              <!--</el-select>-->
            <!--</div>-->
            <!--<div class="photoProject_rightDiv_choose">-->
              <!--<span>情报编码：</span>-->
              <!--<div style="display: inline-block">-->
                <!--<el-input v-model="versionNum" placeholder="请输入内容"></el-input>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="photoProject_rightDiv_choose">-->
              <!--<span>新闻发布日期：</span>-->
              <!--<el-date-picker v-model="sendBeforeTime" type="date" placeholder="选择日期" :picker-options="sendDateBefore"></el-date-picker>-->
              <!--<span>至</span>-->
              <!--<el-date-picker v-model="sendAfterTime" type="date" placeholder="选择日期" :picker-options="sendDateAfter"></el-date-picker>-->
            <!--</div>-->
              <!--<el-checkbox-group class="photoProject_rightDiv_choose" v-model="checkList">-->
                <!--<span>完成状态：</span>-->
                <!--<el-checkbox label="未处理"></el-checkbox>-->
                <!--<el-checkbox label="已处理"></el-checkbox>-->
                <!--<el-checkbox label="无法处理"></el-checkbox>-->
              <!--</el-checkbox-group>-->
            <!--<div class="photoProject_rightDiv_choose">-->
              <!--<span>推送日期：</span>-->
              <!--<el-date-picker v-model="pushBeforeTime" type="date" placeholder="选择日期" :picker-options="pushBefore"></el-date-picker>-->
              <!--<span>至</span>-->
              <!--<el-date-picker v-model="pushAfterTime" type="date" placeholder="选择日期" :picker-options="pushAfter"></el-date-picker>-->
            <!--</div>-->
            <!--<div>-->
              <!--<div style="float: right;margin-right: 100px" @click="searchList()">-->
                <!--<el-button>查询</el-button>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div  style="height:calc(100% - 300px);">-->
          <!--<div class="scroll_style">-->
            <!--<el-table  :data="genData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%;">-->
              <!--<el-table-column prop="id" label="序号" width="180" type="index" align="center"></el-table-column>-->
              <!--<el-table-column prop="tollGateName" label="收费站名称" width="180" align="center"></el-table-column>-->
              <!--<el-table-column prop="tollGateType" label="收费站类型" align="center"></el-table-column>-->
              <!--<el-table-column prop="passagewayNum" label="通道总数" align="center"></el-table-column>-->
              <!--<el-table-column prop="provinceFee" label="是否跨省收费" align="center"></el-table-column>-->
              <!--<el-table-column prop="feedback" label="tips反馈" align="center"></el-table-column>-->
              <!--<el-table-column prop="operation" label="操作" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button @click="handleClick(scope.row)" type="button" size="small">动态作业</el-button>-->
                  <!--<el-button @click="handleClick(scope.row)" type="button" size="small">静态作业</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="block">-->
          <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="4" layout="total, prev, pager, next" :total="20"></el-pagination>-->
        <!--</div>-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>

</template>

<script>
    import { getTollGateTipList } from '../dataService/api';
    import { cityList } from '../config/CityList';
    export default {
        name: "Home",
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
            sendBeforeTime:preTime,
            sendAfterTime:time,
            pushBeforeTime:preTime,
            pushAfterTime:time,
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
            sendDateBefore:{
              disabledDate: (time) => {
                let beginDateVal = this.sendAfterTime;
                if (beginDateVal) {
                  return time.getTime() > beginDateVal;
                }
              }
            },
            sendDateAfter:{
              disabledDate: (time) => {
                let beginDateVal = this.sendBeforeTime;
                if (beginDateVal) {
                  return time.getTime() < beginDateVal;
                }
              },
            },
            pushBefore:{
              disabledDate: (time) => {
                let beginDateVal = this.pushAfterTime;
                if (beginDateVal) {
                  return time.getTime() > beginDateVal;
                }
              }
            },
            pushAfter:{
              disabledDate: (time) => {
                let beginDateVal = this.pushBeforeTime;
                if (beginDateVal) {
                  return time.getTime() < beginDateVal;
                }
              },
            },
          };
        },
        methods: {
          changePage:function () {

          },
          handleClick:function (data) {
            console.log(data)
            this.$router.push({name:'mainMap', params:{rowkey:data.rowkey, photoId:data.photo_id, point:data.toll_location}});
          },
          handleSizeChange:function (val) {
            this.tip.pageSize = val;
          },
          handleCurrentChange:function (val) {
            this.tip.currentPage = val;
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
        },
        mounted: function() {
          this.getTollGateTipList();
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
