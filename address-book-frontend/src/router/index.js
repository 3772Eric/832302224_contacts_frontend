import Vue from 'vue'
import Router from 'vue-router'
// 导入我们的联系人列表页面
import ContactList from '@/views/ContactList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ContactList',
      component: ContactList
    }
  ]
})