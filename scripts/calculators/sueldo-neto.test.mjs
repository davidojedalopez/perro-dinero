import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import { calculateSueldoNeto } from './sueldo-neto.mjs';

const require = createRequire(import.meta.url);
const mexicoFinanceData = require('../../lib/mexico-finance/data/legal/2026/sueldo-neto.json');

function defaultInput(overrides = {}) {
  return {
    grossAmountCents: 3000000,
    frequency: 'monthly',
    year: 2026,
    month: 6,
    zone: 'general',
    imssCovered: true,
    otherDeductionsCents: 0,
    benefits: {
      aguinaldoDays: 15,
      vacationDays: 12,
      vacationPremiumBps: 2500,
    },
    ...overrides,
  };
}

describe('calculateSueldoNeto', () => {
  it('matches the researched MXN 30,000 gross monthly example', () => {
    const result = calculateSueldoNeto(defaultInput(), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.netPayCents, 2464903);
    assert.equal(result.isr.beforeSubsidyCents, 451965);
    assert.equal(result.isr.subsidyAppliedCents, 0);
    assert.equal(result.isr.withheldCents, 451965);
    assert.equal(result.imss.totalCents, 83132);
    assert.equal(result.effectiveWithholdingBps, 1784);
    assert.equal(result.isr.bracket.lowerCents, 1753365);
    assert.equal(result.isr.bracket.percentBps, 2136);
  });

  it('matches the researched MXN 10,000 gross monthly example with subsidy', () => {
    const result = calculateSueldoNeto(defaultInput({ grossAmountCents: 1000000 }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.netPayCents, 955742);
    assert.equal(result.isr.beforeSubsidyCents, 72902);
    assert.equal(result.isr.subsidyAppliedCents, 53565);
    assert.equal(result.isr.withheldCents, 19337);
    assert.equal(result.imss.totalCents, 24921);
    assert.equal(result.warnings.some((warning) => warning.code === 'subsidy_dof_discrepancy'), true);
  });

  it('prorates the 2026 subsidy for quincenal payroll and keeps the period table explicit', () => {
    const result = calculateSueldoNeto(defaultInput({
      grossAmountCents: 500000,
      frequency: 'biweekly',
    }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.period.days, 15);
    assert.equal(result.period.label, 'quincena');
    assert.equal(result.isr.subsidyAppliedCents, 26430);
    assert.equal(result.sources.includes('isr-salarios.2026.anexo8'), true);
  });

  it('uses the January 2026 transitory subsidy rule', () => {
    const result = calculateSueldoNeto(defaultInput({ grossAmountCents: 1000000, month: 1 }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.isr.subsidyAppliedCents, 53621);
    assert.equal(result.isr.withheldCents, 19281);
    assert.equal(result.warnings.some((warning) => warning.code === 'subsidy_january_transitory'), true);
  });

  it('caps known SBC overrides at 25 UMA and reports the adjustment', () => {
    const result = calculateSueldoNeto(defaultInput({
      grossAmountCents: 50000000,
      sbcDailyOverrideCents: 500000,
    }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.sbc.displayDailyCents, 293275);
    assert.equal(result.warnings.some((warning) => warning.code === 'sbc_capped_25_uma'), true);
  });

  it('floors estimated SBC to the selected minimum wage zone', () => {
    const result = calculateSueldoNeto(defaultInput({
      grossAmountCents: 500000,
      frequency: 'monthly',
      zone: 'border',
    }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.sbc.displayDailyCents, 44087);
    assert.equal(result.warnings.some((warning) => warning.code === 'sbc_minimum_wage_floor'), true);
  });

  it('does not withhold ISR for salaries at or below the selected minimum wage', () => {
    const result = calculateSueldoNeto(defaultInput({
      grossAmountCents: mexicoFinanceData.minimum_wage.general.monthly_cents,
      zone: 'general',
    }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.isr.minimumWageExempt, true);
    assert.equal(result.isr.withheldCents, 0);
    assert.equal(result.isr.withheldBeforeMinimumWageExemptionCents > 0, true);
    assert.equal(result.warnings.some((warning) => warning.code === 'minimum_wage_isr_exempt'), true);
  });

  it('lets users disable IMSS when the income is not on a formal payroll', () => {
    const result = calculateSueldoNeto(defaultInput({ imssCovered: false }), mexicoFinanceData);

    assert.equal(result.valid, true);
    assert.equal(result.imss.totalCents, 0);
    assert.equal(result.netPayCents, 2548035);
  });

  it('returns validation errors instead of silently coercing invalid money', () => {
    const result = calculateSueldoNeto(defaultInput({ grossAmountCents: 0 }), mexicoFinanceData);

    assert.equal(result.valid, false);
    assert.equal(result.errors[0].code, 'gross_required');
  });

  it('rejects invalid optional money fields instead of ignoring them', () => {
    const invalidOtherDeductions = calculateSueldoNeto(defaultInput({ otherDeductionsCents: Number.NaN }), mexicoFinanceData);
    const invalidSbc = calculateSueldoNeto(defaultInput({ sbcDailyOverrideCents: Number.NaN }), mexicoFinanceData);

    assert.equal(invalidOtherDeductions.valid, false);
    assert.equal(invalidOtherDeductions.errors[0].code, 'other_deductions_invalid');
    assert.equal(invalidSbc.valid, false);
    assert.equal(invalidSbc.errors[0].code, 'sbc_invalid');
  });
});
