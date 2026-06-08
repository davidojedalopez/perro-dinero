import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateAforeVoluntarySavings,
  DEFAULT_AFORE_DATA,
} from './afore-voluntary-savings.mjs';

const sampleInputs = {
  edadActual: 35,
  edadRetiro: 65,
  saldoActualAfore: 100000,
  salarioMensualSbc: 30000,
  aportacionVoluntariaActualMensual: 0,
  modoMeta: 'replacement',
  tasaReemplazoDeseada: 0.70,
  rendimientoRealAnualNetoAcumulacion: 0.04,
  rendimientoRealAnualRetiro: 0.02,
  aniosRetiroAFinanciar: 20,
  incluirVivienda: false,
};

function assertWithin(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test('worked AFORE sample matches the researched real-peso scenario', () => {
  const result = calculateAforeVoluntarySavings(sampleInputs, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.contributions.socialQuotaMonthly, 0);
  assert.equal(result.contributions.employerCevRate, 0.07513);
  assertWithin(result.contributions.mandatoryMonthly, 3191.4, 0.01, 'mandatory monthly RCV');
  assertWithin(result.projection.projectedBalanceWithoutAdditionalVoluntary, 2511312, 2000, 'projected balance');
  assertWithin(result.projection.estimatedMonthlyIncome, 12683, 20, 'estimated monthly income');
  assertWithin(result.target.targetCapital, 4158198, 2000, 'target capital');
  assertWithin(result.required.totalVoluntaryMonthlyNeeded, 2403, 20, 'required voluntary monthly');
  assertWithin(result.required.additionalVoluntaryMonthlyNeeded, 2403, 20, 'additional voluntary monthly');
});

test('current voluntary savings reduce only the additional amount needed', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    aportacionVoluntariaActualMensual: 800,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assertWithin(result.required.totalVoluntaryMonthlyNeeded, 2403, 20, 'total monthly voluntary need');
  assertWithin(result.required.additionalVoluntaryMonthlyNeeded, 1603, 20, 'additional monthly voluntary need');
});

test('already-on-target scenarios never return a negative contribution', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    saldoActualAfore: 5000000,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.required.totalVoluntaryMonthlyNeeded, 0);
  assert.equal(result.required.additionalVoluntaryMonthlyNeeded, 0);
  assert.equal(result.required.capitalGapAfterCurrentSavings, 0);
});

test('zero return assumptions do not divide by zero', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    rendimientoRealAnualNetoAcumulacion: 0,
    rendimientoRealAnualRetiro: 0,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.assumptions.monthsToRetirement, 360);
  assert.equal(result.assumptions.payoutMonths, 240);
  assert.ok(Number.isFinite(result.required.totalVoluntaryMonthlyNeeded));
  assert.ok(Number.isFinite(result.projection.estimatedMonthlyIncome));
});

test('invalid ages return structured validation errors instead of throwing', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    edadActual: 65,
    edadRetiro: 65,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.field === 'edadRetiro'));
});

test('one-percent UI inputs are parsed as 1%, not 100%', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    tasaReemplazoDeseada: '1',
    rendimientoRealAnualNetoAcumulacion: '1',
    rendimientoRealAnualRetiro: '-1',
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.inputs.tasaReemplazoDeseada, 0.01);
  assert.equal(result.inputs.rendimientoRealAnualNetoAcumulacion, 0.01);
  assert.equal(result.inputs.rendimientoRealAnualRetiro, -0.01);
});

test('sub-one-percent UI strings are parsed as percentages', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    rendimientoRealAnualNetoAcumulacion: '0.5',
    rendimientoRealAnualRetiro: '-0.5',
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.inputs.rendimientoRealAnualNetoAcumulacion, 0.005);
  assert.equal(result.inputs.rendimientoRealAnualRetiro, -0.005);
});

test('low salaries warn when current social-quota data is not modeled', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    salarioMensualSbc: 10000,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.contributions.socialQuotaMonthly, 0);
  assert.ok(result.warnings.some((warning) => warning.code === 'social_quota_not_modeled'));
});

test('one-minimum-wage salaries use the explicit 1 SM employer CEV bracket', () => {
  const result = calculateAforeVoluntarySavings({
    ...sampleInputs,
    salarioMensualSbc: DEFAULT_AFORE_DATA.lssRcv.minimumWageMonthly,
  }, DEFAULT_AFORE_DATA);

  assert.equal(result.ok, true);
  assert.equal(result.contributions.employerCevBracket, '1.00 SM');
  assert.equal(result.contributions.employerCevRate, 0.03150);
});

test('vivienda toggle adds 5% of SBC and marks the caveat', () => {
  const withoutVivienda = calculateAforeVoluntarySavings(sampleInputs, DEFAULT_AFORE_DATA);
  const withVivienda = calculateAforeVoluntarySavings({
    ...sampleInputs,
    incluirVivienda: true,
  }, DEFAULT_AFORE_DATA);

  assert.equal(withVivienda.ok, true);
  assertWithin(
    withVivienda.contributions.mandatoryMonthly - withoutVivienda.contributions.mandatoryMonthly,
    1500,
    0.01,
    'vivienda contribution',
  );
  assert.ok(withVivienda.warnings.some((warning) => warning.code === 'vivienda_caveat'));
});
