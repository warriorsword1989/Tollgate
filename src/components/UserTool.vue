<template>
  <div class="userToolContainer">
    <div>
      <!-- <div class="innerImg"></div> -->
    </div>
    <ul class="list-group fm-dropdown-menu">
      <li v-show="showTips" @click="backToTips()">{{this.dataSource === 1 ? '返回tips列表': '返回情报列表'}}</li>
      <li><a @click="logout" href="#/login">退出</a></li>
    </ul>
  </div>
</template>

<script>
    import { appUtil } from '../Application';
    export default {
        name: "user-tool",
        data() {
          return {
            dataSource: 1,
            showTips: true
          }
        },
        methods: {
          backToTips: function () {
            const data = this.$route.params.data;
            const type = this.$route.params.type;
            this.$router.push({name:'Home', params:{data: data, type: type}});
          },
          logout: function () {
            this.$router.push('/login');
            appUtil.removeTollgateToken();
          }
        },
        mounted () {
          this.dataSource = appUtil.getGolbalData().dataSource || this.dataSource;
          if (this.$route.path == '/Home') {
            this.showTips = false;
          }
        }
    }
</script>

<style scoped>
  .userToolContainer {
    position: absolute;
    top: 10px;
    right: 50px;
    text-align: center;
    padding-bottom: 10px;
    z-index: 10;
  }
  .userToolContainer > div {
    box-shadow: 0 0 10px #93bbff;
    /*border-radius: 15px;*/
    height: 30px;
    width: 30px;
    background: url("../assets/toolIcon/icon/menu_normal.png") no-repeat center center;
  }
  .userToolContainer:hover > div{
    background: url("../assets/toolIcon/icon/menu_active.png") no-repeat center center;
  }
  .userToolContainer > div > .innerImg{
    width: 10px;
    height: 10px;
    margin-left: 20px;
    background: url("../assets/toolIcon/icon/menu_icon_notice.png") no-repeat center center;
  }
  .userToolContainer > div + ul {
    padding: 0;
    display: none;
  }
  .userToolContainer:hover > div + ul {
    padding: 0;
    width: 80px;
    position: absolute;
    display: block;
    margin-left: -25px;
  }
  ul.fm-dropdown-menu {
    border-radius: 3px;
    margin-top: 10px;
    cursor: pointer;
    margin-bottom: 8px;
    background-color: #ffffff;
    display: block;
    box-shadow: 0 2px 6px 0 #93bbff;
  }

  ul.fm-dropdown-menu>li {
    border: 1px solid #fff;
    list-style: none;
    background-color: #fff;
    font-size: 12px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: #182848;
  }

  ul.fm-dropdown-menu>li:hover {
    background-color: rgba(88, 150, 255, 0.1);
    border: 1px solid #5896ff;
  }

  ul.fm-dropdown-menu>li>a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: #182848;
  }

  ul.fm-dropdown-menu>li.disabled {
    color: rgba(24, 40, 72, 0.5);
    cursor: not-allowed;
  }
</style>
