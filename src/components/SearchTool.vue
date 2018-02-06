<template>
  <div class="searchPanel">
    <div class="inputWrapper">
      <input class="searchInput" placeholder="请输入道路名称，道路PID" v-if="type === 0" @keyup="searchData($event, 0)" v-model="searchText">
      <input class="searchInput" placeholder="请输入收费站名称，收费站PID" v-if="type === 1" @keyup="searchData($event, 1)" v-model="searchText">
      <div style="display: inline-block;" class="searchType">
        <button class="inputButton searchIcon" @click="showAction($event)"><span class="el-icon-search"></span></button>
        <!--<ul class="typeList">-->
          <!--<li @click="selectSearchType(0)">-->
            <!--<span>道路</span>-->
          <!--</li>-->
          <!--<li @click="selectSearchType(1)">-->
            <!--<span>收费站</span>-->
          <!--</li>-->
        <!--</ul>-->
      </div>
      <span class="inputButton senior" style="cursor: pointer">{{type === 0 ? '道路' : '收费站'}}</span>
    </div>
    <div class="advancePanel" v-if="advancePanelFlag">
      <div style="text-align: center; padding: 10px;" v-if="searchLoading">正在加载....</div>
      <div style="text-align: center; padding: 10px;" v-if="!tollData.length && !searchLoading">没有搜到结果</div>
      <table v-if="tollData.length" class="fm-scroll" style="width: 100%;">
        <thead>
        <tr>
          <td class="trPid">pid</td>
          <td class="trName">名称</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tollData" @click="showInMap(item)">
          <td class="trPid"><a href="javascript:void(0);">{{item.pid}}</a></td>
          <td class="trName">{{item.name}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
    import { getSearchData } from '../dataService/api';
    export default {
        name: "search-tool",
        data() {
          const symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
          return {
            feedbackCtrl: fastmap.mapApi.FeedbackController.getInstance(),
            feedback: new fastmap.mapApi.Feedback(),
            pointSymbol: symbolFactory.getSymbol('pt_relation_border'),
            searchText: '',
            type: 1,
            advancePanelFlag: false,
            searchInputStatus: true,
            tollData: [],
            searchLoading: false
          }
        },
        methods: {
          toggleAdvancePanel: function () {
            this.advancePanelFlag = true;
          },
          showAction: function (event) {
            this.searchText = '';
            this.searchInputStatus = !this.searchInputStatus;
            const obj = event.currentTarget;
            const container = $(obj).closest('.inputWrapper');
            if (!this.searchInputStatus) {
              container.addClass('active');
              event.preventDefault();
            } else if (this.searchInputStatus) {
              container.removeClass('active');
              container.find('.searchInput').val('');
              if (this.advancePanelFlag) {
                this.advancePanelFlag = !this.advancePanelFlag;
              }
            }
          },
          selectSearchType: function (type) {
            if (this.type !== type) {
              this.type = type;
              this.searchText = '';
            }
          },
          searchData: function (event, type) {
            const self = this;
            if (event.keyCode === 13) {
              this.clearFeedBack();
              this.toggleAdvancePanel();
              this.searchLoading = true;
              const param = {
                type: type,
                searchText: this.searchText
              };
              if (isNaN(this.searchText)) {
                param.isId = 0;
              } else {
                param.isId = 1;
              }
              getSearchData(param).then(function (data) {
                if (data.errorCode === 0) {
                  self.tollData = data.data;
                  self.searchLoading = false;
                }
              });
            }
          },
          clearFeedBack: function () {
            this.feedback.clear();
            this.feedbackCtrl.refresh();
          },
          showInMap: function (data) {
            let geometryAlgorithm = new fastmap.mapApi.geometry.GeometryAlgorithm();
            let point = geometryAlgorithm.wktToGeojson(data.geometry);
            const map = window.map;
            map.getLeafletMap().setView([point.coordinates[1], point.coordinates[0]], 17);
            this.feedback.clear();
            this.feedback.add(point, this.pointSymbol);
            this.feedbackCtrl.refresh();
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
  .searchPanel .inputWrapper {
    position: absolute;
    right: 0px;
    width: 30px;
    height: 30px;
    background-color: transparent;
    transition: all .6s cubic-bezier(.42, 0, .58, 1);
  }
  .searchPanel .inputWrapper.active {
    opacity: 1;
    right: 2px;
    background: #fff;
    width: 250px;
    box-shadow: 0 0 10px #93bbff;
  }
  .searchPanel .inputWrapper .searchInput{
    border: none;
    width: 0;
    font-size: 12px;
    height: 27px;
    position: relative;
    border: none;
    background: transparent;
    transition: all 0.3s ease 0.3s;
  }
  .searchPanel .inputWrapper.active .searchInput{
    width: 164px;
    left: 55px;
    border-bottom: 1px solid #44A9FF;
  }
  .searchPanel .inputWrapper .searchIcon {
    position: absolute;
    top: 0;
    right: 3px;
    height: 30px;
    width: 30px;
    color: #44A9FF;
    border: none;
    font-size: 16px;
    background: #fff;
    border-radius: 15px;
    font-weight: normal;
    box-shadow: 0 0 10px #93bbff;
    transition: all .3s cubic-bezier(0.000, 0.105, 0.035, 1.570);
    transition-delay: 0.3s;
  }
  .searchPanel .inputWrapper.active .searchIcon {
    background: transparent;
    box-shadow: none;
  }
  .searchPanel .inputWrapper .searchType ul.typeList {
    margin: 0;
    list-style: none;
    padding: 0;
    position: absolute;
    top: 30px;
    right: -1px;
    background: #fff;
    border-radius: 3px;
    cursor: pointer;
    box-shadow: 0 2px 6px 0 #93bbff;
    width: 60px;
    text-align: center;
    display: none;
  }
  .searchPanel .inputWrapper.active .searchType:hover ul.typeList {
    display: block;
  }
  .searchPanel .inputWrapper .searchType ul.typeList li {
    height: 24px;
    line-height: 24px;
    border: 1px solid transparent;
  }
  .searchPanel .inputWrapper .searchType ul.typeList li:hover {
    border: 1px solid #5896ff;
    background-color: rgba(88, 150, 255, 0.1);
  }
  .searchPanel .senior {
    width: 45px;
    height: 22px;
    top: 4px;
    color: white;
    line-height: 22px;
    text-align: center;
    border-radius: 4px;
    display: none;
    background-color: transparent;
    position: absolute;
    margin-left: 5px;
  }
  .searchPanel .inputWrapper.active .senior{
    display: block;
    background-color: #44A9FF;
    transition: all 0.3s ease 0.6s;
  }
  .searchPanel .advancePanel{
    text-align: left;
    cursor: pointer;
    border-bottom: solid 1px #d2e1ff;
    border-left: solid 1px #d2e1ff;
    border-right: solid 1px #d2e1ff;
    background-color: white;
    height: 300px;
    width: 100%;
    top: 35px;
    right: 2px;
    position: relative;
    overflow-y: auto;
    z-index: 1;
  }
  .searchPanel .advancePanel table {
    width: 100%;
    font-weight: bold;
    padding-right: 10px;
  }
  .searchPanel .advancePanel table td{
    padding-top: 6px;
    padding-left: 10px;
    color: #000000 !important;
  }
  .searchPanel .advancePanel table .trPid{
    width: 30%;
  }
  .searchPanel .advancePanel table .trName{
    width: 70%;
  }
  .searchPanel .advancePanel table a{
    color: #000000 !important;
    text-decoration: none;
  }
  .searchPanel .advancePanel table a:hover{
    text-decoration: underline;
  }
</style>
