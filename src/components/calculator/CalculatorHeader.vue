<script setup lang="ts">
import { useSalaryStore } from '@/stores/salary'

const store = useSalaryStore()
</script>

<template>
  <header class="header">
    <h1>
      <i class="pi pi-calculator"></i>
      Tính Lương NET
    </h1>
    <p class="subtitle">Áp dụng mức giảm trừ gia cảnh 2026</p>
    <div v-if="store.isNewTaxBrackets" class="tax-badge new-tax">
      <i class="pi pi-bolt"></i>
      Biểu thuế mới 5 bậc (từ 01/01/2026)
    </div>
    <div v-else class="tax-badge old-tax">
      <i class="pi pi-calendar"></i>
      Biểu thuế 7 bậc (trước 2026)
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
  padding: 1.5rem 1rem;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.header .subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.tax-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tax-badge.new-tax {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.tax-badge.old-tax {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.25rem;
  }
}
</style>

