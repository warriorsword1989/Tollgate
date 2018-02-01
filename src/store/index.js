import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这里定义初始值
let state = {
  handleFlag: 'update',
  selectedData: [],
  editSelectedData: [],
  workStatus: 'static',
  btData: {name: '',name_groupid:0},
  adminCode:null,
};

const mutations = {
  chnageAdminCode(context, value) {
    context.adminCode = value;
  },
  changeBtData(context, value) {
    context.btData = value;
  },
  changeWorkStatus(context, value){
    context.workStatus = value;
  },
  changeHandleFlag(context, value) {
    context.handleFlag = value;
  },
  changeSelectedData(context, value) {
    context.selectedData = value;
  },
  changeEditSelectedData(context, value) {
    context.editSelectedData = value;
  }
};

// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {
};

// 返回改变后的数值
const getters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
