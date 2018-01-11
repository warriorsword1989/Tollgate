<template>
  <div class="photoEdit">
    <el-form :inline="true" :model="dataModel" label-position="right" size="mini" label-width="80px" class="demo-form-inline">
      <el-form-item label="上传时间:">
        <el-input v-model="dataModel.uploadTime" placeholder="上传时间"></el-input>
      </el-form-item>
      <el-form-item label="来源ID:">
        <el-input v-model="dataModel.sourceId" placeholder="来源ID"></el-input>
      </el-form-item>
      <el-form-item label="照片内容:">
        <el-input v-model="dataModel.photoContent" placeholder="照片内容"></el-input>
      </el-form-item>
      <el-form-item label="版本号:">
        <el-input v-model="dataModel.version" placeholder="版本号"></el-input>
      </el-form-item>
      <el-form-item label="Tips反馈:">
        <el-select v-model="dataModel.feedback" placeholder="Tips反馈">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        </el-select>
      </el-form-item>
      <el-form-item class="inlineBlock" label="活动形式">
        <el-input type="textarea" :rows=2 class="remark" v-model="dataModel.desc"></el-input>
      </el-form-item>
      <el-form-item class="inlineBlock send">
        <el-button type="primary" @click.prevent="onSumbit">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'photoEdit',
    components: { },
    props: ['dataModel'],
    data() {
      return {
        options: [{
          value: 0,
          label: '未处理'
        }, {
          value: 1,
          label: '已处理'
        }, {
          value: 2,
          label: '无法处理'
        }]
      }
    },
    methods: {
      onSumbit(event) {
        this.$emit('showDiag');
      }
    }
  }
</script>

<style scoped>
  .photoEdit .el-form .el-textarea textarea {
    display: block;
  }
  .photoEdit .el-form .inputLenght {
    width: 180px;
  }
  .photoEdit .el-form--inline .inlineBlock {
    display: block;
  }
  .photoEdit .el-form--inline .el-form-item .remark {
    width: 400px;
  }
  .photoEdit .el-form--inline .el-form-item.send {
    float: right;
  }
</style>
