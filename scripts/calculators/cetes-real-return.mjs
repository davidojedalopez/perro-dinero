export const NOMINAL_TITLE_VALUE = 10;
export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 10_000_000;
export const CETES_DAY_COUNT_BASE = 360;
export const ISR_DAY_COUNT_BASE = 365;

const MAX_RATE_PERCENT = 100;
const MAX_INFLATION_PERCENT = 100;
const MIN_INFLATION_PERCENT = -20;
const MAX_WITHHOLDING_PERCENT = 10;

export function calculateCetesRealReturn(input = {}, data = {}) {
  const terms = Array.isArray(data.terms) ? data.terms : [];
  const term = terms.find((item) => item.id === input.termId);
  const withholdingAnnualRatePercent = parsePercent(
    input.withholdingAnnualRatePercent,
    data.withholding?.annualRatePercent ?? 0.9,
  );
  const amount = parseNumber(input.amount);
  const annualRatePercent = parseNumber(input.annualRatePercent);
  const inflationWasProvided = input.inflationAnnualPercent !== ''
    && input.inflationAnnualPercent !== null
    && input.inflationAnnualPercent !== undefined;
  const inflationAnnualPercent = inflationWasProvided ? parseNumber(input.inflationAnnualPercent) : null;
  const errors = {};

  if (!Number.isFinite(amount)) {
    errors.amount = 'Escribe cuánto quieres invertir.';
  } else if (amount < MIN_AMOUNT) {
    errors.amount = 'El monto mínimo para esta estimación es $100.';
  } else if (amount > MAX_AMOUNT) {
    errors.amount = 'Para mantenerlo comparable con Cetesdirecto, usa máximo $10,000,000.';
  }

  if (!term) {
    errors.termId = 'Elige un plazo de la lista.';
  }

  if (!Number.isFinite(annualRatePercent)) {
    errors.annualRatePercent = 'Escribe la tasa anual CETES o vuelve a cargar la tasa de referencia.';
  } else if (annualRatePercent < 0) {
    errors.annualRatePercent = 'La tasa no puede ser negativa en esta versión.';
  } else if (annualRatePercent >= MAX_RATE_PERCENT) {
    errors.annualRatePercent = 'La tasa debe ser menor a 100%.';
  }

  if (inflationWasProvided) {
    if (!Number.isFinite(inflationAnnualPercent)) {
      errors.inflationAnnualPercent = 'Escribe la inflación como porcentaje. Ejemplo: 4.';
    } else if (inflationAnnualPercent < MIN_INFLATION_PERCENT) {
      errors.inflationAnnualPercent = 'Usa una inflación mayor a -20%.';
    } else if (inflationAnnualPercent > MAX_INFLATION_PERCENT) {
      errors.inflationAnnualPercent = 'Usa una inflación menor a 100% para esta versión.';
    }
  }

  if (!Number.isFinite(withholdingAnnualRatePercent)) {
    errors.withholdingAnnualRatePercent = 'Escribe la retención anual o restaura el valor 2026.';
  } else if (withholdingAnnualRatePercent < 0) {
    errors.withholdingAnnualRatePercent = 'La retención no puede ser negativa.';
  } else if (withholdingAnnualRatePercent > MAX_WITHHOLDING_PERCENT) {
    errors.withholdingAnnualRatePercent = 'Usa una retención menor a 10%.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const annualRate = annualRatePercent / 100;
  const withholdingAnnualRate = withholdingAnnualRatePercent / 100;
  const titlePrice = NOMINAL_TITLE_VALUE / (1 + (annualRate * term.days / CETES_DAY_COUNT_BASE));
  const titles = Math.floor(amount / titlePrice);

  if (titles <= 0) {
    return {
      ok: false,
      errors: {
        amount: 'Con este monto no alcanza para comprar títulos de CETES completos.',
      },
    };
  }

  const effectiveInvestment = titles * titlePrice;
  const uninvestedRemainder = amount - effectiveInvestment;
  const maturityBeforeTax = titles * NOMINAL_TITLE_VALUE;
  const grossInterest = maturityBeforeTax - effectiveInvestment;
  const withholding = effectiveInvestment * withholdingAnnualRate * term.days / ISR_DAY_COUNT_BASE;
  const netInterest = grossInterest - withholding;
  const maturityTotal = uninvestedRemainder + maturityBeforeTax - withholding;
  const netNominalReturnPeriodPercent = (maturityTotal / amount - 1) * 100;
  const inflationPeriodPercent = inflationWasProvided
    ? (Math.pow(1 + inflationAnnualPercent / 100, term.days / ISR_DAY_COUNT_BASE) - 1) * 100
    : null;
  const realReturnPeriodPercent = inflationWasProvided
    ? (((1 + netNominalReturnPeriodPercent / 100) / (1 + inflationPeriodPercent / 100)) - 1) * 100
    : null;
  const source = buildSource({ term, annualRatePercent });
  const messages = [];

  if (!inflationWasProvided) {
    messages.push('Agrega inflación para responder la pregunta completa: cuánto ganas en poder de compra.');
  }
  if (withholding > grossInterest) {
    messages.push('La retención estimada es mayor que el interés bruto. Revisa tasa, plazo y retención antes de interpretar el resultado.');
  }
  if (annualRatePercent > 30) {
    messages.push('La tasa suena alta para CETES. Si es intencional, puedes continuar.');
  }
  if (withholdingAnnualRatePercent > 2) {
    messages.push('La retención 2026 es 0.90%; si cambiaste de año o estás comparando otro escenario, trátalo como manual.');
  }

  return {
    ok: true,
    errors: {},
    term,
    source,
    amount,
    titles,
    titlePrice,
    effectiveInvestment,
    uninvestedRemainder,
    grossInterest,
    withholding,
    netInterest,
    maturityTotal,
    maturityBeforeTax,
    annualRatePercent,
    withholdingAnnualRatePercent,
    inflationAnnualPercent: inflationWasProvided ? inflationAnnualPercent : null,
    netNominalReturnPeriodPercent,
    inflationPeriodPercent,
    realReturnPeriodPercent,
    cetesDayCountBase: CETES_DAY_COUNT_BASE,
    isrDayCountBase: ISR_DAY_COUNT_BASE,
    messages,
    summary: buildSummary({
      amount,
      term,
      annualRatePercent,
      withholdingAnnualRatePercent,
      inflationAnnualPercent: inflationWasProvided ? inflationAnnualPercent : null,
      maturityTotal,
      netInterest,
      realReturnPeriodPercent,
    }),
  };
}

function parseNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return Number.NaN;
  }
  const normalized = value.replace(/,/g, '').trim();
  if (!normalized) {
    return Number.NaN;
  }
  return Number.parseFloat(normalized);
}

function parsePercent(value, fallback) {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }
  return parseNumber(value);
}

function nearlyEqual(a, b) {
  return Math.abs(Number(a) - Number(b)) < 0.000001;
}

function buildSource({ term, annualRatePercent }) {
  if (!term || !term.source || !nearlyEqual(term.annualRatePercent, annualRatePercent)) {
    return {
      kind: 'manual',
      name: 'Tasa manual',
      note: 'Tasa manual. Ya no estamos usando el dato de Banxico para este cálculo.',
    };
  }
  return term.source;
}

function buildSummary({ amount, term, annualRatePercent, withholdingAnnualRatePercent, inflationAnnualPercent, maturityTotal, netInterest, realReturnPeriodPercent }) {
  const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
  const base = `Si invierto ${money.format(amount)} en CETES a ${term.days} días con tasa anual de ${percent.format(annualRatePercent)}% y retención ISR de ${percent.format(withholdingAnnualRatePercent)}%, el monto estimado al vencimiento sería ${money.format(maturityTotal)}. Ganancia neta: ${money.format(netInterest)}.`;
  if (inflationAnnualPercent === null) {
    return `${base} Falta capturar inflación para estimar rendimiento real. Esto es una estimación educativa, no recomendación de inversión.`;
  }
  return `${base} Con inflación anual estimada de ${percent.format(inflationAnnualPercent)}%, el rendimiento real del periodo sería ${percent.format(realReturnPeriodPercent)}%. Esto es una estimación educativa, no recomendación de inversión.`;
}
