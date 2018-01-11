// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import VueAwesomeSwiper from 'vue-awesome-swiper'


import App from './App'
import routerConfig from './router'

import 'swiper/dist/css/swiper.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css';
import 'vue-dialog-drag/dist/vue-dialog-drag.css'
import 'vue-dialog-drag/dist/drop-area.css'
import 'vue-dialog-drag/dist/dialog-styles.css'

Vue.use(Router);
Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper);
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: new Router(routerConfig),
  template: '<App/>',
  components: { App }
});

