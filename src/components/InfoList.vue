<template>
  <div class="roadLeftPanel_container">
    <div class="roadLeftPanel">
      <div class="roadLeftPanel_line">
        情报信息
      </div>
    </div>
    <div>
      <ul class="list-group detailUlCss">
        <li>
          <div class="blockDescLiDiv">
            <span>情报主键</span>
          </div>
          <div style="width: 217px;display: inline-block;word-wrap: break-word">
            {{infoData.info_intel_id}}
          </div>
        </li>
        <li>
          <div class="blockDescLiDiv">
            <span>情报编码</span>
          </div>
          <span>{{infoData.info_code}}</span>
        </li>
        <li>
          <div class="blockDescLiDiv">
            <span>来源网址</span>
          </div>
          <div style="display: inline-block;width: 200px">
            <div style="word-wrap: break-word" v-for="item in infoData.url.split(';')">
              <a target="_blank" v-bind:href="item">{{item}}</a>
            </div>
          </div>
        </li>
        <li>
          <div class="blockDescLiDiv">
            <span>发布日期</span>
          </div>
          <span>{{infoData.news_time}}</span>
        </li>
        <li>
          <div class="blockDescLiDiv">
            <span>推送日期</span>
          </div>
          <span>{{infoData.public_time}}</span>
        </li>
        <li>
          <div class="blockDescLiDiv">
            <span>新闻内容</span>
          </div>
          <div style="display: inline-block">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              resize="none"
              v-model="infoData.info_content">
            </el-input>
          </div>
        </li>
        <li style="margin-top: 10px">
          <div class="blockDescLiDiv">
            <span>情报反馈</span>
          </div>
          <div style="display: inline-block">
            <el-select v-model="infoData.complete" placeholder="请选择" size="mini">
              <el-option
                v-for="item in complete"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </li>
        <li style="margin-top: 10px">
          <div class="blockDescLiDiv">
            <span>备注</span>
          </div>
          <div style="display: inline-block">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              placeholder="请输入备注内容"
              v-model="infoData.memo">
            </el-input>
          </div>
        </li>
      </ul>
    </div>
    <div style="float: right;padding-right: 20px;padding-top: 20px">
      <el-button type="primary" size="small" @click="saveInfo()">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {appUtil} from '../Application';
  import { getInfoList, updateToInfoDepartments, updateInfoList } from '../dataService/api';
  export default {
    name: "info-list",
    data() {
      return {
        infoData: {},
        complete: [
          {
            id: '1',
            label: '未处理'
          },
          {
            id: '2',
            label: '已处理'
          },
          {
            id: '3',
            label: '无法处理'
          }
        ]
      }
    },
    methods: {
      saveInfo: function () {
        const self = this;
        const param = {
          datas: JSON.stringify([{
            infoIntelId: this.infoData.info_intel_id,
            complete: this.infoData.complete,
            memo: this.infoData.memo
          }]),
        };
        const param1 = {
          infoIntelId: this.infoData.info_intel_id,
          complete: this.infoData.complete,
          memo: this.infoData.memo
        };
        updateToInfoDepartments(param).then(function (data) {
          if (data.errcode === 0) {
            const self1 = self;
            updateInfoList(param1).then(function (data1) {
              if (data1.errorCode === 0) {
                self1.$message({
                  message: '保存成功',
                  type: 'success'
                });
              } else {
                self1.$message.error('提交出错了！');
              }
            })
          } else {
            self.$message.error('提交出错了！');
          }
        })
      }
    },
    mounted() {
      const self = this;
      const param = {
        infoCode: appUtil.getGolbalData().infoCode
      };
      getInfoList(param).then(function (data) {
        if (data.errorCode === 0) {
          if (data.data.length === 1) {
            self.infoData = data.data[0];
          }
        }
      });
    }
  }
</script>

<style scoped>
  .roadLeftPanel_container {
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #93bbff;
    width: 300px;
    font-family: "Microsoft Yahei", Verdana, Arial, Helvetica, sans-serif;
    font-size: 12px;
    padding-top: 40px;
  }
  .roadLeftPanel {
    margin-top: -40px;
    height: 40px;
    background-color: #636ef5;
    color: #ffffff;
  }
  .roadLeftPanel_line {
    padding-left: 10px;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
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
