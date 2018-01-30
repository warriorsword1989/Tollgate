import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这里定义初始值
let state = {
  handleFlag: 'edit',
  selectedData: [],
  editSelectedData: [],
};

const mutations = {
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
