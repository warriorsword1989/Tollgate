import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import mainMap from '@/components/mainMap'
import Home from '@/components/Home'
import table from '@/components/table'
import Truck from '@/components/Truck'
import truckWeight from '@/components/truckWeight'
import TruckWeightLimit from '@/components/TruckWeightLimit'
import TollgateFee from '@/components/TollgateFee'
import TollgateInterval from '@/components/TollgateInterval'
import Limit from '@/components/Limit'
import RdlinkAdditional from '@/components/RdlinkAdditional'
import vacationFee from '@/components/vacationFee'
import specialFeeMes from '@/components/specialFeeMes'
import RdlinkCheck from '@/components/RdlinkCheck'

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
    },
    {
      path: '/Home',
      component: Home,
      name: 'Home'
    },
    {
      path: '/table',
      component: table,
      name: 'table'
    },
    {
      path: '/Truck',
      component: Truck,
      name: 'Truck'
    },
    {
      path: '/truckWeight',
      component: truckWeight,
      name: 'truckWeight'
    },
    {
      path: '/TruckWeightLimit',
      component: TruckWeightLimit,
      name: 'TruckWeightLimit'
    },
    {
      path: '/TollgateFee',
      component: TollgateFee,
      name: 'TollgateFee'
    },
    {
      path: '/TollgateInterval',
      component: TollgateInterval,
      name: 'TollgateInterval'
    },
    {
      path: '/Limit',
      component: Limit,
      name: 'Limit'
    },
    {
      path: '/RdlinkAdditional',
      component: RdlinkAdditional,
      name: 'RdlinkAdditional'
    },
    {
      path: '/vacationFee',
      component: vacationFee,
      name: 'vacationFee'
    },
    {
      path: '/specialFeeMes',
      component: specialFeeMes,
      name: 'specialFeeMes'
    },
    {
      path: '/RdlinkCheck',
      component: RdlinkCheck,
      name: 'RdlinkCheck'
    }
  ]
})
