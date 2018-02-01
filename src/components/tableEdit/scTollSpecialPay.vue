<template>
  <div class="tableEditPanel sc-toll-edit" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(243, 239, 239, 0.5);">
    <el-form :model="dataModels" ref="dataModels" label-position="right" label-width="100px" :inline="false" class="wraper">
      <el-main>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="区域标识：" class="edit-container">
              <el-input v-model="dataModels.systemId" class="edit-content" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="表达区域要求的车牌范围：" title="表达区域要求的车牌范围" class="edit-container">
              <el-input v-model="dataModels.systemId" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="时间段：" title="时间段" class="edit-container">
              <el-date-picker
                v-model="dataModels.timeDomain"
                type="daterange"
                class="edit-content"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="特殊持卡：" title="特殊持卡" class="edit-container">
              <el-input v-model="dataModels.cardType" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客车车型：" title="客车车型" class="edit-container">
              <el-input v-model="dataModels.carClass" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货车车型：" title="货车车型" class="edit-container">
              <el-input v-model="dataModels.truckClass" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="正常装载类型：" title="正常装载类型" class="edit-container">
              <el-input v-model="dataModels.loadingClass" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="超载类型：" title="超载类型" class="edit-container">
              <el-input v-model="dataModels.overloadingClass" class="edit-content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打折：" title="打折" class="edit-container">
              <el-input v-model="dataModels.discount" class="edit-content">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="优惠上限：" title="优惠上限" class="edit-container">
              <el-input v-model="dataModels.preMax" class="edit-content">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠金额：" title="优惠金额" class="edit-container">
              <el-input v-model="dataModels.preFee" class="edit-content">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="12">
            <el-form-item label="" class="edit-container">
              <el-switch
                v-model="dataModels.fee"
                active-value=2
                inactive-value=1
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
          systemId: '',
          id: '',
          localPlate: '',
          timeDomain: '',
          cardType: '',
          carClass: '',
          truckClass: '',
          loadingClass: '',
          overloadingClass: '',
          discount: '',
          preMax: '',
          free: 1,
          preFee: ''
        }
      }
    },
    methods: {
      onSubmit(formName) {
       
      }
    },
    mounted() {
      
    }
  }
</script>

<style lang="less" scoped>
</style>
