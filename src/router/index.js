/*
 * @Author: zj.wang
 * @Date: 2020-03-11 11:01:50
 * @LastEditors: zj.wang
 * @LastEditTime: 2020-03-16 10:45:12
 * @Description:
 */
import Vue from 'vue'
import Router from 'vue-router'
import D1 from '@/views/d1'
import D2 from '@/views/d2'
import D3 from '@/views/d3'
import D4 from '@/views/d4'
import D5 from '@/views/d5'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/d1',
      name: 'demo1',
      component: D1
    },
    {
      path: '/d2',
      name: 'demo2',
      component: D2
    },
    {
      path: '/d3',
      name: 'demo3',
      component: D3
    },
    {
      path: '/d4',
      name: 'demo4',
      component: D4
    },
    {
      path: '/d5',
      name: 'demo5',
      component: D5
    }
  ]
})
