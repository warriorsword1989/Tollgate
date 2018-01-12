/**
 * @description 前端页面定义的接口调用
 * @file api.js
 * @author    zhaohang
 * @date      2017/12/26
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';
import qs from 'querystring';
import { appConfig, appUtil } from '../Application';
// axios的全局配置;
axios.defaults.baseURL = appConfig.serviceUrl;


//添加一个请求拦截器
axios.interceptors.request.use(function(config){
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  if (config.url.split('/').pop() != 'login') {
    config.headers.common['x-access-token'] = appUtil.getTollgateToken();
  }
  return config;
},function(err){
  return Promise.reject(error);
});

//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  return res.data;
},function(err){
  return Promise.reject(error);
});

// -- 用户相关  --
export const login = params => { return axios.post('/tollgate/user/login', params) }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

// -- tips列表相关  --
export const getTollGateTipList = params => { return axios.get('/tollgate/tips/getTollGateTipList', {params})};
