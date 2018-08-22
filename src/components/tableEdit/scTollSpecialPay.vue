<template>
  <div style="height:350px;overflow-y: auto" class="tableEditPanel sc-toll-edit" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" label-position="right" label-width="100px" :inline="false" class="wraper">
      <el-main>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="区域标识：" class="edit-container">
              <el-input v-model="dataModels.system_id" class="edit-content" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表达区域要求的车牌范围：" title="表达区域要求的车牌范围" class="edit-container">
              <el-input v-model="dataModels.local_plate" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="时间段：" title="时间段" class="edit-container">
              <el-date-picker
                v-model="dataModels.timeDomainFmt"
                value-format="yyyyMMdd"
                type="daterange"
                class="edit-content"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="特殊持卡：" title="特殊持卡" class="edit-container">
              <el-input v-model="dataModels.card_type" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="card_class" label="客车车型：" title="客车车型" class="edit-container">
              <el-input v-model="dataModels.card_class" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="truck_class" label="货车车型：" title="货车车型" class="edit-container">
              <el-input v-model="dataModels.truck_class" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="8">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="loading_class" label="正常装载类型：" title="正常装载类型" class="edit-container">
              <el-input v-model="dataModels.loading_class" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="overloading_clss" label="超载类型：" title="超载类型" class="edit-container">
              <el-input v-model="dataModels.overloading_clss" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="discount" label="打折：" title="打折" class="edit-container">
              <el-input v-model="dataModels.discount" class="edit-content">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="pre_max" label="优惠上限：" title="优惠上限" class="edit-container">
              <el-input v-model="dataModels.pre_max" class="edit-content">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="[{ validator: validateNum, trigger: 'change' }]" prop="pre_fee" label="优惠金额：" title="优惠金额" class="edit-container">
              <el-input v-model="dataModels.pre_fee" class="edit-content">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin:15px 0" type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="" class="edit-container">
              <el-switch
                v-model="dataModels.free"
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
    name: 'scSpecialPay',
    props: [],
    data() {
      return {
        loading: false,
        dataModels: {
          system_id: appUtil.getGolbalData().adminCode,
          id: null,
          local_plate: null,
          timeDomainFmt: '',
          time_domain: null,
          card_type: null,
          card_class: null,
          truck_class: null,
          loading_class: null,
          overloading_clss: null,
          discount: null,
          pre_max: null,
          free: '1',
          pre_fee: null
        }
      }
    },
    methods: {
      // 如果存在的换验证数字是否为>=0的数字；
      validateNum (rule, value, callback) {
        if (value && !/^[0-9]+(\.[0-9]{1,})?$/.test(value)) {
          callback(new Error('输入必须是数字')); 
        } else {
          callback();
        }
      },
      onSubmit(formName) {
        let _self = this;
        if (this.dataModels.timeDomainFmt) {
          this.dataModels.time_domain = this.dataModels.timeDomainFmt.join('-');
        }
        delete this.dataModels.timeDomainFmt;
        let params = { table: 'SC_TOLL_SPEFLOAT', data: [this.dataModels], workFlag: appUtil.getGolbalData().workType };
        this.loading = true;
        getMaxId({ table: 'SC_TOLL_SPEFLOAT', adminCode: appUtil.getGolbalData().adminCode})
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
                tabIndex: 10
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
    },
    mounted() {}
  }
</script>

<style lang="less" scoped>
</style>
