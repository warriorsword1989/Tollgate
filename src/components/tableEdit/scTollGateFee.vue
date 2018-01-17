<template>
  <div class="tableEditPanel">
    <el-form :inline="true" class="wraper">
      <div class="grid-content">
        <div class="labelText">费用金额：</div>
        <div class="inputPart">
          <el-input v-model="tableData.out_fee" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">内埠车牌范围：</div>
        <div class="inputPart">
          <el-input v-model="tableData.local_plate" size="mini"></el-input>
        </div>
      </div>
      <div class="grid-content">
        <div class="labelText">收费类型：</div>
        <div class="inputPart">
          <el-select size="mini" v-model.number="tableData.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="padding:20px;text-align: right;" class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit">保 存</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>


<script>
  import {updateTollGate} from '../../dataService/api';
  export default {
    name: 'scTollGateFee',
    props: ['tableData'],
    data() {
      return {
        options: [{
          value: 1,
          label: '当前收费站有代收费'
        }, {
          value: 2,
          label: '当前收费站为固定收费站'
        }, {
          value: 3,
          label: '当前收费站为跨界收费站'
        }]
      }
    },
    methods: {
      onSubmit(){
        let params = {table: 'SC_TOLL_TOLLGATEFEE'};
        Object.assign(params, this.tableData);
        updateTollGate(params)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          if (errorCode === 0) {
            return this.$message({message: '数据更新成功！', type: 'success'});
          } else {
            return this.$message({message: '数据更新失败！', type: 'warning'});
          }
        })
        .finally(() => {
          console.log('finally');
        })
        .catch(err => {
          console.log(err);
        });
      }
    },
    mounted () {
      console.log(this.tableData)
    },
    destroyed() {
      this.$emit('childDestroyed');
    }
  }

</script>

<style scoped>
  .grid-content {
    display:flex;
    flex-direction: row;
    margin: 10px;
  }
  .grid-content .labelText {
    width: 110px;
    text-align: right;
  }
  .grid-content .inputPart {
    flex: 1
  }
</style>
