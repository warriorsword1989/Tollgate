/**
 * @description 前端页面定义的接口调用
 * @file api.js
 * @author    zhaohang
 * @date      2017/12/26
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';
import { appConfig, appUtil } from '../Application';

const baseUrl = appConfig.serviceUrl; // 服务的地址

// 统一增加token
const postReq = function (url, param) {
  if (!param) {
    param = {};
  }
  // if (url != '/api/om/user/login' && url != '/api/om/user/register' && url != '/api/om/user/getPassport' && url != '/api/om/user/resetPassword') {
  //   let token = appUtil.getCurrentUser().token;
  //   param.token = token;
  // }
  return axios.post(`${baseUrl + url}`, {paramter: JSON.stringify(param)}).then(res => res.data).catch(res => ({errcode: null, message: '处理失败'}));
};
// 统一增加token
const getReq = function (url, param) {
  if (!param) {
    param = {};
  }
  // if (url != '/api/om/user/login' && url != '/api/om/user/register' && url != '/api/om/user/getPassport' && url != '/api/om/user/resetPassword' ) {
  //   let token = appUtil.getCurrentUser().token;
  //   param.token = token;
  // }
  return axios.get(`${baseUrl + url}`, {params: {paramter: JSON.stringify(param)}}).then(res => res.data).catch(res => ({errcode: null}));
};

// -- 用户相关  --
export const login = param => { return postReq('/api/om/user/login', param) }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

// -- tips列表相关  --
export const getTollGateTipList = param => { return getReq('/tollgate/tips/getTollGateTipList', param)};
