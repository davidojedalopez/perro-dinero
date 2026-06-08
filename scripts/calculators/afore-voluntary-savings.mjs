export const DEFAULT_AFORE_DATA = Object.freeze({
  calculationYear: 2026,
  uma: {
    daily: 117.31,
    monthly: 3566.22,
    annual: 42794.64,
    source: {
      name: 'INEGI UMA 2026',
      url: 'https://www.inegi.org.mx/temas/uma/',
      retrievedAt: '2026-06-07',
    },
  },
  lssRcv: {
    minimumWageMonthly: 315.04 * 30,
    employerRetiroRate: 0.02,
    workerCevRate: 0.01125,
    employerCevRatesByYear: {
      2026: [
        { key: '1.00 SM', maxUmaMonthlyMultiple: null, rate: 0.03150 },
        { key: '1.01 SM a 1.50 UMA', maxUmaMonthlyMultiple: 1.5, rate: 0.03676 },
        { key: '1.51 a 2.00 UMA', maxUmaMonthlyMultiple: 2, rate: 0.04851 },
        { key: '2.01 a 2.50 UMA', maxUmaMonthlyMultiple: 2.5, rate: 0.05556 },
        { key: '2.51 a 3.00 UMA', maxUmaMonthlyMultiple: 3, rate: 0.06026 },
        { key: '3.01 a 3.50 UMA', maxUmaMonthlyMultiple: 3.5, rate: 0.06361 },
        { key: '3.51 a 4.00 UMA', maxUmaMonthlyMultiple: 4, rate: 0.06613 },
        { key: '4.01 UMA o más', maxUmaMonthlyMultiple: Infinity, rate: 0.07513 },
      ],
    },
    source: {
      name: 'Ley del Seguro Social, Art. 168 y decreto transitorio DOF 16-12-2020',
      url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf',
      retrievedAt: '2026-06-07',
    },
  },
  infonavit: {
    viviendaRate: 0.05,
    source: {
      name: 'Ley INFONAVIT, Art. 29-II',
      url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LIFNVT.pdf',
      retrievedAt: '2026-06-07',
    },
  },
  assumptions: {
    defaultNetRealReturnAccumulation: 0.04,
    defaultRealReturnRetirement: 0.02,
    defaultReplacementRate: 0.70,
    defaultPayoutYears: 20,
    contributionTiming: 'end_of_month',
  },
  sources: [
    { name: 'AforeWeb / CONSAR', url: 'https://www.aforeweb.com.mx/calculadora', note: 'Referencia de calculadoras oficiales; esta herramienta no replica su fórmula privada.' },
    { name: 'Ley del Seguro Social', url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf', note: 'Componentes RCV, cuenta individual, cuota social y caveats de pensión garantizada.' },
    { name: 'INEGI UMA', url: 'https://www.inegi.org.mx/temas/uma/', note: 'UMA 2026 usada para clasificar salarios frente al umbral de 4 UMA.' },
    { name: 'Ley INFONAVIT', url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LIFNVT.pdf', note: 'Aportación patronal de vivienda de 5% si el usuario activa ese escenario.' },
    { name: 'Ley ISR', url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf', note: 'Caveat fiscal de aportaciones voluntarias; esta calculadora no estima beneficio fiscal.' },
  ],
});

const EPSILON = 1e-10;

export function calculateAforeVoluntarySavings(rawInputs = {}, data = DEFAULT_AFORE_DATA) {
  const inputs = normalizeInputs(rawInputs, data);
  const errors = validateInputs(inputs);

  if (errors.length > 0) {
    return emptyResult(inputs, errors);
  }

  const warnings = [];
  const monthsToRetirement = (inputs.edadRetiro - inputs.edadActual) * 12;
  const payoutMonths = inputs.aniosRetiroAFinanciar * 12;
  const monthlyAccumulationReturn = annualToMonthlyRate(inputs.rendimientoRealAnualNetoAcumulacion);
  const monthlyRetirementReturn = annualToMonthlyRate(inputs.rendimientoRealAnualRetiro);
  const accumulationFactor = futureValueDepositFactor(monthlyAccumulationReturn, monthsToRetirement);
  const payoutFactor = presentValuePayoutFactor(monthlyRetirementReturn, payoutMonths);
  const contributionRates = resolveContributionRates(inputs, data, warnings);

  const mandatoryMonthly = inputs.salarioMensualSbc * (
    contributionRates.employerRetiroRate
    + contributionRates.workerCevRate
    + contributionRates.employerCevRate
  ) + contributionRates.socialQuotaMonthly + contributionRates.viviendaMonthly;

  const futureValueCurrentBalance = inputs.saldoActualAfore * ((1 + monthlyAccumulationReturn) ** monthsToRetirement);
  const projectedBalanceBeforeVoluntary = futureValueCurrentBalance + mandatoryMonthly * accumulationFactor;
  const projectedBalanceWithCurrentVoluntary = projectedBalanceBeforeVoluntary
    + inputs.aportacionVoluntariaActualMensual * accumulationFactor;

  const targetMonthlyIncome = inputs.modoMeta === 'income'
    ? inputs.ingresoMensualDeseado
    : inputs.salarioMensualSbc * inputs.tasaReemplazoDeseada;
  const targetCapital = targetMonthlyIncome * payoutFactor;
  const totalVoluntaryCapitalGap = Math.max(0, targetCapital - projectedBalanceBeforeVoluntary);
  const totalVoluntaryMonthlyNeeded = totalVoluntaryCapitalGap > 0
    ? totalVoluntaryCapitalGap / accumulationFactor
    : 0;
  const capitalGapAfterCurrentSavings = Math.max(0, targetCapital - projectedBalanceWithCurrentVoluntary);
  const additionalVoluntaryMonthlyNeeded = capitalGapAfterCurrentSavings > 0
    ? capitalGapAfterCurrentSavings / accumulationFactor
    : 0;
  const estimatedMonthlyIncome = projectedBalanceWithCurrentVoluntary / payoutFactor;
  const estimatedReplacementRate = inputs.salarioMensualSbc > 0
    ? estimatedMonthlyIncome / inputs.salarioMensualSbc
    : 0;

  if (additionalVoluntaryMonthlyNeeded > inputs.salarioMensualSbc * 0.5) {
    warnings.push({
      code: 'high_required_contribution',
      message: 'La aportación estimada es muy alta frente al salario/SBC; puede indicar meta agresiva, poco tiempo o supuestos conservadores.',
    });
  }

  return {
    ok: true,
    errors: [],
    warnings,
    inputs,
    assumptions: {
      calculationYear: data.calculationYear,
      monthsToRetirement,
      payoutMonths,
      monthlyAccumulationReturn,
      monthlyRetirementReturn,
      accumulationFactor,
      payoutFactor,
      contributionTiming: data.assumptions?.contributionTiming || 'end_of_month',
    },
    contributions: {
      mandatoryMonthly,
      employerRetiroRate: contributionRates.employerRetiroRate,
      workerCevRate: contributionRates.workerCevRate,
      employerCevRate: contributionRates.employerCevRate,
      employerCevBracket: contributionRates.employerCevBracket,
      socialQuotaMonthly: contributionRates.socialQuotaMonthly,
      viviendaMonthly: contributionRates.viviendaMonthly,
    },
    projection: {
      futureValueCurrentBalance,
      projectedBalanceBeforeVoluntary,
      projectedBalanceWithoutAdditionalVoluntary: projectedBalanceWithCurrentVoluntary,
      estimatedMonthlyIncome,
      estimatedReplacementRate,
    },
    target: { targetMonthlyIncome, targetCapital },
    required: {
      totalVoluntaryMonthlyNeeded: cleanTiny(totalVoluntaryMonthlyNeeded),
      additionalVoluntaryMonthlyNeeded: cleanTiny(additionalVoluntaryMonthlyNeeded),
      totalVoluntaryCapitalGap: cleanTiny(totalVoluntaryCapitalGap),
      capitalGapAfterCurrentSavings: cleanTiny(capitalGapAfterCurrentSavings),
    },
    sources: data.sources || [],
  };
}

function normalizeInputs(rawInputs, data) {
  const assumptions = data.assumptions || {};
  const modoMeta = ['income', 'ingreso'].includes(rawInputs.modoMeta) ? 'income' : 'replacement';

  return {
    edadActual: toInteger(rawInputs.edadActual, 35),
    edadRetiro: toInteger(rawInputs.edadRetiro, 65),
    saldoActualAfore: toNumber(rawInputs.saldoActualAfore, 100000),
    salarioMensualSbc: toNumber(rawInputs.salarioMensualSbc, 30000),
    aportacionVoluntariaActualMensual: toNumber(rawInputs.aportacionVoluntariaActualMensual, 0),
    modoMeta,
    ingresoMensualDeseado: toNumber(rawInputs.ingresoMensualDeseado, 21000),
    tasaReemplazoDeseada: toDecimalRate(rawInputs.tasaReemplazoDeseada, assumptions.defaultReplacementRate ?? 0.70),
    rendimientoRealAnualNetoAcumulacion: toDecimalRate(rawInputs.rendimientoRealAnualNetoAcumulacion, assumptions.defaultNetRealReturnAccumulation ?? 0.04),
    rendimientoRealAnualRetiro: toDecimalRate(rawInputs.rendimientoRealAnualRetiro, assumptions.defaultRealReturnRetirement ?? 0.02),
    aniosRetiroAFinanciar: toNumber(rawInputs.aniosRetiroAFinanciar, assumptions.defaultPayoutYears ?? 20),
    incluirVivienda: Boolean(rawInputs.incluirVivienda),
  };
}

function validateInputs(inputs) {
  const errors = [];
  if (!Number.isInteger(inputs.edadActual) || inputs.edadActual < 18) errors.push({ field: 'edadActual', message: 'Escribe una edad actual válida de 18 años o más.' });
  if (!Number.isInteger(inputs.edadRetiro) || inputs.edadRetiro <= inputs.edadActual) errors.push({ field: 'edadRetiro', message: 'La edad de retiro debe ser mayor que tu edad actual.' });
  else if ((inputs.edadRetiro - inputs.edadActual) * 12 < 12) errors.push({ field: 'edadRetiro', message: 'Necesitamos al menos 12 meses entre hoy y tu retiro para estimar aportaciones mensuales.' });
  for (const field of ['saldoActualAfore', 'aportacionVoluntariaActualMensual']) {
    if (!Number.isFinite(inputs[field]) || inputs[field] < 0) errors.push({ field, message: 'Usa un monto en pesos igual o mayor a cero.' });
  }
  if (!Number.isFinite(inputs.salarioMensualSbc) || inputs.salarioMensualSbc <= 0) errors.push({ field: 'salarioMensualSbc', message: 'Para estimar aportaciones obligatorias necesitamos un salario/SBC mayor a cero.' });
  if (inputs.modoMeta === 'income' && (!Number.isFinite(inputs.ingresoMensualDeseado) || inputs.ingresoMensualDeseado <= 0)) errors.push({ field: 'ingresoMensualDeseado', message: 'Escribe un ingreso mensual deseado mayor a cero.' });
  if (inputs.modoMeta === 'replacement' && (!Number.isFinite(inputs.tasaReemplazoDeseada) || inputs.tasaReemplazoDeseada < 0.01 || inputs.tasaReemplazoDeseada > 2)) errors.push({ field: 'tasaReemplazoDeseada', message: 'Usa una tasa de reemplazo entre 1% y 200%.' });
  if (!Number.isFinite(inputs.rendimientoRealAnualNetoAcumulacion) || inputs.rendimientoRealAnualNetoAcumulacion < -0.10 || inputs.rendimientoRealAnualNetoAcumulacion > 0.15) errors.push({ field: 'rendimientoRealAnualNetoAcumulacion', message: 'Usa una tasa real anual neta entre -10% y 15%.' });
  if (!Number.isFinite(inputs.rendimientoRealAnualRetiro) || inputs.rendimientoRealAnualRetiro < -0.10 || inputs.rendimientoRealAnualRetiro > 0.10) errors.push({ field: 'rendimientoRealAnualRetiro', message: 'Usa una tasa real anual durante retiro entre -10% y 10%.' });
  if (!Number.isFinite(inputs.aniosRetiroAFinanciar) || inputs.aniosRetiroAFinanciar < 1 || inputs.aniosRetiroAFinanciar > 50) errors.push({ field: 'aniosRetiroAFinanciar', message: 'Usa un plazo de retiro entre 1 y 50 años.' });
  return errors;
}

function resolveContributionRates(inputs, data, warnings) {
  const employerCev = resolveEmployerCevRate(inputs.salarioMensualSbc, data);
  const umaMonthly = data.uma?.monthly || Infinity;
  const salaryUmaMultiple = inputs.salarioMensualSbc / umaMonthly;
  const socialQuotaMonthly = 0;

  if (salaryUmaMultiple <= 4) {
    warnings.push({
      code: 'social_quota_not_modeled',
      message: 'La cuota social puede aplicar hasta 4 UMA, pero esta versión no usa una tabla trimestral vigente; no se incluye para evitar usar datos viejos.',
    });
  }

  const viviendaMonthly = inputs.incluirVivienda ? inputs.salarioMensualSbc * (data.infonavit?.viviendaRate ?? 0.05) : 0;
  if (inputs.incluirVivienda) {
    warnings.push({
      code: 'vivienda_caveat',
      message: 'Incluimos 5% de SBC como vivienda, pero esta subcuenta puede cambiar si tienes crédito Infonavit o reglas particulares.',
    });
  }

  return {
    employerRetiroRate: data.lssRcv?.employerRetiroRate ?? 0.02,
    workerCevRate: data.lssRcv?.workerCevRate ?? 0.01125,
    employerCevRate: employerCev.rate,
    employerCevBracket: employerCev.bracket,
    socialQuotaMonthly,
    viviendaMonthly,
  };
}

function resolveEmployerCevRate(monthlySalary, data) {
  const year = data.calculationYear || 2026;
  const rates = data.lssRcv?.employerCevRatesByYear?.[year] || data.lssRcv?.employerCevRatesByYear?.[String(year)] || [];
  const umaMonthly = data.uma?.monthly || 1;
  const salaryUmaMultiple = monthlySalary / umaMonthly;
  const minimumWageMonthly = data.lssRcv?.minimumWageMonthly || 0;
  const minimumWageBracket = rates.find((entry) => entry.maxUmaMonthlyMultiple === null);
  const bracket = (minimumWageBracket && minimumWageMonthly > 0 && monthlySalary <= minimumWageMonthly
    ? minimumWageBracket
    : null)
    || rates.find((entry) => Number.isFinite(entry.maxUmaMonthlyMultiple) && salaryUmaMultiple <= entry.maxUmaMonthlyMultiple)
    || rates.find((entry) => entry.maxUmaMonthlyMultiple === Infinity)
    || rates.at(-1)
    || { key: '4.01 UMA o más', rate: 0.07513 };
  return { rate: bracket.rate, bracket: bracket.key };
}

function annualToMonthlyRate(annualRate) {
  return Math.abs(annualRate) <= EPSILON ? 0 : ((1 + annualRate) ** (1 / 12)) - 1;
}

function futureValueDepositFactor(monthlyRate, months) {
  return Math.abs(monthlyRate) <= EPSILON ? months : (((1 + monthlyRate) ** months) - 1) / monthlyRate;
}

function presentValuePayoutFactor(monthlyRate, months) {
  return Math.abs(monthlyRate) <= EPSILON ? months : (1 - ((1 + monthlyRate) ** -months)) / monthlyRate;
}

function emptyResult(inputs, errors) {
  return { ok: false, errors, warnings: [], inputs, assumptions: {}, contributions: {}, projection: {}, target: {}, required: {}, sources: [] };
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function toDecimalRate(value, fallback) {
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed / 100 : fallback;
  }
  const parsed = toNumber(value, fallback);
  return Math.abs(parsed) >= 1 ? parsed / 100 : parsed;
}

function cleanTiny(value) {
  return Math.abs(value) < 0.000001 ? 0 : value;
}
