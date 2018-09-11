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
  renderName: 'mapRender',
  // serviceUrl: 'http://192.168.15.220:3000' // 正式环境的服务地址
  // serviceUrl: 'http://192.168.4.189:3000' // 开发环境的服务地址
  serviceUrl: window.serviceConfig.serviceUrl, // 开发环境的服务地址
  infoUrl: window.serviceConfig.infoUrl, // 开发环境的情报服务
  hbaseUrl: window.serviceConfig.habaseUrl // habse环境地址
};

export const appUtil = {
  setGolbalData: function (data) {
    sessionStorage.setItem(`${appConfig.appName}-globalData`, JSON.stringify(data));
  },
  getGolbalData: function () {
    return JSON.parse(sessionStorage.getItem(`${appConfig.appName}-globalData`));
  },
  removeGolbalData: function () {
    return sessionStorage.removeItem(`${appConfig.appName}-globalData`);
  },
  setTollgateToken: function (token) {
    sessionStorage.setItem(`${appConfig.appName}-token`, token);
  },
  getTollgateToken: function () {
    return sessionStorage.getItem(`${appConfig.appName}-token`);
  },
  removeTollgateToken: function () {
    sessionStorage.removeItem(`${appConfig.appName}-token`);
  },
  setSessionStorage: function (name, param) {
    sessionStorage.setItem(`${appConfig.appName}-${name}`, JSON.stringify(param));
  },
  getSessionStorage: function (name) {
    return JSON.parse(sessionStorage.getItem(`${appConfig.appName}-${name}`));
  },
  removeSessionStorage: function (name) {
    sessionStorage.removeItem(`${appConfig.appName}-${name}`);
  }
};
