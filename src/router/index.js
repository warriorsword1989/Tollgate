import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import mainMap from '@/components/mainMap'
import Home from '@/components/Home'
import homeView from '@/components/homeView/index'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login // name需要保持唯一,通过router.push({name:'Login'})方式切换路由
    },
    {
      path: '/login',
      component: Login,
      name: 'Login'
    },
    {
      path: '/mainMap',
      component: mainMap,
      name: 'mainMap'
    },
    {
      path: '/home',
      component: Home,
      name: 'Home',
      children:[
        { path: '/home/photoWork', component: homeView.photoWork, name: 'photoWork' },
        { path: '/home/infosWork', component: homeView.infosWork, name: 'infosWork' }
      ]
    }
  ]
})
