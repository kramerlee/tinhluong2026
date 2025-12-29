<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import { useSalaryStore } from '@/stores/salary'
import { useFormatters } from '@/composables/useFormatters'

const store = useSalaryStore()
const { formatVND } = useFormatters()
</script>

<template>
  <Card class="info-card">
    <template #title>
      <div class="card-title">
        <i class="pi pi-info-circle"></i>
        Thông tin tham khảo
      </div>
    </template>
    <template #content>
      <ul class="info-list">
        <li>
          <strong>Mức giảm trừ bản thân:</strong> {{ formatVND(store.PERSONAL_DEDUCTION) }}/tháng
          <span class="tag new">01/01/2026</span>
        </li>
        <li>
          <strong>Mức giảm trừ người phụ thuộc:</strong> {{ formatVND(store.DEPENDENT_DEDUCTION) }}/người/tháng
          <span class="tag new">01/01/2026</span>
        </li>
        <li v-if="store.showComparison">
          <strong>Mức giảm trừ bản thân (cũ):</strong> {{ formatVND(store.PERSONAL_DEDUCTION_PRE2026) }}/tháng
          <span class="tag old">Trước 2026</span>
        </li>
        <li v-if="store.showComparison">
          <strong>Mức giảm trừ người phụ thuộc (cũ):</strong> {{ formatVND(store.DEPENDENT_DEDUCTION_PRE2026) }}/người/tháng
          <span class="tag old">Trước 2026</span>
        </li>
        <li>
          <strong>Bậc thuế TNCN đang áp dụng:</strong>
          <span v-if="store.isNewTaxBrackets">
            5 bậc (5%, 10%, 20%, 30%, 35%)
            <span class="tag new">01/01/2026</span>
          </span>
          <span v-else>
            7 bậc (5%, 10%, 15%, 20%, 25%, 30%, 35%)
            <span class="tag old">Trước 2026</span>
          </span>
        </li>
        <li>
          <strong>Căn cứ giảm trừ:</strong> Nghị quyết 110/2025/UBTVQH15 (từ 01/01/2026)
        </li>
        <li v-if="store.isNewTaxBrackets">
          <strong>Căn cứ bậc thuế:</strong> Nghị quyết 954/2025/UBTVQH15 (từ 01/01/2026)
        </li>
      </ul>

      <!-- Tax Brackets Reference -->
      <Divider />
      <div class="brackets-reference">
        <h4>Biểu thuế TNCN {{ store.isNewTaxBrackets ? 'mới (từ 01/01/2026)' : '(trước 2026)' }}</h4>
        <table class="brackets-table">
          <thead>
            <tr>
              <th>Bậc</th>
              <th>Thu nhập chịu thuế/tháng</th>
              <th>Thuế suất</th>
            </tr>
          </thead>
          <tbody v-if="store.isNewTaxBrackets">
            <tr><td>1</td><td>Đến 10 triệu</td><td>5%</td></tr>
            <tr><td>2</td><td>10 - 30 triệu</td><td>10%</td></tr>
            <tr><td>3</td><td>30 - 60 triệu</td><td>20%</td></tr>
            <tr><td>4</td><td>60 - 100 triệu</td><td>30%</td></tr>
            <tr><td>5</td><td>Trên 100 triệu</td><td>35%</td></tr>
          </tbody>
          <tbody v-else>
            <tr><td>1</td><td>Đến 5 triệu</td><td>5%</td></tr>
            <tr><td>2</td><td>5 - 10 triệu</td><td>10%</td></tr>
            <tr><td>3</td><td>10 - 18 triệu</td><td>15%</td></tr>
            <tr><td>4</td><td>18 - 32 triệu</td><td>20%</td></tr>
            <tr><td>5</td><td>32 - 52 triệu</td><td>25%</td></tr>
            <tr><td>6</td><td>52 - 80 triệu</td><td>30%</td></tr>
            <tr><td>7</td><td>Trên 80 triệu</td><td>35%</td></tr>
          </tbody>
        </table>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a5f;
}

.info-card {
  background: #f0f9ff;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.info-list li:last-child {
  border-bottom: none;
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.tag.new {
  background: #dcfce7;
  color: #166534;
}

.tag.old {
  background: #fef3c7;
  color: #92400e;
}

.brackets-reference h4 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: #1e3a5f;
}

.brackets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.brackets-table th,
.brackets-table td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.brackets-table th {
  background: #e0f2fe;
  font-weight: 600;
  color: #0369a1;
}

.brackets-table td:first-child {
  font-weight: 600;
  background: #f0f9ff;
}

@media (max-width: 480px) {
  .brackets-table {
    font-size: 0.75rem;
  }

  .brackets-table th,
  .brackets-table td {
    padding: 0.375rem;
  }
}
</style>

