import { calculateSueldoNeto, formatMxn, formatPercentBps } from '../../calculators/sueldo-neto.mjs';

function parseMoneyToCents(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const normalized = raw.replace(/[$,\s]/g, '');
  if (!/^-?(?:\d+|\d*\.\d+)$/.test(normalized)) return Number.NaN;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
}

function field(root, name) {
  return root.querySelector(`[data-field="${name}"]`);
}

function readCalculatorData(root) {
  const node = root.querySelector('[data-sueldo-neto-data]');
  if (!node) throw new Error('Missing sueldo neto calculator data');
  return JSON.parse(node.textContent);
}

function readInput(root) {
  const grossAmountCents = parseMoneyToCents(field(root, 'gross')?.value);
  const otherDeductionsCents = parseMoneyToCents(field(root, 'otherDeductions')?.value) ?? 0;
  const sbcDailyOverrideCents = parseMoneyToCents(field(root, 'sbc')?.value);
  const vacationPremium = Number(field(root, 'vacationPremium')?.value || 25);
  const input = {
    grossAmountCents: grossAmountCents ?? 0,
    frequency: field(root, 'frequency')?.value || 'monthly',
    year: 2026,
    month: Number(field(root, 'month')?.value || 6),
    zone: field(root, 'zone')?.value || 'general',
    imssCovered: Boolean(field(root, 'imss')?.checked),
    otherDeductionsCents,
    benefits: {
      aguinaldoDays: Number(field(root, 'aguinaldoDays')?.value || 15),
      vacationDays: Number(field(root, 'vacationDays')?.value || 12),
      vacationPremiumBps: Math.round(vacationPremium * 100),
    },
  };
  if (sbcDailyOverrideCents !== null) input.sbcDailyOverrideCents = sbcDailyOverrideCents;
  return input;
}

function setText(root, selector, text) {
  const node = root.querySelector(selector);
  if (node) node.textContent = text;
}

function clearErrors(root) {
  root.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = ''; });
  root.querySelector('[data-error-summary]')?.classList.add('hidden');
}

function showErrors(root, errors) {
  clearErrors(root);
  root.querySelector('[data-error-summary]')?.classList.remove('hidden');
  for (const error of errors) {
    const fieldName = error.code.startsWith('gross') ? 'gross'
      : error.code.startsWith('other') ? 'otherDeductions'
        : error.code.startsWith('sbc') ? 'sbc'
          : null;
    const target = fieldName ? root.querySelector(`[data-error-for="${fieldName}"]`) : null;
    if (target) target.textContent = error.message;
  }
}

function renderWarnings(root, warnings) {
  const container = root.querySelector('[data-warnings]');
  if (!container) return;
  container.innerHTML = warnings.map((warning) => `<p class="rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:bg-amber-950/35 dark:text-amber-200">Advertencia: ${warning.message}</p>`).join('');
}

function renderBreakdown(root, result) {
  const rows = [
    ['Sueldo bruto', result.grossAmountCents],
    ['ISR antes de subsidio', result.isr.beforeSubsidyCents],
    ['Subsidio al empleo aplicado', result.isr.subsidyAppliedCents],
    ...(result.isr.minimumWageExempt && result.isr.withheldBeforeMinimumWageExemptionCents > 0
      ? [['ISR no retenido por salario mínimo', result.isr.withheldBeforeMinimumWageExemptionCents]]
      : []),
    ['ISR retenido', result.isr.withheldCents],
    ['IMSS trabajador', result.imss.totalCents],
    ['Otros descuentos capturados', result.otherDeductionsCents],
    ['Sueldo neto estimado', result.netPayCents],
  ];
  const container = root.querySelector('[data-breakdown]');
  if (!container) return;
  container.innerHTML = rows.map(([label, amount]) => `<div class="flex items-center justify-between gap-3 border-b border-accent-100 dark:border-foreground-dark py-2"><dt>${label}</dt><dd class="m-0 font-black">${formatMxn(amount)}</dd></div>`).join('');
}

function renderAssumptions(root, result, input, data) {
  const zone = data.minimum_wage[input.zone]?.label || input.zone;
  const sbcLabel = result.sbc?.source === 'captured' ? 'capturado por el usuario' : 'estimado con prestaciones mínimas';
  const items = [
    `Tablas ISR 2026 para ${result.period.label}`,
    `UMA 2026: ${formatMxn(data.uma.daily_cents)} diaria / ${formatMxn(data.uma.monthly_cents)} mensual`,
    `Zona: ${zone}`,
    `SBC: ${sbcLabel}`,
    `IMSS trabajador: ${input.imssCovered ? 'incluido' : 'no incluido'}`,
    `Otros descuentos: ${formatMxn(result.otherDeductionsCents)}`,
  ];
  const container = root.querySelector('[data-assumptions]');
  if (container) container.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function renderTechnicalDetail(root, result) {
  const details = [
    ['Tarifa ISR usada', `${result.period.label}, Anexo 8 RMF 2026`],
    ['Límite inferior del renglón', formatMxn(result.isr.bracket.lowerCents)],
    ['Cuota fija', formatMxn(result.isr.bracket.fixedQuotaCents)],
    ['% sobre excedente', formatPercentBps(result.isr.bracket.percentBps)],
    ['Excedente', formatMxn(result.isr.bracket.excessCents)],
    ['Exención ISR salario mínimo', result.isr.minimumWageExempt ? 'aplicada' : 'no aplicada'],
    ['SBC diario', result.sbc ? formatMxn(result.sbc.displayDailyCents) : 'No incluido'],
    ['Neto mensual equivalente', formatMxn(result.period.isr_table === 'monthly' ? result.netPayCents : Math.round(result.netPayCents / result.period.days * 30))],
  ];
  const container = root.querySelector('[data-technical-detail]');
  if (container) container.innerHTML = details.map(([label, value]) => `<div class="rounded-lg bg-white/85 dark:bg-background-dark/85 p-3"><dt class="font-bold">${label}</dt><dd class="m-0">${value}</dd></div>`).join('');
}

function clearCalculatedOutput(root) {
  setText(root, '[data-result-effective]', '—');
  setText(root, '[data-result-isr]', '—');
  setText(root, '[data-result-subsidy]', '—');
  setText(root, '[data-result-imss]', '—');
  root.querySelector('[data-breakdown]')?.replaceChildren();
  root.querySelector('[data-assumptions]')?.replaceChildren();
  root.querySelector('[data-technical-detail]')?.replaceChildren();
  delete root.dataset.shareSummary;
}

function shareSummary(result, input) {
  return `Con un sueldo bruto de ${formatMxn(result.grossAmountCents)} por ${result.period.label}, la calculadora de Perro Dinero estima un neto de ${formatMxn(result.netPayCents)} usando tablas 2026. ISR ${formatMxn(result.isr.withheldCents)}, subsidio ${formatMxn(result.isr.subsidyAppliedCents)}, IMSS trabajador ${formatMxn(result.imss.totalCents)}, otros descuentos ${formatMxn(result.otherDeductionsCents)}. Zona ${input.zone}, IMSS ${input.imssCovered ? 'incluido' : 'no incluido'}, SBC ${result.sbc?.source === 'captured' ? 'capturado' : 'estimado'}. Es una estimación educativa, no asesoría fiscal ni recibo oficial.`;
}

function renderResult(root, result, input, data) {
  if (!result.valid) {
    showErrors(root, result.errors);
    setText(root, '[data-result-net]', 'Revisa los datos');
    setText(root, '[data-result-summary]', 'No muestro números viejos cuando el cálculo no es válido. Mejor eso que darte un número falso con cara de autoridad.');
    clearCalculatedOutput(root);
    renderWarnings(root, []);
    return;
  }
  clearErrors(root);
  setText(root, '[data-result-net]', `${formatMxn(result.netPayCents)} por ${result.period.label}`);
  setText(root, '[data-result-summary]', `De un bruto de ${formatMxn(result.grossAmountCents)}, estimamos que se retienen ${formatMxn(result.totalWithholdingCents)} entre ISR, IMSS y otros descuentos.`);
  setText(root, '[data-result-effective]', formatPercentBps(result.effectiveWithholdingBps));
  setText(root, '[data-result-isr]', formatMxn(result.isr.withheldCents));
  setText(root, '[data-result-subsidy]', formatMxn(result.isr.subsidyAppliedCents));
  setText(root, '[data-result-imss]', formatMxn(result.imss.totalCents));
  renderWarnings(root, result.warnings);
  renderBreakdown(root, result);
  renderAssumptions(root, result, input, data);
  renderTechnicalDetail(root, result);
  root.dataset.shareSummary = shareSummary(result, input);
}

function bindCopy(root) {
  const button = root.querySelector('[data-copy-summary]');
  const status = root.querySelector('[data-copy-status]');
  if (!button || !status) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(root.dataset.shareSummary || '');
      status.textContent = 'Copiado. Ahora sí puedes mandarlo sin mandar toda tu vida fiscal.';
    } catch (_error) {
      status.textContent = 'No pude copiarlo automáticamente. Selecciona el resumen y cópialo a mano.';
    }
  });
}

export function initSueldoNetoCalculator() {
  const root = document.querySelector('[data-sueldo-neto]');
  if (!root) return;
  const data = readCalculatorData(root);
  const update = () => renderResult(root, calculateSueldoNeto(readInput(root), data), readInput(root), data);
  root.querySelectorAll('input, select').forEach((node) => {
    node.addEventListener('input', update);
    node.addEventListener('change', update);
  });
  bindCopy(root);
  update();
}
