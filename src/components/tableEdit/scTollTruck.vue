<template>
  <div class="tableEditPanel">
    <el-form :inline="true" class="wraper">
      <div style="text-align:center">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div style="display:inline-block" class="label">区间闭合标识：</div>
            <div style="width:150px;display:inline-block">
              <el-select size="mini" v-model="dataModel.tunnageFlag" placeholder="请选择">
                <el-option
                  v-for="item in flagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div style="display:inline-block" class="label">桥梁隧道名称组号：</div>
            <div style="width:120px;display:inline-block">
              <el-input v-model="dataModel.nameBtId" size="mini"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div style="display:inline-block" class="label">桥梁隧道名称：</div>
            <div style="width:150px;display:inline-block">
              <el-input v-model="dataModel.nameBt" size="mini"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button type="primary" icon="el-icon-plus"></el-button>
          </div>
        </el-col>
      </div>
      <fieldset style="min-height:200px">
        <legend>一型车</legend>
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex;flex-direction: row" class="grid-content bg-purple">
              <div style="display:inline-block" class="label">各车型吨数区间：</div>
              <div style="display:flex;flex-direction: row;text-align: center">
                <div style="width: 20px">{{'>'}}</div>
                <div style="width: 100px"><el-input v-model="dataModel.tunnageMin" size="mini"></el-input></div>
                <div style="width: 20px">{{'<='}}</div>
                <div style="max-width: 100px"><el-input v-model="dataModel.tunnageMax" size="mini"></el-input></div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率(元/公里)非桥隧道：</div>
              <div style="width:100px;display:inline-block">
                <el-input v-model="dataModel.rate" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率车道数：</div>
              <div style="width:110px;display:inline-block">
                <el-select size="mini" v-model="dataModel.laneNum" placeholder="费率车道数">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">集装箱尺寸数：</div>
              <div style="width:150px;display:inline-block">
                <el-input v-model="dataModel.container" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">轴数：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.axleNum" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">轮数：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.wheelNum" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">型号：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.model" size="mini"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">桥隧道费率（元/车次）：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.rateBt" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">车次加费（元）：</div>
              <div style="width:120px;display:inline-block">
                <el-select size="mini" v-model="dataModel.feeAdd" placeholder="费率车道数">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">最低收费（元）：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.chargeMin" size="mini"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率1（元/公里）：</div>
              <div style="width:150px;display:inline-block">
                <el-input v-model="dataModel.rate1" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率1车道数：</div>
              <div style="width:150px;display:inline-block">
                <el-select size="mini" v-model="dataModel.laneNum1" placeholder="费率1车道数">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">固定收费站对应次费：</div>
              <div style="width:150px;display:inline-block">
                <el-input v-model="dataModel.fixFee" size="mini"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
      </fieldset>
      <div style="padding:20px;text-align: right;" class="footerPart">
        <el-row :gutter="5">
          <el-button type="primary" @click="onSubmit">保 存</el-button>
        </el-row>
      </div>
    </el-form>
  </div>
</template>



<script>
  export default {
    name: 'scTollTruck',
    props: [],
    data() {
      return {
        dataModel: {
          tunnageFlag: 1,
          nameBtId: 1,
          nameBt: '无名',
          rate: 1,
          tunnageMin: 10,
          tunnageMax: 1,
          laneNum: 2,
          container: 5,
          axleNum: 1,
          wheelNum: 2,
          model: 2,
          rateBt: 4,
          feeAdd: 2,
          chargeMin: 3,
          rate1: 4,
          laneNum1: 1,
          fixFee: 3
        },
        options: [{
          value: 0,
          label: '空'
        }, {
          value: 1,
          label: '4'
        }, {
          value: 2,
          label: '6'
        }],
        flagOptions: [{
          value: 0,
          label: '前开后闭'
        }, {
          value: 1,
          label: '前闭后开'
        }, {
          value: 2,
          label: '前闭后闭'
        }]
      }
    },
    methods: {
      onSubmit(){}
    },
    destroyed() {
      this.$emit('childDestroyed');
    }
  }

</script>

<style scoped>
  .tableEditPanel {
    max-height: 350px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }

  fieldset {
    border: 2px dotted #409EFF
  }

  fieldset legend {
    font-style: oblique;
    font-size: 16px;
    font-weight: bold;
  }

</style>
