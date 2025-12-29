import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import SalaryCalculator from '@/views/SalaryCalculator.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: SalaryCalculator
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

