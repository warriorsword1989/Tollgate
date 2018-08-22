<template>
  <div style="height:350px;overflow-y: auto" class="tableEditPanel sc-toll-edit" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" label-position="right" label-width="100px" :inline="false" class="wraper">
      <el-main>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="日期：" class="edit-container">
              <el-date-picker
                class="edit-content"
                v-model="dataModels.period"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="日期类型：" class="edit-container">
              <el-select v-model="dataModels.spec_flag" class="edit-content" placeholder="请选择">
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
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="" class="edit-container">
              <el-switch
                v-model="dataModels.fee_flag"
                active-value="2"
                inactive-value="1"
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
  import { updateTollGate, getTollGate, getMaxId} from '../../dataService/api';
  import {appUtil} from '../../Application';
  export default {
    name: 'scTollHoliday',
    props: [],
    data() {
      return {
        loading: false,
        dataModels: {
          id: 0,
          period: '',
          spec_flag: '3',
          fee_flag: '1'
        },
        dateTypes: [
          { label: '节假日', value: '3'},
          { label: '特殊日期', value: '4'}
        ]
      }
    },
    methods: {
      onSubmit(formName) {
        let _self = this;
        let params = { table: 'SC_TOLL_HOLIDAY', data: [this.dataModels], workFlag: appUtil.getGolbalData().workType };
        this.loading = true;
        getMaxId({ table: 'SC_TOLL_HOLIDAY', adminCode: appUtil.getGolbalData().adminCode})
        .then(result => {
          let {data,errorCode} = result;
          if (errorCode!=-1) {
            if (!data[0].maxnum) {
              params.data[0].id = parseInt(appUtil.getGolbalData().adminCode.substr(0,2)+'000000');
            } else {
              params.data[0].id = parseInt(data[0].maxnum)+1;
            }
          }
          return params;
        }).then(params => {
          params.adminCode = appUtil.getGolbalData().adminCode;
          updateTollGate(params)
          .then(result => {
            let {errorCode} = result;
            let messageStr = '数据更新成功！'
            if (result.message) {
              messageStr = result.message
            }
            const h = this.$createElement;
            if (errorCode === 0) {
              this.$emit('tabStatusChange', {
                status: false,
                tabIndex: 9
              });
              return this.$message({
                message: messageStr,
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
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
