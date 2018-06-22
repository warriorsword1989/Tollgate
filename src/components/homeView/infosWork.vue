<template>
    <div class="photoWork">
        <!--<div class="photoProject_rightDiv_search">
            <div class="photoProject_rightDiv_choose">
                <span>行政区划：</span>
                <el-select v-model="" placeholder="请选择">
                    <el-option v-for="item in tip.cityList" :key="item.adminCode" :label="item.cityName" :value="item.adminCode"></el-option>
                </el-select>
            </div>

            <div class="photoProject_rightDiv_choose">
                <span>版本号：</span>
                <div style="display: inline-block">
                    <el-input v-model="" placeholder="请输入内容"></el-input>
                </div>
            </div>

            <div class="photoProject_rightDiv_choose">
                <span>更新时间：</span>
                <el-date-picker v-model="" type="date" placeholder="选择日期" :picker-options="" value-format="yyyy-MM-dd"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="" type="date" placeholder="选择日期" :picker-options="" value-format="yyyy-MM-dd"></el-date-picker>
            </div>

            <div class="photoProject_rightDiv_choose">
                <span>收费站名称：</span>
                <div style="display: inline-block" >
                    <el-input v-model="" placeholder="请输入内容"></el-input>
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
            <check-box :data-list="statusArr"></check-box>
            <div>
                <div style="float: right;margin-right: 100px" @click="getTollGateTipList()">
                    <el-button>查询</el-button>
                </div>
            </div>
        </div>-->
        2222222222222
    </div>
</template>

<script>
//   import Vue from 'vue';
//   import config from '@/config/index';
//   import { appUtil } from '@/Application';
//   import tableContent from '@/components/tableEdit/index';
//   import { getTollGate, getTollName } from '@/dataService/api';
  import checkBox from '@/components/widget/checkBox';
  const handleStatus = [
      { label: '未处理', value: 1 },
      { label: '已处理', value: 2 },
      { label: '无法处理', value: 3 }
  ];
  export default {
    name: 'photoWork',
    components: { checkBox },
    data() {
      return {
        statusArr: handleStatus
      }
    },
    
    computed: {
    },

    methods: {

    },

    mounted() {
      
    }
  }
</script>

<style scoped>
</style>
