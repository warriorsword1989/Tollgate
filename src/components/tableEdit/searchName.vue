<template>
  <vue-draggable-resizable class="dragWindow" style="background:#fff;box-shadow:0 4px 20px #5c78a7;position:fixed;height:auto" :w="400" :h="300" :x="700"
    :y="300" :z="100001" :parent="false" :drag-handle="'.drag'" :resizable="false" :handles="['br']" :append-to-body="true">
    <div style="display:flex;flex-direction:row;" class="windowTitle">
      <div style="flex:1">
        <i class="el-icon-edit-outline drag"> 桥梁/隧道名称查询</i>
      </div>
      <div style="width=50px">
        <i @click="closeSearch" class="el-icon-close"></i>
      </div>
    </div>
    <div style="margin: 15px;">
      <el-input size="mini" placeholder="请输入内容" v-model="searchValue">
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
  export default {
    name: 'searchName',
    props: [],
    data() {
      return {
        searchValue: '',
        tableData: [],
        loading: false,
        currentRow: null
      }
    },
    methods: {
      search() {
          this.loading = true;
          let param = {
            table: 'RD_NAME',
            bridgeName: this.searchValue,
            workFlag: this.$store.state.workStatus
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
