// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

import VueAwesomeSwiper from 'vue-awesome-swiper'
import Viewer from 'v-viewer'
import VueDraggableResizable from 'vue-draggable-resizable'
import router from './router'
import App from './App'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css';
import 'swiper/dist/css/swiper.css'
import 'vue-dialog-drag/dist/vue-dialog-drag.css'
import 'vue-dialog-drag/dist/drop-area.css'
import 'vue-dialog-drag/dist/dialog-styles.css'
import store from './store/index.js'

Vue.use(ElementUI);
Vue.use(Viewer)
Vue.use(VueAwesomeSwiper);
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});