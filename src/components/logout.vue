<template>
  <div class="logout">
    <el-dropdown :split-button="false">
      <el-button style="width:40px;height:40px;border-radius:90px;padding:0" type="primary">
        <i class="el-icon-more-outline"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { appUtil } from '../Application';
  import { login } from '../dataService/api';
  export default {
    name: "logout",
    data() {
      return {}
    },
    methods: {
      logout: function () {
        this.$router.push({name:'Login'});
        appUtil.removeTollgateToken();
        appUtil.removeRenderToken();
      }
    }
  }
</script>

<style scoped>
    .logout {
      position: absolute;
      top: 10px;
      right: 30px;
      z-index: 1000;
    }
</style>
