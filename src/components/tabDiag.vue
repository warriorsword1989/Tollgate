<template>
  <vue-draggable-resizable
    class="dragWindow"
    style="background:#fff;box-shadow:0 4px 20px #5c78a7;display:flex;flex-direction:column;height:auto"
    :w="boxPros.boxWidth"
    :h="boxPros.boxHeight"
    :x="boxPros.leftDis"
    :y="boxPros.topDis"
    :z="boxPros.zIndex"
    :parent="true"
    :drag-handle="'.drag'"
    :resizable="true"
    :handles="['mr']"
    :append-to-body="true">

    <!-- title-->
    <div class="windowTitle">
      <div style="flex: 1"><i class="el-icon-edit-outline drag"> {{ boxTitle }}</i></div>
      <div><i @click="closeDialog" class="el-icon-close"></i></div>
    </div>

    <!-- element ui => el-collapse + table components-->
    <el-collapse :accordion="true" value="1" @change="toggleTable" style="flex:1">
      <el-collapse-item name="1">
        <!-- collapse title -->
        <template slot="title">
          <div class="titleSet">
            <i :class="listShowStatus.className"></i>
            <span style="user-select:none;">{{listShowStatus.text}}</span>
          </div>
        </template>
        <!-- collapse content -->
        <el-table v-loading="loading" element-loading-text="查询中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);" @selection-change="selectChange" ref="multipleTable" :data="tableData" :max-height="100" tooltip-effect="light">
          <el-table-column label="序号" type="index" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.field" :label="item.label" show-overflow-tooltip></el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <!-- element ui => tab component -->
    <el-tabs @tab-click="tabOnActive" :tab-position="tabPosition">
      <!-- tab页切换头 -->
      <el-tab-pane v-for="(pane, index) in filterPane(bussinessConfig.tableInfos)" :key="index" :label="pane.label"></el-tab-pane>
      <!-- 根据currentView动态切换组件 -->
      <component @tabStatusChange="changeTabStatus" :currentActive="activeIndex" :is="currentView"></component>
    </el-tabs>

  </vue-draggable-resizable>
</template>

<script>
  import Vue from 'vue';
  import config from '@/config/index';
  import { appUtil } from '@/Application';
  import tableContent from '@/components/tableEdit/index';
  import { getTollGate, getTollName } from '@/dataService/api';
  
  export default {
    name: 'tabDiag',
    data() {
      return {
        boxPros: {
          topDis:200,
          leftDis:300,
          boxWidth: 980,
          boxHeight: 530,
          zIndex: 10
        },
        componentObj: { ...tableContent },
        currentView: null,
        activeIndex: 0,
        oldActiveIndex: 0,
        loading: true,
        serachShow: false,
        tabPosition: 'left',
        isTableShow: true,
        multipleSelection: [],
        tableHeader: [
          { field: 'pid', label: '收费站ID' },
          { field: 'name', label: '收费站名称' },
          { field: 'type', label: '收费站类型' }
        ],
        tableData: [],
        workFlag: 'static',
        bussinessConfig: config.bussinessConfig
      }
    },
    
    computed: {
      // 弹出窗口的title
      boxTitle: function () {
        return `收费站信息编辑 ${this.bussinessConfig.workType[this.workFlag]}`;
      },
      // 切换显示和隐藏状态显示的文字和小箭头的样式
      listShowStatus: function () {
        if (this.isTableShow) {
          return { className: 'el-icon-caret-bottom',text: '隐藏收费站列表' };
        }
        return { className: 'el-icon-caret-top', text: '显示收费站列表' };
      }
    },

    methods: {
      _initTableLabel() {
        this.bussinessConfig.tableInfos.forEach((item, index) => {
          if (item.label[0] === '*') {
             this.oldActiveIndex = index;
             return item.label = item.label.substr(1);
          }
        });
      },
      /**
        * 显示可以显示的tab;
       */
      filterPane() {
        return this.bussinessConfig.tableInfos.filter(item => item.isShow);
      },
      /**
        * 关闭弹窗表格窗口，并将路由切换为mainMap
       */
      closeDialog() {
        this.$emit('dialogClose');
        // 因为切换tab后组件都会重新加载，所以再次清调之前在激活页面改动给label加的*符号
        this._initTableLabel();
      },

      /**
        * 表格列表收缩展开切换行为
       */
      toggleTable(param) {
        this.isTableShow = !this.isTableShow;
      },

      /**
        * 子路由页面发生更改，接收事件改变tab页label的显示;
       */
      changeTabStatus(eData){
        let currentPane = this.bussinessConfig.tableInfos[eData.tabIndex];
        if (eData.status) {
          currentPane.label = currentPane.label[0] !== '*' ? `*${currentPane.label}` : currentPane.label;
        } else {
          currentPane.label = currentPane.label[0] !== '*' ? currentPane.label : `${currentPane.label.substr(1)}`;
        }
      },

      /**
        * 切换tab页的时候并切换路由，显示对应的组件
       */
      tabOnActive(e){
        // 因为切换tab后组件都会重新加载，所以再次清调之前在激活页面改动给label加的*符号
        this._initTableLabel();
        // 动态显示组件;
        const activePanel = this.bussinessConfig.tableInfos.filter(item => item.label === e.label);
        // 销毁组建(对于两次同时加载同一个组件只能在第一个加载时执行的解决办法);
        if (this.currentView.name === 'innerTab') {
          this.currentView = null;
        }
        this.$nextTick(() => {
          this.currentView = this.componentObj[activePanel[0].comName];
          if (this.isGuangdong) {
            if (e.index == 2) {
              this.currentView = this.componentObj['scTollLoad'];
            }
            // if (e.index == 3) {
            //   this.currentView = this.componentObj['scTollOverLoad'];
            // }
          }
          this.activeIndex = parseInt(e.index);
        });
      },

      /**
        * 设置收费站列表初始的复选框为选中状态
       */
      toggleSelection(rows){
         rows.forEach(row => this.$refs.multipleTable.toggleRowSelection(row), this);
      },

      /**
        * 列表选择后重新更新选择的收费站的pids
       */
      selectChange (selection) {
        const pids = selection.map(item => item.pid);
        this.$store.commit('changeEditSelectedData', pids);
      },

      /**
        * 根据地图上选择的收费站pid查询收费站的概略信息，包括收费站的名称，pid，和收费类型
       */
      async transfromSelectedData(arr) {
        let result = null;
        try {
          const param = { table: 'RD_TOLLGATE_NAME', pid: arr };
          result = await getTollName(param);
        } catch (err) {
          throw new Error(err);
        }

        this.tableData = result.data.map(item => {
          if (this.$store.state.source === 1) {
            item.type = this.bussinessConfig.tollType[item.type];
          } else {
            item.type = this.bussinessConfig.infoSource[this.$store.state.source - 2];
          }
          return item;
        }, this);

        this.loading = false;

        // 表格复选框初始设置为选中状态;
        this.$nextTick(() => {
          this.toggleSelection(this.tableData);
        });
      }
    },

    mounted() {
      this.isGuangdong = appUtil.getGolbalData().adminCode == '440000';
      // 查询获得收费站名称;
      this.workFlag = appUtil.getGolbalData().workType;
      // 动态显示第一个组件;
      this.currentView = this.componentObj[Object.keys(this.componentObj)[0]];

      if (this.workFlag !== 'static') {
        this.bussinessConfig.tableInfos.forEach(item => {
          if (!item.isShow) {
            item.isShow = !item.isShow;
          }
        });
      }
      // 如果是情报作业则切换表头;
      if (this.$store.state.source !== 1) {
        this.tableHeader[2].label = '信息来源';
      }

      this.transfromSelectedData(this.$store.state.editSelectedData);
    },

    /**
      * 模板编译挂载之前，设置拖动组件的初始位置(有时候没有效果)
     */
    beforeMount() {
      const documentObj = document.documentElement;
      this.leftDis = (documentObj.clientWidth - this.boxPros.boxWidth) / 2;
      this.topDis = (documentObj.clientHeight - this.boxPros.boxHeight) / 2;
    }
  }
</script>

<style scoped>
  .windowTitle {
     background:#636ef5;
     height:40px;
     line-height:40px;
     color:#fff;
     padding:0 10px;
     font-size:16px;
     cursor: move;
     display: flex;
     flex-direction: row;
  }
  .windowTitle .el-icon-edit-outline {
     width:90%;
     line-height:40px;
  }
  .windowTitle .el-icon-close {
    width: 40px;
    line-height:40px;
    cursor:pointer;
    text-align: center;
    cursor: pointer;
  }
  .titleSet {
    color: rgb(99, 110, 245);
    text-align: center;
    background: rgb(233, 233, 239);
  }
</style>
