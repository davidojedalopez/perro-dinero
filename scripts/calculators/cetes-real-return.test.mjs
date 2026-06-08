import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCetesRealReturn } from './cetes-real-return.mjs';

const sampleData = {
  withholding: {
    annualRatePercent: 0.9,
    year: 2026,
  },
  terms: [
    {
      id: 'cetes-28',
      days: 28,
      label: '28 días / 1 mes',
      annualRatePercent: 6.36,
      source: {
        kind: 'banxico',
        name: 'Banxico SIE',
        observedAt: '4 jun 2026',
      },
    },
    {
      id: 'cetes-364',
      days: 364,
      label: '364 días / 1 año',
      annualRatePercent: 7.16,
      source: {
        kind: 'banxico',
        name: 'Banxico SIE',
        observedAt: '28 may 2026',
      },
    },
  ],
};

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

test('calculates gross interest, provisional ISR, net nominal return, and real return for CETES 364 days', () => {
  const result = calculateCetesRealReturn({
    amount: 10000,
    termId: 'cetes-364',
    annualRatePercent: 7.16,
    inflationAnnualPercent: 4,
  }, sampleData);

  assert.equal(result.ok, true);
  assert.equal(result.term.days, 364);
  assert.equal(result.titles, 1072);
  assert.equal(roundMoney(result.titlePrice), 9.32);
  assert.equal(roundMoney(result.effectiveInvestment), 9996.31);
  assert.equal(roundMoney(result.uninvestedRemainder), 3.69);
  assert.equal(roundMoney(result.grossInterest), 723.69);
  assert.equal(roundMoney(result.withholding), 89.72);
  assert.equal(roundMoney(result.netInterest), 633.97);
  assert.equal(roundMoney(result.maturityTotal), 10633.97);
  assert.equal(roundMoney(result.netNominalReturnPeriodPercent), 6.34);
  assert.equal(roundMoney(result.inflationPeriodPercent), 3.99);
  assert.equal(roundMoney(result.realReturnPeriodPercent), 2.26);
  assert.equal(result.source.kind, 'banxico');
  assert.match(result.summary, /10,633\.97/);
});

test('uses a 360-day base for CETES price and 365-day base for ISR withholding', () => {
  const result = calculateCetesRealReturn({
    amount: 10000,
    termId: 'cetes-28',
    annualRatePercent: 6.36,
    inflationAnnualPercent: 4,
  }, sampleData);

  const expectedPrice = 10 / (1 + (0.0636 * 28 / 360));
  const expectedWithholding = result.effectiveInvestment * 0.009 * 28 / 365;

  assert.equal(result.ok, true);
  assert.equal(result.term.days, 28);
  assert.equal(result.cetesDayCountBase, 360);
  assert.equal(result.isrDayCountBase, 365);
  assert.equal(roundMoney(result.titlePrice), roundMoney(expectedPrice));
  assert.equal(roundMoney(result.withholding), roundMoney(expectedWithholding));
});

test('keeps nominal calculation when inflation is blank', () => {
  const result = calculateCetesRealReturn({
    amount: 10000,
    termId: 'cetes-28',
    annualRatePercent: 6.36,
    inflationAnnualPercent: '',
  }, sampleData);

  assert.equal(result.ok, true);
  assert.equal(result.realReturnPeriodPercent, null);
  assert.equal(result.inflationPeriodPercent, null);
  assert.match(result.messages[0], /Agrega inflación/);
});

test('marks edited CETES rates as manual source attribution', () => {
  const result = calculateCetesRealReturn({
    amount: 10000,
    termId: 'cetes-28',
    annualRatePercent: 8,
    inflationAnnualPercent: 4,
  }, sampleData);

  assert.equal(result.ok, true);
  assert.equal(result.source.kind, 'manual');
  assert.match(result.source.note, /tasa manual/i);
});

test('returns field-level validation errors for invalid inputs', () => {
  const result = calculateCetesRealReturn({
    amount: 50,
    termId: 'cetes-999',
    annualRatePercent: -1,
    inflationAnnualPercent: 101,
    withholdingAnnualRatePercent: 11,
  }, sampleData);

  assert.equal(result.ok, false);
  assert.deepEqual(Object.keys(result.errors).sort(), [
    'amount',
    'annualRatePercent',
    'inflationAnnualPercent',
    'termId',
    'withholdingAnnualRatePercent',
  ]);
  assert.match(result.errors.amount, /mínimo/i);
});
