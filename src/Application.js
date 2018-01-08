/**
 * @description 定义全局命名空间，并在此空间下定义属性和函数，以便全局使用
 * @file Application.js
 * @author    zhaohang
 * @date      2017/12/26
 *
 * @copyright @Navinfo, all rights reserved.
 */

export const appConfig = {
  appName: 'tollGate',
  // serviceUrl: 'http://192.168.15.220:3000' // 正式环境的服务地址
  // serviceUrl: 'http://192.168.4.189:3000' // 开发环境的服务地址
  serviceUrl: window.serviceConfig.serviceUrl // 开发环境的服务地址
};

export const appUtil = {
  setCurrentUser: function (user) {
    sessionStorage.setItem(`${appConfig.appName}-user`, JSON.stringify(user));
  },
  getCurrentUser: function () {
    return JSON.parse(sessionStorage.getItem(`${appConfig.appName}-user`));
  },
  removeCurrentUser: function () {
    sessionStorage.removeItem(`${appConfig.appName}-user`);
  }
};
