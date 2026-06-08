const DEFAULT_BENEFITS = Object.freeze({
  aguinaldoDays: 15,
  vacationDays: 12,
  vacationPremiumBps: 2500,
});

function roundCents(value) {
  return Math.round((Number(value) + Number.EPSILON));
}

function toCurrency(value) {
  return Number(value) / 100;
}

export function formatMxn(cents) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toCurrency(cents));
}

export function formatPercentBps(bps) {
  return `${(Number(bps) / 100).toLocaleString('es-MX', { maximumFractionDigits: 2 })}%`;
}

function normalizeBracket(row) {
  return {
    lowerCents: row[0],
    upperCents: row[1],
    fixedQuotaCents: row[2],
    percentBps: row[3],
  };
}

function findBracket(incomeCents, rows) {
  const row = rows.find(([lower, upper]) => incomeCents >= lower && (upper === null || incomeCents <= upper));
  if (!row) return null;
  return normalizeBracket(row);
}

function integrationFactor(benefits = {}) {
  const normalized = { ...DEFAULT_BENEFITS, ...benefits };
  return 1
    + Number(normalized.aguinaldoDays) / 365
    + (Number(normalized.vacationDays) * (Number(normalized.vacationPremiumBps) / 10000)) / 365;
}

function validationError(code, message) {
  return { code, message };
}

function validateInput(input, data) {
  const errors = [];
  if (!Number.isFinite(input.grossAmountCents) || input.grossAmountCents <= 0) {
    errors.push(validationError('gross_required', 'Pon un sueldo bruto mayor a cero.'));
  }
  if (!data.periods[input.frequency]) {
    errors.push(validationError('frequency_unsupported', 'Esa frecuencia todavía no está soportada.'));
  }
  if (!data.minimum_wage[input.zone]) {
    errors.push(validationError('zone_unsupported', 'Selecciona una zona de salario mínimo válida.'));
  }
  if (input.otherDeductionsCents !== undefined && input.otherDeductionsCents !== null) {
    if (!Number.isFinite(input.otherDeductionsCents)) {
      errors.push(validationError('other_deductions_invalid', 'Otros descuentos debe ser un número válido.'));
    } else if (input.otherDeductionsCents < 0) {
      errors.push(validationError('other_deductions_negative', 'Otros descuentos no puede ser negativo.'));
    }
  }
  if (input.sbcDailyOverrideCents !== undefined && (!Number.isFinite(input.sbcDailyOverrideCents) || input.sbcDailyOverrideCents <= 0)) {
    errors.push(validationError('sbc_invalid', 'El SBC diario debe ser mayor a cero.'));
  }
  return errors;
}

function invalidResult(input, errors) {
  return {
    valid: false,
    input,
    errors,
    warnings: [],
    netPayCents: 0,
  };
}

function calculateIsr(grossAmountCents, period, data) {
  const table = data.isr_tables[period.isr_table];
  if (!table) {
    return {
      valid: false,
      error: validationError('isr_table_missing', 'No hay tabla ISR para esa frecuencia.'),
    };
  }

  const bracket = findBracket(grossAmountCents, table);
  if (!bracket) {
    return {
      valid: false,
      error: validationError('isr_bracket_missing', 'No encontré renglón ISR para ese ingreso.'),
    };
  }

  const excessCents = Math.max(grossAmountCents - bracket.lowerCents, 0);
  const marginalTaxCents = roundCents(excessCents * bracket.percentBps / 10000);
  const beforeSubsidyCents = bracket.fixedQuotaCents + marginalTaxCents;
  return {
    valid: true,
    bracket: { ...bracket, excessCents },
    beforeSubsidyCents,
  };
}

function calculateSubsidy(input, period, data, monthlyEquivalentGrossCents, warnings) {
  if (monthlyEquivalentGrossCents > data.subsidy.threshold_monthly_cents) {
    return 0;
  }

  const isJanuary = Number(input.month) === 1;
  const monthlySubsidyCents = isJanuary
    ? data.subsidy.january_transitory.formula_amount_cents
    : data.subsidy.feb_dec_formula_amount_cents;

  if (isJanuary) {
    warnings.push({
      code: 'subsidy_january_transitory',
      message: 'Enero 2026 usa regla transitoria del subsidio al empleo con UMA 2025 y 15.59%.',
    });
  } else if (monthlySubsidyCents !== data.subsidy.published_recital_amount_cents) {
    warnings.push({
      code: 'subsidy_dof_discrepancy',
      message: 'La fórmula UMA mensual 2026 × 15.02% da $535.65; el recital del DOF menciona $536.22. Usamos la fórmula publicada.',
    });
  }

  if (period.isr_table === 'monthly') {
    return monthlySubsidyCents;
  }

  return Math.min(monthlySubsidyCents, roundCents(monthlySubsidyCents / data.subsidy.monthly_days_divisor * period.days));
}

function calculateSbc(input, period, data, warnings) {
  if (!input.imssCovered) return null;

  const zone = data.minimum_wage[input.zone];
  const capDailyCents = data.uma.daily_cents * data.imss_worker.sbc_cap_uma_daily_multiplier;
  const minimumDailyCents = zone.daily_cents;
  let dailyCents;
  let source;
  let factor = null;

  if (input.sbcDailyOverrideCents !== undefined) {
    dailyCents = Number(input.sbcDailyOverrideCents);
    source = 'captured';
  } else {
    factor = integrationFactor(input.benefits);
    dailyCents = (Number(input.grossAmountCents) / period.days) * factor;
    source = 'estimated';
  }

  if (dailyCents > capDailyCents) {
    dailyCents = capDailyCents;
    warnings.push({
      code: 'sbc_capped_25_uma',
      message: 'El SBC se topó a 25 UMA diarias para IMSS.',
    });
  }

  if (dailyCents < minimumDailyCents) {
    dailyCents = minimumDailyCents;
    warnings.push({
      code: 'sbc_minimum_wage_floor',
      message: `El SBC estimado quedó bajo el salario mínimo de ${zone.label}; se usó el piso legal para IMSS.`,
    });
  }

  return {
    dailyCents,
    displayDailyCents: roundCents(dailyCents),
    source,
    integrationFactor: factor,
    capDailyCents,
    minimumDailyCents,
  };
}

function calculateImss(input, period, data, sbc) {
  if (!input.imssCovered || !sbc) {
    return { totalCents: 0, lineItems: [] };
  }

  const threeUmaDailyCents = data.uma.daily_cents * 3;
  let totalUnroundedCents = 0;
  const lineItems = data.imss_worker.line_items.map((item) => {
    const basisDailyCents = item.basis === 'daily_sbc_minus_3_uma'
      ? Math.max(sbc.dailyCents - threeUmaDailyCents, 0)
      : sbc.dailyCents;
    const amountUnroundedCents = basisDailyCents * period.days * item.rate_bps / 10000;
    totalUnroundedCents += amountUnroundedCents;
    return { ...item, basisDailyCents: roundCents(basisDailyCents), amountCents: roundCents(amountUnroundedCents) };
  });

  return {
    totalCents: roundCents(totalUnroundedCents),
    lineItems,
  };
}

export function calculateSueldoNeto(input, data) {
  const errors = validateInput(input, data);
  if (errors.length > 0) return invalidResult(input, errors);

  const period = data.periods[input.frequency];
  const warnings = [];
  const monthlyEquivalentGrossCents = period.isr_table === 'monthly'
    ? input.grossAmountCents
    : roundCents(input.grossAmountCents / period.days * 30);

  const isr = calculateIsr(input.grossAmountCents, period, data);
  if (!isr.valid) return invalidResult(input, [isr.error]);

  const minimumWageIsrExempt = monthlyEquivalentGrossCents <= data.minimum_wage[input.zone].monthly_cents;

  const subsidyAppliedCents = Math.min(
    isr.beforeSubsidyCents,
    calculateSubsidy(input, period, data, monthlyEquivalentGrossCents, warnings),
  );
  const withheldBeforeMinimumWageExemptionCents = Math.max(isr.beforeSubsidyCents - subsidyAppliedCents, 0);
  const withheldCents = minimumWageIsrExempt ? 0 : withheldBeforeMinimumWageExemptionCents;
  const sbc = calculateSbc(input, period, data, warnings);
  const imss = calculateImss(input, period, data, sbc);
  const otherDeductionsCents = Number(input.otherDeductionsCents || 0);
  const totalWithholdingCents = withheldCents + imss.totalCents + otherDeductionsCents;
  const netPayCents = input.grossAmountCents - totalWithholdingCents;

  if (minimumWageIsrExempt) {
    warnings.push({
      code: 'minimum_wage_isr_exempt',
      message: 'No aplicamos retención de ISR porque el ingreso mensual equivalente está en o debajo del salario mínimo de la zona seleccionada.',
    });
  }

  return {
    valid: true,
    input,
    errors: [],
    warnings,
    grossAmountCents: input.grossAmountCents,
    monthlyEquivalentGrossCents,
    period,
    isr: {
      beforeSubsidyCents: isr.beforeSubsidyCents,
      subsidyAppliedCents,
      withheldBeforeMinimumWageExemptionCents,
      withheldCents,
      bracket: isr.bracket,
      minimumWageExempt: minimumWageIsrExempt,
    },
    sbc,
    imss,
    otherDeductionsCents,
    totalWithholdingCents,
    netPayCents,
    effectiveWithholdingBps: roundCents(totalWithholdingCents / input.grossAmountCents * 10000),
    sources: data.sources.map((source) => source.id),
  };
}
