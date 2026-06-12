import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { noAuth: true } },
  {
    path: '/', component: () => import('@/layouts/MainLayout.vue'), redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '仪表盘' } },
      { path: 'customer', name: 'CustomerList', component: () => import('@/views/customer/CustomerList.vue'), meta: { title: '客户管理' } },
      { path: 'customer/add', name: 'CustomerAdd', component: () => import('@/views/customer/CustomerForm.vue'), meta: { title: '新增客户', hidden: true } },
      { path: 'customer/edit/:id', name: 'CustomerEdit', component: () => import('@/views/customer/CustomerForm.vue'), meta: { title: '编辑客户', hidden: true } },
      { path: 'business', name: 'BusinessList', component: () => import('@/views/business/BusinessList.vue'), meta: { title: '业务管理' } },
      { path: 'business/add', name: 'BusinessAdd', component: () => import('@/views/business/BusinessForm.vue'), meta: { title: '新增业务', hidden: true } },
      { path: 'business/edit/:id', name: 'BusinessEdit', component: () => import('@/views/business/BusinessForm.vue'), meta: { title: '编辑业务', hidden: true } },
      { path: 'workorder', name: 'WorkOrderList', component: () => import('@/views/workorder/WorkOrderList.vue'), meta: { title: '工单管理' } },
      { path: 'workorder/add', name: 'WorkOrderAdd', component: () => import('@/views/workorder/WorkOrderForm.vue'), meta: { title: '新建工单', hidden: true } },
      { path: 'workorder/detail/:id', name: 'WorkOrderDetail', component: () => import('@/views/workorder/WorkOrderDetail.vue'), meta: { title: '工单详情', hidden: true } },
      { path: 'user', name: 'UserList', component: () => import('@/views/user/UserList.vue'), meta: { title: '人员管理' } },
      { path: 'user/add', name: 'UserAdd', component: () => import('@/views/user/UserForm.vue'), meta: { title: '新增人员', hidden: true } },
      { path: 'user/edit/:id', name: 'UserEdit', component: () => import('@/views/user/UserForm.vue'), meta: { title: '编辑人员', hidden: true } },
      { path: 'system/region', name: 'RegionManage', component: () => import('@/views/system/RegionManage.vue'), meta: { title: '区域管理' } },
      { path: 'system/dept', name: 'DeptManage', component: () => import('@/views/system/DeptManage.vue'), meta: { title: '部门管理' } }
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('crm_token')
  if (!to.meta.noAuth && !token) next('/login')
  else next()
})
export default router
