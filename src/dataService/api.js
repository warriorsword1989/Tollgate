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
import {appConfig, appUtil} from '../Application';
// axios的全局配置;
const baseInstance = axios.create();
const infoInstance = axios.create();

baseInstance.defaults.baseURL = appConfig.serviceUrl;
baseInstance.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

infoInstance.defaults.baseURL = appConfig.infoUrl;
infoInstance.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

//添加一个请求拦截器
baseInstance.interceptors.request.use(function (config) {
  if (config.url.split('/').pop() != 'login') {
    config.headers.common['x-access-token'] = appUtil.getTollgateToken();
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

//添加一个响应拦截器
baseInstance.interceptors.response.use(function (res) {
  return res.data;
}, function (err) {
  return Promise.reject(err);
});

infoInstance.interceptors.response.use(function (res) {
  return res.data;
}, function (err) {
  return Promise.reject(err);
});

// -- 用户相关  --
const login = params => {
  return baseInstance.post('/tollgate/user/login', params)
}; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

// -- tips列表相关  --
const getTollGateTipList = params => {
  return baseInstance.get('/tollgate/tips/getTollGateTipList', { params })
};
const getTollGateTip = params => {
  return baseInstance.get('/tollgate/tips/getTollGateTip', { params })
};
const updateTollGateTip = params => {
  return baseInstance.post('/tollgate/tips/updateTollGateTip', params)
};
// -- info列表相关
const getTollGateInfoList = params => {
  return baseInstance.get('/tollgate/info/getTollGateInfoList', { params })
};
const getAdminLoc = params => {
  return baseInstance.get('/tollgate/info/getAdminLoc', { params })
};
const getInfoList = params => {
  return baseInstance.get('/tollgate/info/getInfoListByInfoCode', { params })
};
const updateInfoList = params => {
  return baseInstance.get('/tollgate/info/updateInfoListByInfoIntelId', { params })
};
const getTollListByRdName = params => {
  return baseInstance.get('/tollgate/info/getTollListByRdName', { params })
};
const getTollListByTollId = params => {
  return baseInstance.get('/tollgate/info/getTollListByTollId', { params })
};
const getTollGateByAdminCode = params => {
  return baseInstance.get('/tollgate/info/getTollGateByAdminCode', { params })
};
// 像情报部门发送接口，更新情报库
const updateToInfoDepartments = params => {
  // const usParams = new URLSearchParams();
  // usParams.append('datas', JSON.stringify(params));
  return infoInstance.get('/InfoDataAction.do?operate=saveRoadTollFB', { params })
};

const getTipsPhoto = params => {
  return baseInstance.get('/tollgate/tips/photo', { params })
};
// 收费站新增编辑相关;
const getTollGate = params => {
  return baseInstance.get('/tollgate/tips/getTollGate', { params })
};
const getBriageName = params => {
  return baseInstance.get('/tollgate/tips/getBtName', { params })
};
const getTollName = params => {
  return baseInstance.get('/tollgate/tips/getTollName', { params })
};
const getMaxId = params => {
  return baseInstance.get('/tollgate/tips/getMaxId', { params })
};
const updateTollGate = params => {
  return baseInstance.post('/tollgate/tips/updateTollGate', params)
};
const deleteCarTruckTollGate = params => {
  return baseInstance.post('/tollgate/tips/deleteCarTruckTollGate', params)
};
const deleteRdLinkBt = params => {
  return baseInstance.post('/tollgate/tips/deleteRdLinkBt', params)
};
const getBridgeAndTunnel = params => {
  return baseInstance.get('/tollgate/tips/queryTollGateByBridge', {params})
};
// 查询功能
const getSearchData = params => {
  return baseInstance.get('/tollgate/search/getSearchData', { params })
};

export {
  login,
  getTollGateTipList,
  getTollGateTip,
  updateTollGateTip,
  getTollGateInfoList,
  getAdminLoc,
  getInfoList,
  updateToInfoDepartments,
  getTipsPhoto,
  getTollGate,
  getBriageName,
  getTollName,
  getMaxId,
  updateTollGate,
  getSearchData,
  getTollListByRdName,
  getTollListByTollId,
  deleteCarTruckTollGate,
  deleteRdLinkBt,
  getBridgeAndTunnel,
  getTollGateByAdminCode,
  updateInfoList
};
