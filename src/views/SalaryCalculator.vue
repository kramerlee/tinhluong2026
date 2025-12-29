<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useSalaryStore } from '@/stores/salary'
import InputNumber from 'primevue/inputnumber'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'

const store = useSalaryStore()

// Page-specific SEO
useHead({
  title: 'Tính Lương NET 2026 - Công cụ tính lương online miễn phí',
  meta: [
    {
      name: 'description',
      content: computed(() => 
        store.isNewTaxBrackets 
          ? 'Tính lương NET từ GROSS với biểu thuế mới 5 bậc từ 01/07/2026. Giảm trừ gia cảnh 15.5 triệu/tháng, người phụ thuộc 6.2 triệu/người.'
          : 'Tính lương NET từ GROSS theo mức giảm trừ gia cảnh 2026. Giảm trừ bản thân 15.5 triệu, người phụ thuộc 6.2 triệu/người/tháng.'
      )
    }
  ]
})

const grossSalaryModel = computed({
  get: (): number => store.grossSalary,
  set: (val: number | null) => store.setGrossSalary(val)
})

const dependentsModel = computed({
  get: (): number => store.dependents,
  set: (val: number | null) => store.setDependents(val)
})

const otherDeductionsModel = computed({
  get: (): number => store.otherDeductions,
  set: (val: number | null) => store.setOtherDeductions(val)
})

const showComparisonModel = computed({
  get: (): boolean => store.showComparison,
  set: (val: boolean) => store.setShowComparison(val)
})

function formatVND(value: number): string {
  return store.formatCurrency(value) + ' ₫'
}

function formatDiff(value: number): string {
  const prefix = value > 0 ? '+' : ''
  return prefix + store.formatCurrency(value) + ' ₫'
}
</script>

<template>
  <div class="calculator-container">
    <header class="header">
      <h1>
        <i class="pi pi-calculator"></i>
        Tính Lương NET
      </h1>
      <p class="subtitle">Áp dụng mức giảm trừ gia cảnh 2026</p>
      <div v-if="store.isNewTaxBrackets" class="tax-badge new-tax">
        <i class="pi pi-bolt"></i>
        Biểu thuế mới 5 bậc (từ 01/07/2026)
      </div>
      <div v-else class="tax-badge old-tax">
        <i class="pi pi-calendar"></i>
        Biểu thuế 7 bậc (trước 01/07/2026)
      </div>
    </header>

    <main class="main-content">
      <!-- New Tax Brackets Notice -->
      <Card v-if="store.isNewTaxBrackets" class="notice-card new-tax-notice">
        <template #content>
          <div class="notice-content">
            <i class="pi pi-star-fill"></i>
            <div>
              <strong>Áp dụng biểu thuế mới từ 01/07/2026</strong>
              <p>Giảm từ 7 bậc xuống 5 bậc theo Nghị quyết 954/2025/UBTVQH15</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Input Section -->
      <Card class="input-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-pencil"></i>
            Thông tin thu nhập
          </div>
        </template>
        <template #content>
          <div class="form-group">
            <label for="gross">Lương GROSS (VNĐ)</label>
            <InputNumber
              id="gross"
              v-model="grossSalaryModel"
              :min="0"
              :max="1000000000"
              locale="vi-VN"
              placeholder="Nhập lương gross"
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <div class="form-group">
            <label for="dependents">Số người phụ thuộc</label>
            <InputNumber
              id="dependents"
              v-model="dependentsModel"
              :min="0"
              :max="20"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              class="w-full"
              inputClass="w-full text-center"
              decrementButtonClass="p-button-secondary"
              incrementButtonClass="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
            <small class="hint">Giảm trừ: {{ formatVND(store.DEPENDENT_DEDUCTION) }}/người</small>
          </div>

          <div class="form-group">
            <label for="other">Giảm trừ khác (VNĐ)</label>
            <InputNumber
              id="other"
              v-model="otherDeductionsModel"
              :min="0"
              locale="vi-VN"
              placeholder="Đóng góp từ thiện, v.v."
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <div class="form-group checkbox-group">
            <Checkbox
              v-model="showComparisonModel"
              inputId="comparison"
              :binary="true"
            />
            <label for="comparison" class="checkbox-label">
              <i class="pi pi-chart-bar"></i>
              So sánh với trước 2026
            </label>
          </div>

          <Button
            label="Đặt lại"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            class="reset-btn"
            @click="store.reset()"
          />
        </template>
      </Card>

      <!-- Insurance Section -->
      <Card class="result-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-shield"></i>
            Bảo hiểm bắt buộc
          </div>
        </template>
        <template #content>
          <div class="result-row">
            <span class="label">BHXH (8%)</span>
            <span class="value negative">-{{ formatVND(store.socialInsurance) }}</span>
          </div>
          <div class="result-row">
            <span class="label">BHYT (1.5%)</span>
            <span class="value negative">-{{ formatVND(store.healthInsurance) }}</span>
          </div>
          <div class="result-row">
            <span class="label">BHTN (1%)</span>
            <span class="value negative">-{{ formatVND(store.unemploymentInsurance) }}</span>
          </div>
          <Divider />
          <div class="result-row total">
            <span class="label">Tổng bảo hiểm</span>
            <span class="value negative">-{{ formatVND(store.totalInsurance) }}</span>
          </div>
        </template>
      </Card>

      <!-- Deductions Section -->
      <Card class="result-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-minus-circle"></i>
            Giảm trừ gia cảnh
          </div>
        </template>
        <template #content>
          <div class="result-row">
            <span class="label">Bản thân</span>
            <span class="value">{{ formatVND(store.personalDeduction) }}</span>
          </div>
          <div class="result-row">
            <span class="label">Người phụ thuộc ({{ store.dependents }} người)</span>
            <span class="value">{{ formatVND(store.dependentsDeduction) }}</span>
          </div>
          <div class="result-row" v-if="store.otherDeductions > 0">
            <span class="label">Giảm trừ khác</span>
            <span class="value">{{ formatVND(store.otherDeductions) }}</span>
          </div>
          <Divider />
          <div class="result-row total">
            <span class="label">Tổng giảm trừ</span>
            <span class="value">{{ formatVND(store.totalDeductions) }}</span>
          </div>
        </template>
      </Card>

      <!-- Tax Calculation Section -->
      <Card class="result-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-percentage"></i>
            Tính thuế TNCN
            <span v-if="store.isNewTaxBrackets" class="title-badge">5 bậc mới</span>
            <span v-else class="title-badge old">7 bậc</span>
          </div>
        </template>
        <template #content>
          <div class="result-row">
            <span class="label">Thu nhập trước thuế</span>
            <span class="value">{{ formatVND(store.incomeBeforeTax) }}</span>
          </div>
          <div class="result-row">
            <span class="label">Thu nhập chịu thuế</span>
            <span class="value highlight">{{ formatVND(store.taxableIncome) }}</span>
          </div>

          <Divider />

          <div class="tax-table" v-if="store.taxDetails.length > 0">
            <h4>
              Chi tiết thuế theo bậc
              <span v-if="store.isNewTaxBrackets" class="bracket-info">(Biểu thuế mới)</span>
            </h4>
            <DataTable :value="store.taxDetails" size="small" stripedRows>
              <Column field="bracket" header="Bậc thuế"></Column>
              <Column field="rate" header="Thuế suất"></Column>
              <Column header="Thu nhập">
                <template #body="{ data }">
                  {{ formatVND(data.taxableAmount) }}
                </template>
              </Column>
              <Column header="Thuế">
                <template #body="{ data }">
                  {{ formatVND(data.tax) }}
                </template>
              </Column>
            </DataTable>
          </div>

          <div class="no-tax" v-else>
            <i class="pi pi-check-circle"></i>
            <span>Không phát sinh thuế TNCN</span>
          </div>

          <Divider />
          <div class="result-row total">
            <span class="label">Tổng thuế TNCN</span>
            <span class="value negative">-{{ formatVND(store.taxAmount) }}</span>
          </div>
        </template>
      </Card>

      <!-- Summary Section -->
      <Card class="summary-card">
        <template #content>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Lương GROSS</span>
              <span class="summary-value gross">{{ formatVND(store.grossSalary) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Bảo hiểm</span>
              <span class="summary-value deduction">-{{ formatVND(store.totalInsurance) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Thuế TNCN</span>
              <span class="summary-value deduction">-{{ formatVND(store.taxAmount) }}</span>
            </div>
            <div class="summary-item main">
              <span class="summary-label">Lương NET</span>
              <span class="summary-value net">{{ formatVND(store.netSalary) }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Comparison Section -->
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
                  <th>{{ store.isNewTaxBrackets ? 'Từ 01/07/2026' : 'Từ 01/01/2026' }}</th>
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

      <!-- Info Section -->
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
                <span class="tag new">01/07/2026</span>
              </span>
              <span v-else>
                7 bậc (5%, 10%, 15%, 20%, 25%, 30%, 35%)
                <span class="tag old">Trước 01/07/2026</span>
              </span>
            </li>
            <li>
              <strong>Căn cứ giảm trừ:</strong> Nghị quyết 110/2025/UBTVQH15 (từ 01/01/2026)
            </li>
            <li v-if="store.isNewTaxBrackets">
              <strong>Căn cứ bậc thuế:</strong> Nghị quyết 954/2025/UBTVQH15 (từ 01/07/2026)
            </li>
          </ul>

          <!-- Tax Brackets Reference -->
          <Divider />
          <div class="brackets-reference">
            <h4>Biểu thuế TNCN {{ store.isNewTaxBrackets ? 'mới (từ 01/07/2026)' : '(trước 01/07/2026)' }}</h4>
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
    </main>

    <footer class="footer">
      <p>© 2026 - Công cụ tính lương tham khảo</p>
    </footer>
  </div>
</template>

<style scoped>
.calculator-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a5f;
}

.title-badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
  text-transform: uppercase;
}

.title-badge.old {
  background: #f3f4f6;
  color: #6b7280;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group .hint {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0 !important;
  color: #0369a1 !important;
  font-weight: 500 !important;
}

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}

.reset-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.result-row .label {
  color: #4b5563;
  font-size: 0.875rem;
}

.result-row .value {
  font-weight: 600;
  color: #1f2937;
}

.result-row .value.negative {
  color: #dc2626;
}

.result-row .value.highlight {
  color: #2563eb;
}

.result-row.total {
  font-size: 1rem;
}

.result-row.total .label {
  font-weight: 600;
  color: #1f2937;
}

.tax-table h4 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bracket-info {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
}

.no-tax {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #ecfdf5;
  border-radius: 8px;
  color: #059669;
  font-weight: 500;
}

.summary-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
}

.summary-card :deep(.p-card-body) {
  padding: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.summary-item {
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.summary-item.main {
  grid-column: span 2;
  background: rgba(255, 255, 255, 0.2);
}

.summary-label {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1rem;
  font-weight: 700;
}

.summary-value.gross {
  color: #a5d6ff;
}

.summary-value.deduction {
  color: #fca5a5;
}

.summary-value.net {
  font-size: 1.5rem;
  color: #86efac;
}

/* Comparison Card Styles */
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

.footer {
  text-align: center;
  padding: 1rem;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.75rem;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .header h1 {
    font-size: 1.25rem;
  }

  .main-content {
    padding: 0.75rem;
  }

  .summary-value.net {
    font-size: 1.25rem;
  }

  :deep(.p-datatable) {
    font-size: 0.75rem;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
  }

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

  .checkbox-group {
    padding: 0.625rem;
  }

  .checkbox-label {
    font-size: 0.875rem;
  }

  .brackets-table {
    font-size: 0.75rem;
  }

  .brackets-table th,
  .brackets-table td {
    padding: 0.375rem;
  }
}
</style>
