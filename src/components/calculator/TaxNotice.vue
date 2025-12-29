<script setup lang="ts">
import Card from 'primevue/card'
import { useSalaryStore } from '@/stores/salary'

const store = useSalaryStore()
</script>

<template>
  <Card v-if="store.isNewTaxBrackets" class="notice-card new-tax-notice">
    <template #content>
      <div class="notice-content">
        <i class="pi pi-star-fill"></i>
        <div>
          <strong>Áp dụng biểu thuế mới từ 01/01/2026</strong>
          <p>Giảm từ 7 bậc xuống 5 bậc theo Nghị quyết 954/2025/UBTVQH15</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.notice-card.new-tax-notice {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
}

.notice-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.notice-content i {
  color: #059669;
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.notice-content strong {
  color: #065f46;
  display: block;
  margin-bottom: 0.25rem;
}

.notice-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #047857;
}
</style>

