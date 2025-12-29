<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import { useSalaryStore } from '@/stores/salary'
import { useFormatters } from '@/composables/useFormatters'

const store = useSalaryStore()
const { formatVND, formatDiff } = useFormatters()
</script>

<template>
  <Card v-if="store.showComparison && store.grossSalary > 0" class="comparison-card">
    <template #title>
      <div class="card-title comparison-title">
        <i class="pi pi-chart-bar"></i>
        So sánh với trước 2026
      </div>
    </template>
    <template #content>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Khoản mục</th>
              <th>Trước 2026</th>
              <th>Từ 01/01/2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Giảm trừ bản thân</td>
              <td>{{ formatVND(store.comparison.pre2026.personalDeduction) }}</td>
              <td>{{ formatVND(store.comparison.current.personalDeduction) }}</td>
            </tr>
            <tr>
              <td>Giảm trừ người phụ thuộc</td>
              <td>{{ formatVND(store.comparison.pre2026.dependentsDeduction) }}</td>
              <td>{{ formatVND(store.comparison.current.dependentsDeduction) }}</td>
            </tr>
            <tr class="highlight-row">
              <td>Tổng giảm trừ</td>
              <td>{{ formatVND(store.comparison.pre2026.totalDeductions) }}</td>
              <td>{{ formatVND(store.comparison.current.totalDeductions) }}</td>
            </tr>
            <tr>
              <td>Thu nhập chịu thuế</td>
              <td>{{ formatVND(store.comparison.pre2026.taxableIncome) }}</td>
              <td>{{ formatVND(store.comparison.current.taxableIncome) }}</td>
            </tr>
            <tr>
              <td>Thuế TNCN</td>
              <td class="negative">{{ formatVND(store.comparison.pre2026.taxAmount) }}</td>
              <td class="negative">{{ formatVND(store.comparison.current.taxAmount) }}</td>
            </tr>
            <tr class="highlight-row">
              <td>Lương NET</td>
              <td>{{ formatVND(store.comparison.pre2026.netSalary) }}</td>
              <td>{{ formatVND(store.comparison.current.netSalary) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Divider />

      <div class="comparison-summary">
        <h4>
          <i class="pi pi-arrow-up"></i>
          Lợi ích so với trước 2026
        </h4>
        <div class="benefit-grid">
          <div class="benefit-item">
            <span class="benefit-label">Tăng giảm trừ</span>
            <span class="benefit-value positive">{{ formatDiff(store.comparison.difference.deductions) }}</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-label">Giảm thu nhập chịu thuế</span>
            <span class="benefit-value positive">{{ formatDiff(store.comparison.difference.taxableIncome) }}</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-label">Tiết kiệm thuế</span>
            <span class="benefit-value positive">{{ formatDiff(store.comparison.difference.taxSaved) }}</span>
          </div>
          <div class="benefit-item main">
            <span class="benefit-label">Tăng lương NET</span>
            <span class="benefit-value highlight">{{ formatDiff(store.comparison.difference.netSalaryGain) }}</span>
          </div>
        </div>
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
}

.comparison-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
}

.comparison-title {
  color: #92400e !important;
}

.comparison-table {
  overflow-x: auto;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.comparison-table th,
.comparison-table td {
  padding: 0.625rem 0.5rem;
  text-align: right;
  border-bottom: 1px solid #fcd34d;
}

.comparison-table th {
  background: rgba(245, 158, 11, 0.2);
  font-weight: 600;
  color: #92400e;
}

.comparison-table th:first-child,
.comparison-table td:first-child {
  text-align: left;
}

.comparison-table .highlight-row {
  background: rgba(245, 158, 11, 0.15);
  font-weight: 600;
}

.comparison-table .negative {
  color: #dc2626;
}

.comparison-summary {
  margin-top: 0.5rem;
}

.comparison-summary h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: #166534;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.benefit-item {
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.benefit-item.main {
  grid-column: span 2;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
}

.benefit-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.benefit-item.main .benefit-label {
  color: rgba(255, 255, 255, 0.9);
}

.benefit-value {
  font-size: 1rem;
  font-weight: 700;
}

.benefit-value.positive {
  color: #059669;
}

.benefit-value.highlight {
  font-size: 1.25rem;
  color: white;
}

@media (max-width: 480px) {
  .comparison-table {
    font-size: 0.75rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.5rem 0.25rem;
  }

  .benefit-grid {
    grid-template-columns: 1fr;
  }

  .benefit-item.main {
    grid-column: span 1;
  }
}
</style>

