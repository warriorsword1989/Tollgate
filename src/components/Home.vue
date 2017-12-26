<template style="height: 100%">
  <!--主页面-->
  <div style="width: 100%;height: 100%;overflow: auto;background-color: #FFFFFF" class="homeContainer">
    <el-tabs v-model="activeName"  :tab-position="tabPosition" style="height: 100%">
      <el-tab-pane label="照片作业" name="first" style="height: 100%">
        <div class="scroll_style" style="height: 200px;">
          <div class="photoProject_rightDiv_search">
              <div class="photoProject_rightDiv_choose">
                <span>行政区划：</span>
                <el-select v-model="cityId" placeholder="请选择">
                  <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>版本号：</span>
                <div style="display: inline-block">
                  <el-input v-model="versionNum" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>更新时间：</span>
                <el-date-picker v-model="updateBeforeTime" type="date" placeholder="选择日期"format="yyyy-MM-dd" :picker-options="pickerupdateDateBefore"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="updateAfterTime" type="date" placeholder="选择日期"format="yyyy-MM-dd" :picker-options="pickerupdateDateAfter"></el-date-picker>
              </div>
              <div class="photoProject_rightDiv_choose">
                <span>收费站名称：</span>
                <div style="display: inline-block" >
                  <el-input v-model="tollGateName" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div>
                <el-checkbox-group v-model="checkList"　class="photoProject_rightDiv_choose">
                  <span>tips反馈：</span>
                  <el-checkbox label="未处理"></el-checkbox>
                  <el-checkbox label="已处理"></el-checkbox>
                  <el-checkbox label="无法处理"></el-checkbox>
                </el-checkbox-group>
              </div>
              <div>
                <div style="float: right;margin-right: 100px" @click="searchList()">
                  <el-button>查询</el-button>
                </div>
              </div>
          </div>
        </div>
        <div style="height:calc(100% - 300px);">
          <el-table :data="photoData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border height="" style="width: 100%;height: 100%;">
            <el-table-column prop="id" label="序号" width="180" type="index" align="center"></el-table-column>
            <el-table-column prop="tollGateName" label="收费站名称" width="180" align="center"></el-table-column>
            <el-table-column prop="tollGateType" label="收费站类型" align="center"></el-table-column>
            <el-table-column prop="passagewayNum" label="通道总数" align="center"></el-table-column>
            <el-table-column prop="provinceFee" label="是否跨省收费" align="center"></el-table-column>
            <el-table-column prop="feedback" label="tips反馈" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="button" size="small">动态作业</el-button>
                <el-button @click="handleClick(scope.row)" type="button" size="small">静态作业</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="4" layout="total, prev, pager, next" :total="20"></el-pagination>
        </div>
      </el-tab-pane>
<!--情报作业-->
      <el-tab-pane label="情报作业" name="second" style="height: 100%">
        <div class="scroll_style" style="height: 200px;">
          <div class="photoProject_rightDiv_search">
            <div class="photoProject_rightDiv_choose">
              <span>行政区划：</span>
              <el-select v-model="cityId" placeholder="请选择">
                <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="photoProject_rightDiv_choose">
              <span>情报编码：</span>
              <div style="display: inline-block">
                <el-input v-model="versionNum" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="photoProject_rightDiv_choose">
              <span>新闻发布日期：</span>
              <el-date-picker v-model="sendBeforeTime" type="date" placeholder="选择日期" :picker-options="sendDateBefore"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="sendAfterTime" type="date" placeholder="选择日期" :picker-options="sendDateAfter"></el-date-picker>
            </div>
              <el-checkbox-group class="photoProject_rightDiv_choose" v-model="checkList">
                <span>完成状态：</span>
                <el-checkbox label="未处理"></el-checkbox>
                <el-checkbox label="已处理"></el-checkbox>
                <el-checkbox label="无法处理"></el-checkbox>
              </el-checkbox-group>
            <div class="photoProject_rightDiv_choose">
              <span>推送日期：</span>
              <el-date-picker v-model="pushBeforeTime" type="date" placeholder="选择日期" :picker-options="pushBefore"></el-date-picker>
              <span>至</span>
              <el-date-picker v-model="pushAfterTime" type="date" placeholder="选择日期" :picker-options="pushAfter"></el-date-picker>
            </div>
            <div>
              <div style="float: right;margin-right: 100px" @click="searchList()">
                <el-button>查询</el-button>
              </div>
            </div>
          </div>
        </div>
        <div  style="height:calc(100% - 300px);">
          <div class="scroll_style">
            <el-table  :data="genData.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%;">
              <el-table-column prop="id" label="序号" width="180" type="index" align="center"></el-table-column>
              <el-table-column prop="tollGateName" label="收费站名称" width="180" align="center"></el-table-column>
              <el-table-column prop="tollGateType" label="收费站类型" align="center"></el-table-column>
              <el-table-column prop="passagewayNum" label="通道总数" align="center"></el-table-column>
              <el-table-column prop="provinceFee" label="是否跨省收费" align="center"></el-table-column>
              <el-table-column prop="feedback" label="tips反馈" align="center"></el-table-column>
              <el-table-column prop="operation" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="button" size="small">动态作业</el-button>
                  <el-button @click="handleClick(scope.row)" type="button" size="small">静态作业</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="4" layout="total, prev, pager, next" :total="20"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
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
            versionNum:'',
            updateBeforeTime:preTime,
            updateAfterTime:time,
            sendBeforeTime:preTime,
            sendAfterTime:time,
            pushBeforeTime:preTime,
            pushAfterTime:time,
            tollGateName:'',
            tollGateNames:[{}],
            cityId:'',
            currentPage:1,
            pagesize:10,
            genDataPagesize:10,
            genDataCurrentPage:1,
            tollGateSearch:'',
            cityList: [{
              value: '1',
              label: '北京市'
            }, {
              value: '2',
              label: '长春市'
            }, {
              value: '3',
              label: '北京市'
            }, {
              value: '4',
              label: '北京市'
            }, {
              value: '5',
              label: '北京市'
            }],
            photoData: [{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            }],
            genData: [{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            },{
              id: '',
              tollGateName: '王小虎',
              tollGateType:'11',
              passagewayNum:'11',
              provinceFee:'11',
              feedback:'11',
            }],
            checkList: ['',''],
            value: '',
            radio: '1',
            // 时间控件
            pickerupdateDateBefore:{
              disabledDate: (time) => {
                let beginDateVal = this.updateAfterTime;
                if (beginDateVal) {
                  return time.getTime() > beginDateVal;
                }
              }
            },
            pickerupdateDateAfter:{
              disabledDate: (time) => {
                let beginDateVal = this.updateBeforeTime;
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
          //  getSearchNames :function () {
          //   let names = [];
          //   let text = '';
          //   for (let i = 0, len = this.tollGateNames.length; i < len; i++) {
          //     text = this.tollGateNames[i].text;
          //     if (text) {
          //       names.push(text);
          //     }
          //   }
          //   return names;
          // },
          changePage:function () {

          },
          handleClick:function () {

          },
          handleSizeChange:function (val) {
            this.pagesize = val;
          },
          handleCurrentChange:function (val) {
            this.currentPage = val;
          },
          // 获取数据
          // getUsers() {
          //   let resource = this.$resource(this.url);
          //   resource.query(this.filter)
          //     .then((response) => {
          //       this.photoData = response.data.datas;
          //     })
          //     .catch((response)=> {
          //       this.$message.error('错了哦，这是一条错误消息');
          //     });
          // },
        },
    }
</script>

<style scoped>
.photoProject_rightDiv_search{
  font-family:  Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  padding:25px 0;
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
