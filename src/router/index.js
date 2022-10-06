import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
  },
  {
    path: '/modal',
    name: 'modal',
    component: () => import('@/views/modal')
  },
  {
    path: '/spinner',
    name: 'spinner',
    component: () => import('@/views/spinner')
  },
  {
    path: '/toast',
    name: 'toast',
    component: () => import('@/views/toast')
  },
  {
    path: '/tooltip',
    name: 'tooltip',
    component: () => import('@/views/tooltip')
  },
  {
    path: '/pagination',
    name: 'pagination',
    component: () => import('@/views/pagination')
  },
  {
    path: '/listTable',
    name: 'listTable',
    component: () => import('@/views/listTable')
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/views/form')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
