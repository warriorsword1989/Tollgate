<template>
  <div v-bind:style="bgDivStyle">
    <video class="bgVideo" poster="../assets/login/firstframes.png">
    </video>
    <div class="loginDiv" v-bind:style="loginDiv">
      <div class="login-title-bg" v-bind:style="titleBgStyle">
        <img class="userIcon" v-bind:style="userIcon" src="../assets/login/login_usericon.png">
      </div>
      <div class="login-container-bg" v-bind:style="containerBgStyle">
        <div class="loginTitle" v-bind:style="loginTitle">
          <span>收费站信息处理平台</span>
        </div>
        <div class="inputDiv" v-bind:style="inputDiv">
          <img class="inputIcon" v-bind:style="inputIcon" src="../assets/login/icon_user.png">
          <input class="inputText" v-bind:style="inputText" type="text" name="user" v-model="userName"
                 placeholder="请输入用户名"/>
        </div>
        <div class="inputDiv" v-bind:style="inputDiv">
          <img class="inputIcon" v-bind:style="inputIcon" src="../assets/login/icon_secret.png">
          <input class="inputText" v-bind:style="inputText" type="password" v-model="password" name="userpassword"
                 maxlength="32"
                 placeholder="请输入密码"/>
        </div>
        <div class="loginFail" v-bind:style="loginFail"
             v-bind:class="errorFlag ? 'loginFailVisible': 'loginFailHidden'">
          <img class="failImg" v-bind:style="failImg" style="object-fit: fill;vertical-align: middle;"
               src="../assets/login/icon_login_fail.png"/>：登录失败啦！用户名或密码错误！
        </div>
        <button class="submitButton" v-on:click="handleEvent()" id="loginButton"
                v-bind:style="submitButton">
          <div class="login-load-image" v-show="showLoadImg" v-bind:style="loginLoadStyle"></div>
          <span class="loading" v-show="!showLoadImg">登&nbsp&nbsp录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '../dataService/api';
  import { appUtil } from '../Application';
  export default {
    name: "login",
    data() {
      const standardWidth = 1920;
      const width = document.documentElement.clientWidth;
      let widthPercent = 1;
      if (width < 1920) {
        widthPercent = width / standardWidth;
      }
      return {
        bgDivStyle: {
          height: 970 * widthPercent + 'px',
          width: 1920 * widthPercent + 'px',
          position: 'fixed'
        },
        loginDiv: {
          height: 500 * widthPercent + 'px',
          width: 480 * widthPercent + 'px',
          'margin-top': -294 * widthPercent + 'px',
          'margin-left': -240 * widthPercent + 'px'
        },
        titleBgStyle: {
          height: 70 * widthPercent + 'px',
          width: 140 * widthPercent + 'px',
          'border-radius': 140 * widthPercent + 'px ' + 140 * widthPercent + 'px 0 0'
        },
        containerBgStyle: {
          height: 350 * widthPercent + 'px',
          width: 480 * widthPercent + 'px',
          'padding-top': 40 * widthPercent + 'px'
        },
        loginTitle: {
          'font-size': 18 * widthPercent + 'px',
          'margin-top': 40 * widthPercent + 'px'
        },
        userIcon: {
          height: 120 * widthPercent + 'px', // 此处高度缩放乘以宽度的比例是为了保持图片的宽高一致
          width: 120 * widthPercent + 'px',
          'margin-top': 10 * widthPercent + 'px'
        },
        loginForm: {
          'padding-left': 35 * widthPercent + 'px',
          'padding-right': 30 * widthPercent + 'px'
        },
        inputDiv: {
          'padding-top': 30 * widthPercent + 'px'
        },
        inputIcon: {
          width: 20 * widthPercent + 'px',
          height: 20 * widthPercent + 'px',
          left: 35 * widthPercent + 'px'
        },
        inputText: {
          width: 360 * widthPercent + 'px',
          height: 40 * widthPercent + 'px',
          'padding-left': 40 * widthPercent + 'px',
          'font-size': 14 * widthPercent + 'px'
        },
        addtionItem: {
          'padding-right': 40 * widthPercent + 'px',
          'padding-left': 30 * widthPercent + 'px',
          'padding-bottom': 20 * widthPercent + 'px',
          'margin-top': 30 * widthPercent + 'px',
          'margin-bottom': 20 * widthPercent + 'px',
          height: 25 * widthPercent + 'px',
          'font-size': 14 * widthPercent + 'px'
        },
        submitButton: {
          width: 360 * widthPercent + 'px',
          height: 40 * widthPercent + 'px',
          'font-size': 18 * widthPercent + 'px',
          'margin-left': 24 * widthPercent + 'px',
          'margin-top': 10 * widthPercent + 'px'
        },
        loginFail: {
          'font-size': 14 * widthPercent + 'px',
          height: 30 * widthPercent + 'px',
          'line-height': 30 * widthPercent + 'px',
          'margin-top': 10 * widthPercent + 'px'
        },
        loginFailHidden: {
          'font-size': 14 * widthPercent + 'px',
          height: 30 * widthPercent + 'px'
        },
        failImg: {
          width: 22 * widthPercent + 'px',
          height: 20 * widthPercent + 'px',
          top: -3 * widthPercent + 'px'
        },
        emptyPassword: {
          width: 20 * widthPercent + 'px',
          height: 20 * widthPercent + 'px',
          top: 39 * widthPercent + 'px',
          right: 42 * widthPercent + 'px'
        },
        loginLoadStyle: {
          height: 30 * widthPercent + 'px',
          width: 30 * widthPercent + 'px',
          'background-size': 30 * widthPercent + 'px'
        },
        userName: '',
        password: '',
        errorFlag: false,
        showLoadImg: false
      }
    },
    methods: {
      handleEvent: function () {
        let that = this;
        let loginParams = { "userName": this.userName, "userPwd": this.password };
        login(loginParams).then(function (result) {
          let { errorCode, data,  token } = result;
          if (errorCode == 0) {
            appUtil.setTollgateToken(token);
            that.$router.push('/Home');
          } else {
            that.errorFlag = true;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .bgVideo {
    overflow: hidden;
    object-fit: fill;
  }

  .loginDiv {
    width: 480px;
    height: 500px;
    margin-top: -294px;
    margin-left: -240px;
    left: 50%;
    top: 50%;
    position: absolute;
    background-size: 100% 100%;
  }

  .userIcon {
    height: 120px;
    width: 120px;
    /*padding-top: 10px;*/
  }

  .inputIcon {
    width: 20px;
    height: 20px;
    left: 35px;
    position: relative;
    vertical-align: middle;
  }

  .inputText {
    display: inline-block;
    border: #636ef5 1px solid;
    border-radius: 3px;
    font-size: 14px;
    color: #666666;
    width: 360px;
    height: 40px;
    padding-left: 40px;
    box-sizing: border-box;
  }

  .submitButton {
    width: 360px;
    height: 40px;
    margin-top: 10px;
    margin-left: 24px;
    font-size: 18px;
    color: #FFFFFF;
    background-image: url("../assets/login/button_login_normal.png");
    text-align: center;
    border: 1px #636ef5;
    border-radius: 3px;
  }

  .loginTitle {
    text-align: center;
    font-size: 18px;
    margin-top: 20px;
    color: #636ef5;
    font-weight: bold;
    font-family: '微软雅黑';
  }

  .loginForm {
    padding-top: 2px;
    padding-left: 35px;
    padding-right: 30px
  }

  .inputDiv {
    padding-top: 30px;
    position: relative;
  }

  /*.inputDiv .inputText:focus + .emptyPassword{*/
  /*display: block !important;*/
  /*}*/
  .submitButton:hover {
    background-image: url("../assets/login/button_login_hover.png");
    cursor: pointer;
  }

  .submitButton:active {
    background-image: url("../assets/login/button_login_loading.png");
  }

  .submitButton:disabled {
    background-image: url("../assets/login/button_login_gray.png");
  }

  .emptyPassword {
    position: absolute;
    right: 42px;
    top: 39px;
  }

  .emptyPassword:hover {
    cursor: pointer;
  }

  .loginFail {
    font-size: 14px;
    color: #fa5883;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
  }

  .loginFailHidden {
    visibility: hidden;
  }

  .loginFailVisible {
    visibility: visible;
  }

  .failImg {
    width: 22px;
    height: 20px;
    display: inline-block;
    position: relative;
    top: -3px;
  }

  .loading {
    width: 20px;
    height: 20px;
  }

  .login-load-image {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-image: url(../assets/login/icon_loading.gif);
  }

  .login-title-bg {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    margin: 0 auto;
  }

  .login-container-bg {
    text-align: center;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
