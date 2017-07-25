import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '../views/goodsList'
import Cart from '@/components/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList

    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address

    }
    ,
    {
      path: '/orderconfirm',
      name: 'OrderConfirm',
      component: OrderConfirm

    }
    ,
    {
      path: '/ordersuccess',
      name: 'OrderSuccess',
      component: OrderSuccess

    }
  ]
})
