<template>
  <!--桥梁/隧道名称查询页面-->
  <div style="background-color: #ffffff;height: 100%;width: 100%">
    <div style="height: 114px">
      <div style="padding-left: 20px;padding-bottom: 20px;padding-top:25px;font-size: 16px">
        <div>桥梁/隧道名称查询</div>
      </div>
      <div class="tableTopTitle">
        <span>输入名称：</span>
        <div style="display: inline-block">
          <el-input v-model="inputName" size="mini"></el-input>
        </div>
        <el-button @click="checkItem()" size="mini">查询</el-button>
      </div>
    </div>
    <div class="scroll_style" style="background-color: #ffffff;padding-left: 25px;height:calc(100% - 214px);">
      <el-table :data="checkData" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="180" type="index" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
        <el-table-column prop="group" label="组名" align="center"></el-table-column>
        <el-table-column prop="deal" label="处理" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="checked"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding-left:80%;padding-top:25px;background-color:#FFFFFF;height: 75px">
      <el-button @click="submit()">确定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RdlinkCheck",
    data(){
      return {
        inputName:'',
        dealRadio:1,
        checkData: [{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        },{
          id: '',
          name: '王小虎',
          group:'11',
        }],
      }
    },
    methods:{
      checkItem:function () {
      },
      submit:function () {

      }
    }
  }
</script>

<style scoped>
  .tableTopTitle {
    display: inline-block;
    padding-left: 20px;
    padding-bottom: 20px;
  }
  .tableTopTitle > span{
    display: inline-block;
    font-size: 14px;
    color: #000000;
    padding-right: 5px;
  }
</style>
