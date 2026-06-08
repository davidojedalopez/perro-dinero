import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateRentVsBuy, validateRentVsBuyInputs } from './rent-vs-buy.mjs';

const baseInputs = {
  purchasePrice: 3_000_000,
  currentMonthlyRent: 15_000,
  downPaymentPct: 20,
  mortgageTermYears: 20,
  mortgageNominalAnnualRatePct: 10.5,
  catPct: 13.1,
  closingCostPct: 6,
  ownerAnnualTaxInsurancePct: 0.3,
  maintenanceAnnualPct: 1,
  homeAppreciationAnnualPct: 4,
  rentGrowthAnnualPct: 5,
  opportunityReturnAnnualPct: 8,
  sellingCostPct: 4,
  comparisonHorizonYears: 10,
};

function assertClose(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test('research sample reproduces the rent-vs-buy scenario within display rounding tolerance', () => {
  const result = simulateRentVsBuy(baseInputs);

  assertClose(result.payment.monthlyMortgagePayment, 23_961, 2, 'monthly mortgage payment');
  assertClose(result.endState.remainingLoanBalance, 1_775_753, 2_000, 'remaining balance');
  assertClose(result.endState.homeValue, 4_440_733, 2_000, 'home value');
  assertClose(result.endState.buyerNetEquity, 2_487_351, 2_000, 'buyer equity');
  assertClose(result.endState.renterNetWorth, 3_328_916, 2_500, 'renter net worth');
  assertClose(result.endState.differenceBuyMinusRent, -841_565, 3_000, 'buy minus rent');
  assert.equal(result.verdict, 'rent');
  assert.equal(result.payment.catUsedForAmortization, false);
});

test('zero-rate mortgages amortize evenly and stop charging after payoff', () => {
  const result = simulateRentVsBuy({
    ...baseInputs,
    mortgageNominalAnnualRatePct: 0,
    mortgageTermYears: 5,
    comparisonHorizonYears: 10,
  });

  assertClose(result.payment.monthlyMortgagePayment, 40_000, 0.01, 'zero-rate payment');
  assertClose(result.endState.remainingLoanBalance, 0, 0.01, 'paid-off balance');
  assert.ok(result.timeline.at(-1).mortgagePayment === 0);
});

test('CAT is reported as informational and does not change amortization', () => {
  const withoutCat = simulateRentVsBuy({ ...baseInputs, catPct: 0 });
  const withCat = simulateRentVsBuy({ ...baseInputs, catPct: 80 });

  assert.equal(withCat.payment.catPct, 80);
  assert.equal(withCat.payment.catUsedForAmortization, false);
  assert.equal(withoutCat.payment.monthlyMortgagePayment, withCat.payment.monthlyMortgagePayment);
  assert.ok(withCat.warnings.some((warning) => warning.code === 'cat-informational'));
});

test('negative renter portfolio is allowed but emits a warning', () => {
  const result = simulateRentVsBuy({
    ...baseInputs,
    purchasePrice: 1_000_000,
    currentMonthlyRent: 80_000,
    downPaymentPct: 5,
    closingCostPct: 1,
    opportunityReturnAnnualPct: 0,
  });

  assert.ok(result.endState.renterNetWorth < 0);
  assert.ok(result.warnings.some((warning) => warning.code === 'negative-renter-portfolio'));
});

test('breakeven month is null when one scenario never catches the other in the horizon', () => {
  const result = simulateRentVsBuy({
    ...baseInputs,
    purchasePrice: 5_000_000,
    currentMonthlyRent: 8_000,
    homeAppreciationAnnualPct: 0,
    opportunityReturnAnnualPct: 10,
    comparisonHorizonYears: 3,
  });

  assert.equal(result.breakevenMonth, null);
  assert.equal(result.breakevenLabel, 'No aparece en 3 años');
});

test('validation marks invalid fields without blocking unusual-but-supported scenarios', () => {
  const invalid = validateRentVsBuyInputs({ ...baseInputs, purchasePrice: 0, downPaymentPct: 120 });
  assert.equal(invalid.isValid, false);
  assert.deepEqual(invalid.errors.map((error) => error.field), ['purchasePrice', 'downPaymentPct']);

  const unusual = validateRentVsBuyInputs({ ...baseInputs, currentMonthlyRent: 0, downPaymentPct: 2 });
  assert.equal(unusual.isValid, true);
  assert.ok(unusual.warnings.some((warning) => warning.field === 'currentMonthlyRent'));
  assert.ok(unusual.warnings.some((warning) => warning.field === 'downPaymentPct'));
});
