import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import mainMap from '@/components/mainMap'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
    }
  ]
})
