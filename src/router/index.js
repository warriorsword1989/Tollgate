import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import mainMap from '@/components/mainMap'
import Home from '@/components/Home'

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
      path: '/Home',
      component: Home,
      name: 'Home',
      children:[
        // { path: '/mainMap/scTollCar', component: scTollCar},
        // { path: '/mainMap/scTollTruck', component: scTollTruck}
      ]
    }
  ]
})
