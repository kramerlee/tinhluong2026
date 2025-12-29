import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface TaxBracket {
  limit: number
  rate: number
}

interface TaxDetail {
  bracket: string
  rate: string
  taxableAmount: number
  tax: number
}

interface ComparisonResult {
  pre2026: {
    personalDeduction: number
    dependentsDeduction: number
    totalDeductions: number
    taxableIncome: number
    taxAmount: number
    netSalary: number
  }
  current: {
    personalDeduction: number
    dependentsDeduction: number
    totalDeductions: number
    taxableIncome: number
    taxAmount: number
    netSalary: number
  }
  difference: {
    deductions: number
    taxableIncome: number
    taxSaved: number
    netSalaryGain: number
  }
}

export const useSalaryStore = defineStore('salary', () => {
  // Input values
  const grossSalary = ref<number>(0)
  const dependents = ref<number>(0)
  const otherDeductions = ref<number>(0)
  const showComparison = ref<boolean>(false)

  // 2026 Family deduction rates (Nghị quyết 110/2025/UBTVQH15)
  const PERSONAL_DEDUCTION = 15500000 // 15.5 triệu/tháng
  const DEPENDENT_DEDUCTION = 6200000 // 6.2 triệu/người phụ thuộc/tháng

  // Pre-2026 Family deduction rates
  const PERSONAL_DEDUCTION_PRE2026 = 11000000 // 11 triệu/tháng
  const DEPENDENT_DEDUCTION_PRE2026 = 4400000 // 4.4 triệu/người phụ thuộc/tháng

  // Insurance rates (from gross salary, capped at 20x base salary)
  const SOCIAL_INSURANCE_RATE = 0.08 // BHXH: 8%
  const HEALTH_INSURANCE_RATE = 0.015 // BHYT: 1.5%
  const UNEMPLOYMENT_INSURANCE_RATE = 0.01 // BHTN: 1%
  const BASE_SALARY = 2340000 // Lương cơ sở 2024
  const MAX_INSURANCE_SALARY = BASE_SALARY * 20 // Mức trần đóng BHXH

  // Pre-2026 Tax brackets (7 brackets)
  const TAX_BRACKETS_OLD: TaxBracket[] = [
    { limit: 5000000, rate: 0.05 },
    { limit: 10000000, rate: 0.10 },
    { limit: 18000000, rate: 0.15 },
    { limit: 32000000, rate: 0.20 },
    { limit: 52000000, rate: 0.25 },
    { limit: 80000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 }
  ]

  // From January 1, 2026 Tax brackets (5 brackets - Nghị quyết 954/2025/UBTVQH15)
  const TAX_BRACKETS_NEW: TaxBracket[] = [
    { limit: 10000000, rate: 0.05 },
    { limit: 30000000, rate: 0.10 },
    { limit: 60000000, rate: 0.20 },
    { limit: 100000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 }
  ]

  // Date for new tax brackets (January 1, 2026)
  const NEW_TAX_EFFECTIVE_DATE = new Date('2026-01-01')

  // Check if new tax brackets should be applied
  const isNewTaxBrackets = computed<boolean>(() => {
    const today = new Date()
    return today >= NEW_TAX_EFFECTIVE_DATE
  })

  // Get current applicable tax brackets
  const TAX_BRACKETS = computed<TaxBracket[]>(() => {
    return isNewTaxBrackets.value ? TAX_BRACKETS_NEW : TAX_BRACKETS_OLD
  })

  // Calculate insurance salary (capped)
  const insuranceSalary = computed<number>(() => {
    return Math.min(grossSalary.value, MAX_INSURANCE_SALARY)
  })

  // Social insurance amount
  const socialInsurance = computed<number>(() => {
    return Math.round(insuranceSalary.value * SOCIAL_INSURANCE_RATE)
  })

  // Health insurance amount
  const healthInsurance = computed<number>(() => {
    return Math.round(insuranceSalary.value * HEALTH_INSURANCE_RATE)
  })

  // Unemployment insurance amount
  const unemploymentInsurance = computed<number>(() => {
    return Math.round(insuranceSalary.value * UNEMPLOYMENT_INSURANCE_RATE)
  })

  // Total insurance
  const totalInsurance = computed<number>(() => {
    return socialInsurance.value + healthInsurance.value + unemploymentInsurance.value
  })

  // Personal deduction
  const personalDeduction = computed<number>(() => PERSONAL_DEDUCTION)

  // Dependents deduction
  const dependentsDeduction = computed<number>(() => {
    return dependents.value * DEPENDENT_DEDUCTION
  })

  // Total deductions
  const totalDeductions = computed<number>(() => {
    return personalDeduction.value + dependentsDeduction.value + otherDeductions.value
  })

  // Income before tax (after insurance)
  const incomeBeforeTax = computed<number>(() => {
    return Math.max(0, grossSalary.value - totalInsurance.value)
  })

  // Taxable income (after all deductions)
  const taxableIncome = computed<number>(() => {
    return Math.max(0, incomeBeforeTax.value - totalDeductions.value)
  })

  // Helper function to calculate progressive tax with specific brackets
  function calculateTaxWithBrackets(taxableAmount: number, brackets: TaxBracket[]): number {
    let income = taxableAmount
    let tax = 0
    let previousLimit = 0

    for (const bracket of brackets) {
      if (income <= 0) break

      const taxableInBracket = Math.min(income, bracket.limit - previousLimit)
      tax += taxableInBracket * bracket.rate
      income -= taxableInBracket
      previousLimit = bracket.limit
    }

    return Math.round(tax)
  }

  // Calculate progressive tax using current applicable brackets
  const taxAmount = computed<number>(() => {
    return calculateTaxWithBrackets(taxableIncome.value, TAX_BRACKETS.value)
  })

  // Format currency
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  // Get tax details for specific brackets
  function getTaxDetailsForBrackets(taxableAmount: number, brackets: TaxBracket[]): TaxDetail[] {
    let income = taxableAmount
    let previousLimit = 0
    const details: TaxDetail[] = []

    for (const bracket of brackets) {
      if (income <= 0) break

      const taxableInBracket = Math.min(income, bracket.limit - previousLimit)
      const taxInBracket = Math.round(taxableInBracket * bracket.rate)

      if (taxableInBracket > 0) {
        details.push({
          bracket: `${formatCurrency(previousLimit)} - ${bracket.limit === Infinity ? '∞' : formatCurrency(bracket.limit)}`,
          rate: `${bracket.rate * 100}%`,
          taxableAmount: taxableInBracket,
          tax: taxInBracket
        })
      }

      income -= taxableInBracket
      previousLimit = bracket.limit
    }

    return details
  }

  // Tax details by bracket
  const taxDetails = computed<TaxDetail[]>(() => {
    return getTaxDetailsForBrackets(taxableIncome.value, TAX_BRACKETS.value)
  })

  // Net salary
  const netSalary = computed<number>(() => {
    return grossSalary.value - totalInsurance.value - taxAmount.value
  })

  // Comparison with pre-2026 rates (deduction + old tax brackets)
  const comparison = computed<ComparisonResult>(() => {
    // Pre-2026 calculations (old deductions + old tax brackets)
    const pre2026PersonalDeduction = PERSONAL_DEDUCTION_PRE2026
    const pre2026DependentsDeduction = dependents.value * DEPENDENT_DEDUCTION_PRE2026
    const pre2026TotalDeductions = pre2026PersonalDeduction + pre2026DependentsDeduction + otherDeductions.value
    const pre2026TaxableIncome = Math.max(0, incomeBeforeTax.value - pre2026TotalDeductions)
    const pre2026TaxAmount = calculateTaxWithBrackets(pre2026TaxableIncome, TAX_BRACKETS_OLD)
    const pre2026NetSalary = grossSalary.value - totalInsurance.value - pre2026TaxAmount

    // Current calculations (new deductions + current tax brackets)
    const currentPersonalDeduction = PERSONAL_DEDUCTION
    const currentDependentsDeduction = dependents.value * DEPENDENT_DEDUCTION
    const currentTotalDeductions = currentPersonalDeduction + currentDependentsDeduction + otherDeductions.value
    const currentTaxableIncome = taxableIncome.value
    const currentTaxAmount = taxAmount.value
    const currentNetSalary = netSalary.value

    // Differences
    const deductionsDiff = currentTotalDeductions - pre2026TotalDeductions
    const taxableIncomeDiff = currentTaxableIncome - pre2026TaxableIncome
    const taxSaved = pre2026TaxAmount - currentTaxAmount
    const netSalaryGain = currentNetSalary - pre2026NetSalary

    return {
      pre2026: {
        personalDeduction: pre2026PersonalDeduction,
        dependentsDeduction: pre2026DependentsDeduction,
        totalDeductions: pre2026TotalDeductions,
        taxableIncome: pre2026TaxableIncome,
        taxAmount: pre2026TaxAmount,
        netSalary: pre2026NetSalary
      },
      current: {
        personalDeduction: currentPersonalDeduction,
        dependentsDeduction: currentDependentsDeduction,
        totalDeductions: currentTotalDeductions,
        taxableIncome: currentTaxableIncome,
        taxAmount: currentTaxAmount,
        netSalary: currentNetSalary
      },
      difference: {
        deductions: deductionsDiff,
        taxableIncome: taxableIncomeDiff,
        taxSaved: taxSaved,
        netSalaryGain: netSalaryGain
      }
    }
  })

  // Actions
  function setGrossSalary(value: number | null): void {
    grossSalary.value = Math.max(0, Number(value) || 0)
  }

  function setDependents(value: number | null): void {
    dependents.value = Math.max(0, Math.floor(Number(value) || 0))
  }

  function setOtherDeductions(value: number | null): void {
    otherDeductions.value = Math.max(0, Number(value) || 0)
  }

  function setShowComparison(value: boolean): void {
    showComparison.value = value
  }

  function reset(): void {
    grossSalary.value = 0
    dependents.value = 0
    otherDeductions.value = 0
    showComparison.value = false
  }

  return {
    // State
    grossSalary,
    dependents,
    otherDeductions,
    showComparison,

    // Constants
    PERSONAL_DEDUCTION,
    DEPENDENT_DEDUCTION,
    PERSONAL_DEDUCTION_PRE2026,
    DEPENDENT_DEDUCTION_PRE2026,
    TAX_BRACKETS_OLD,
    TAX_BRACKETS_NEW,

    // Computed
    isNewTaxBrackets,
    TAX_BRACKETS,
    insuranceSalary,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    personalDeduction,
    dependentsDeduction,
    totalDeductions,
    incomeBeforeTax,
    taxableIncome,
    taxAmount,
    taxDetails,
    netSalary,
    comparison,

    // Actions
    setGrossSalary,
    setDependents,
    setOtherDeductions,
    setShowComparison,
    reset,
    formatCurrency
  }
})
