<template>
  <div class="tableEditPanel">
    <el-form :inline="true" class="wraper">
      <div style="text-align:center">
        <el-col :span="10">
          <div class="grid-content bg-purple text-left">
            <div style="display:inline-block" class="label">区域标识：</div>
            <div style="width:150px;display:inline-block">
              <el-input v-if="dataModels.length" v-model="dataModels[0].system_id" size="mini" disabled></el-input>
              <el-input v-if="!dataModels.length" size="mini" disabled></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple text-left">
            <div style="display:inline-block" class="label">行政区划名称：</div>
            <div style="width:120px;display:inline-block">
              <el-input v-if="dataModels.length" v-model="dataModels[0].admin_name" size="mini" disabled></el-input>
              <el-input v-if="!dataModels.length" size="mini" disabled></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple text-left">
            <el-button type="primary" class="btn-icon" icon="el-icon-plus" @click="addLimitItem"></el-button>
          </div>
        </el-col>
      </div>
      <fieldset v-for="(item, index) in dataModels">
        <legend>限重标准 {{index + 1}}</legend>
        <el-row :gutter="10">
          <el-col :span="10">
            <div style="display: flex;flex-direction: row" class="grid-content bg-purple edit-cell">
              <div style="display:inline-block" class="label">轴数限载标准：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="item.axle_num_limit" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple edit-cell">
              <div style="display:inline-block" class="label">型号限载标准：</div>
              <div style="width:120px;display:inline-block">
                <el-input v-model="item.model_limit" size="mini"></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple edit-cell">
              <el-button type="primary" class="btn-icon" icon="el-icon-minus" @click="removeLimitItem(index)"></el-button>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple edit-cell">
              <div style="display:inline-block" class="label">吨数限载标准：</div>
              <div style="width: 130px;display: inline-flex;">
                <el-input v-model="item.ton_limit" size="mini"></el-input>
                <span> 吨</span>
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
        dataModels: []
      }
    },
    methods: {
      addLimitItem () {
        let tollLimit = {
          system_id: 1,
          admin_name: '',
          axle_num_limit: 1,
          model_limit: '',
          ton_limit: ''
        };
        this.dataModels.push(tollLimit);
      },
      removeLimitItem (index) {
        console.log(index);
        this.dataModels.splice(index, 1);
      },
      onSubmit(){}
    },
    destroyed() {
      this.$emit('childDestroyed');
    }
  }

</script>

<style lang="less" scoped>
  .tableEditPanel {
    max-height: 350px;
    overflow-y:scroll;
    overflow-x:hidden;
    .text-left {
      text-align: left;
      padding: 3px;
    }
    .edit-cell {
      margin: 5px;
      text-align: left;
    }
    .btn-icon {
      padding: 5px;
    }
    .icon-option {
      font-size: 30px;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        color: #409EFF;
      }
    }
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
