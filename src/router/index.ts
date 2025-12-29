import type { RouteRecordRaw } from 'vue-router'
import SalaryCalculator from '@/views/SalaryCalculator.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: SalaryCalculator,
    meta: {
      title: 'Tính Lương NET 2026 - Công cụ tính lương online',
      description: 'Công cụ tính lương NET từ GROSS theo mức giảm trừ gia cảnh 2026. Tự động áp dụng biểu thuế mới 5 bậc từ 01/07/2026.'
    }
  }
]
