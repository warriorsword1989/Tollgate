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
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';


//添加一个请求拦截器
axios.interceptors.request.use(function(config){
  if (config.url.split('/').pop() != 'login') {
    config.headers.common['x-access-token'] = appUtil.getTollgateToken();
  }
  return config;
},function(err){
  return Promise.reject(err);
});

//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  return res.data;
},function(err){
  return Promise.reject(err);
});

// -- 用户相关  --
export const login = params => { return axios.post('/tollgate/user/login', params) }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

// -- tips列表相关  --
export const getTollGateTipList = params => { return axios.get('/tollgate/tips/getTollGateTipList', {params})};
export const getTollGateTip = params => { return axios.get('/tollgate/tips/getTollGateTip', {params})};
export const updateTollGateTip = params => { return axios.post('/tollgate/tips/updateTollGateTip', params)};
const hbase = axios.create({
  baseURL: window.serviceConfig.tempFsUrl
});
export const getTipsPhoto = params => { return hbase.get('/fcc/photo/getPhotosByRowkey', {params})};
export const tempLogin = params => { return hbase.get('/man/userInfo/login', {params})};
// 收费站新增编辑相关;
export const getTollGate = params => { return axios.get('/tollgate/tips/getTollGate', {params})};
export const getBriageName = params => { return axios.get('/tollgate/tips/getBtName', {params})};
export const updateTollGate = params => { return axios.post('/tollgate/tips/updateTollGate', params)};
// 查询功能
export const getSearchData = params => { return axios.get('/tollgate/search/getSearchData', {params})};
console.log(window.serviceConfig.tempFsUrl)
