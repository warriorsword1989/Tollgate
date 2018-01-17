<template>
  <div class="tableEditPanel">
    <el-form :inline="true" class="wraper">
      <div style="text-align:center">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div style="display:inline-block" class="label">区间闭合标识：</div>
            <div style="width:150px;display:inline-block">
              <el-select size="mini" v-model.number="dataModel.TunnageFlag" placeholder="请选择">
                <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <legend>一类区间</legend>
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex;flex-direction: row" class="grid-content bg-purple">
              <div style="display:inline-block" class="label">转载区间吨数范围：</div>
              <div style="display:flex;flex-direction: row;text-align: center">
                <div style="width: 20px">{{'>'}}</div>
                <div style="width: 90px">
                  <el-input v-model="dataModel.TunnageMin" size="mini"></el-input>
                </div>
                <div style="width: 20px">{{'<='}}</div>
                <div style="max-width: 90px"><el-input v-model="dataModel.TunnageMax" size="mini"></el-input></div>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">装载费率上限：</div>
              <div style="width:100px;display:inline-block">
                <el-input v-model="dataModel.rateMax" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">装载费率下限：</div>
              <div style="width:110px;display:inline-block">
                <el-input v-model="dataModel.rateMin" size="mini"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">基本费率:</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.rateBase" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">基本费率车道数:</div>
              <div style="width:100px;display:inline-block">
                <el-input v-model="dataModel.laneNum" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率1:</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.rateBase1" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">费率1车道数：</div>
              <div style="width:120px;display:inline-block">
                <el-select size="mini" v-model="dataModel.laneNum1" placeholder="费率车道数">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">最低计重(吨)：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.weightMin" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <div style="display:inline-block" class="label">最低收费(元)：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="dataModel.chargeMin" size="mini"></el-input>
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
    name: 'scTollLoad',
    props: [],
    data() {
      return {
        dataModel: {
          TunnageFlag: 1,
          nameBtId: 1,
          nameBt: '无名 ',
          TunnageMin: 1,
          TunnageMax:10,
          rateMax: 10,
          rateMin: 1,
          rateBase: 1,
          laneNum:1,
          rateBase1: 4,
          laneNum1: 1,
          weightMin: 2,
          chargeMin: 3,
        },
        options: [{
          value: 0,
          label: '空 '
        }, {
          value: 1,
          label: '4 '
        }, {
          value: 2,
          label: '6 '
        }],
        flagOptions: [{
          value: 1,
          label: '前开后闭 '
        }, {
          value: 2,
          label: '前闭后开 '
        }, {
          value: 3,
          label: '前闭后闭 '
        }]
      }
    },
    methods: {
      onSubmit(){}
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
