import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这里定义初始值
let state = {
  handleFlag: 'update',
  editSelectedData: [],
  btData: {name: null, name_groupid: null },
  source: 1,
};

const mutations = {
  changeBtData(context, value) {
    context.btData = value;
  },
  changeHandleFlag(context, value) {
    context.handleFlag = value;
  },
  changeEditSelectedData(context, value) {
    context.editSelectedData = value;
  },
  changeSourceValue(context, value) {
    context.source = value;
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
