<template>
  <vue-draggable-resizable class="dragWindow" style="background:#fff;box-shadow:0 4px 20px #5c78a7;position:fixed;height:auto" :w="400" :h="300" :x="leftDis"
    :y="topDis" :z="100001" :parent="false" :drag-handle="'.drag'" :resizable="false" :handles="['br']" :append-to-body="true">
    <div style="display:flex;flex-direction:row;" class="windowTitle">
      <div style="flex:1">
        <i class="el-icon-edit-outline drag"> 桥梁/隧道名称查询</i>
      </div>
      <div style="width=50px">
        <i @click="closeSearch" class="el-icon-close"></i>
      </div>
    </div>
    <div style="margin: 15px;">
      <el-input size="mini" :placeholder="placeHolder" v-model="searchValue" class="input-with-select">
        <el-select style="width: 70px" v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="桥梁" value="1"></el-option>
          <el-option label="隧道" value="2"></el-option>
        </el-select>
        <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);" ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%;overflow-y:scroll;height:200px">
      <el-table-column type="index" width="80">
      </el-table-column>
      <el-table-column property="name" label="名称" width="170">
      </el-table-column>
      <el-table-column property="name_groupid" label="组号">
      </el-table-column>
    </el-table>
  </vue-draggable-resizable>
</template>

<script>
  import {getBriageName} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'searchName',
    props: [],
    data() {
      return {
        leftDis:200,
        topDis: 300,
        searchValue: '',
        tableData: [],
        loading: false,
        currentRow: null,
        select: '1'
      }
    },
    computed: {
      placeHolder: function() {
        return this.select === '1' ? '精确查询' : '模糊查询';
      }
    },
    methods: {
      search() {
          this.loading = true;
          let param = {
            table: 'RD_NAME',
            bridgeName: this.searchValue,
            workFlag: appUtil.getGolbalData().workType,
            adminCode: appUtil.getGolbalData().adminCode,
            type: this.select
          };
          getBriageName(param)
          .then(result=> {
              let {data,errorCode} = result;
              if (errorCode!=-1) {
                  this.tableData = data;
              }
          })
          .finally(() => {
            this.loading = false;
          })
          .catch(err => {
              console.log(err)
          })
      },
      handleCurrentChange(val){
        this.currentRow = val;
        this.$store.commit('changeBtData',val);
        this.$emit('selectBtName');
      },
      closeSearch() {
        this.$emit('toggleSearch', false)
      }
    },
    beforeMount() {
      let viewWidth = document.documentElement.clientWidth;
      let viewHeight = document.documentElement.clientHeight;
      this.leftDis = (viewWidth - 400) /2;
      this.topDis = (viewHeight - 300) /2;
    }
  }

</script>

<style scoped>
  .windowTitle {
    background: #636ef5;
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding: 0 10px;
    font-size: 16px;
    cursor: move;
    display: flex;
    flex-direction: row;
  }

  .windowTitle .el-icon-edit-outline {
    width: 90%;
    line-height: 40px;
  }

  .windowTitle .el-icon-close {
    width: 40px;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    cursor: pointer;
  }
</style>
