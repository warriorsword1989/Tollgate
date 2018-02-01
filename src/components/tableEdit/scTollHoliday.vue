<template>
  <div class="tableEditPanel sc-toll-edit" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" label-position="right" label-width="100px" :inline="false" class="wraper">
      <el-main>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="日期：" class="edit-container">
              <el-date-picker
                class="edit-content"
                v-model="dataModels.date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="日期类型：" class="edit-container">
              <el-select v-model="dataModels.specFlag" class="edit-content" placeholder="请选择">
                <el-option
                  v-for="item in dateTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="" class="edit-container">
              <el-switch
                v-model.number="dataModels.feeFlag"
                active-value.number="2"
                inactive-value.number="1"
                active-text="收费"
                inactive-text="不收费">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="edit-footer">
        <el-row :gutter="5">
          <el-button type="primary" class="btn-submit" @click="onSubmit('dataModels')">保 存</el-button>
        </el-row>
      </el-footer>
    </el-form>
  </div>
</template>

<script>
  import { updateTollGate, getTollGate} from '../../dataService/api';
  export default {
    name: 'scTollHoliday',
    props: [],
    data() {
      return {
        loading: false,
        dataModels: {
          date: '',
          specFlag: '1',
          feeFlag: ''
        },
        dateTypes: [
          { label: '节假日', value: '1'},
          { label: '特殊日期', value: '2'}
        ]
      }
    },
    methods: {
      switchFeeFlag () {
        console.log(this.dataModels.feeFlag);
      },
      onSubmit(formName) {
        let _self = this;
        let params = { table: 'SC_TOLL_HOLIDAY', data: [this.dataModels], workFlag: this.$store.state.workStatus };
        this.loading = true;
        updateTollGate(params)
        .then(result => {
          let {errorCode} = result;
          const h = this.$createElement;
          if (errorCode === 0) {
            this.$emit('tabStatusChange', {
              status: false,
              tabIndex: 0
            });
            return this.$message({
              message: '数据更新成功！',
              type: 'success'
            });
          } else {
            return this.$message({
              message: '数据更新失败！',
              type: 'warning'
            });
          }
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
