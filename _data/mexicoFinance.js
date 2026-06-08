const loadBanxico = require('./banxico');
const lifWithholding2026 = require('../lib/mexico-finance/data/legal/2026/lif-withholding.json');
const { SOURCES } = require('../lib/mexico-finance/sources');
const { getStaleStatus } = require('../lib/mexico-finance/stale');

const CETES_TERMS = [
  { id: 'cetes-28', days: 28, label: '28 días / 1 mes', seriesKey: 'cetes_28_days_yield_rate' },
  { id: 'cetes-91', days: 91, label: '91 días / 3 meses', seriesKey: 'cetes_91_days_yield_rate' },
  { id: 'cetes-182', days: 182, label: '182 días / 6 meses', seriesKey: 'cetes_182_days_yield_rate' },
  { id: 'cetes-364', days: 364, label: '364 días / 1 año', seriesKey: 'cetes_364_days_yield_rate' },
];

module.exports = async function mexicoFinanceData() {
  const banxico = await loadBanxico();
  const now = resolveNow(banxico);
  const terms = CETES_TERMS.map((term) => buildTerm(term, banxico, now));

  return {
    calculators: {
      cetesRealReturn: {
        defaultAmount: 10000,
        defaultTermId: 'cetes-28',
        defaultInflationAnnualPercent: '',
        terms,
        withholding: {
          year: lifWithholding2026.year,
          annualRatePercent: lifWithholding2026.annual_rate_percent,
          note: lifWithholding2026.note,
          source: SOURCES.lif2026,
        },
        assumptions: {
          nominalTitleValue: 10,
          cetesDayCountBase: 360,
          isrDayCountBase: 365,
          minAmount: 100,
          maxAmount: 10000000,
          remnant: 'El remanente no se invierte en BONDDIA en esta versión.',
        },
        sources: [
          SOURCES.banxicoCetes,
          SOURCES.cetesdirecto,
          SOURCES.lif2026,
          SOURCES.lisr,
          SOURCES.inegiInpc,
        ],
      },
    },
  };
};

function buildTerm(config, banxico, now) {
  const series = banxico[config.seriesKey] || {};
  return {
    ...config,
    annualRatePercent: Number(series.amount),
    source: {
      kind: 'banxico',
      name: SOURCES.banxicoCetes.name,
      url: SOURCES.banxicoCetes.url,
      seriesId: series.series_id,
      observedAt: series.updated_at_friendly || series.udpated_at || '',
      observedAtEpoch: series.updated_at_epoch,
      consultedAt: series.consulted_at_friendly || series.consulted_at || '',
      description: series.description || SOURCES.banxicoCetes.description,
    },
    stale: getStaleStatus({
      observedAtEpoch: series.updated_at_epoch,
      warningAgeDays: 7,
      maxAgeDays: 14,
      now,
    }),
  };
}

function resolveNow(banxico) {
  if (process.env.BANXICO_OFFLINE === 'true') {
    const epochs = Object.values(banxico)
      .map((series) => series.consulted_at_epoch)
      .filter(Number.isFinite);
    return epochs.length > 0 ? Math.max(...epochs) : Date.now();
  }
  return Date.now();
}
