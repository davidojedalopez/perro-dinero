import { simulateRentVsBuy, validateRentVsBuyInputs } from '../../calculators/rent-vs-buy.mjs';

const moneyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});
const percentFormatter = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });

const FIELD_LABELS = {
  purchasePrice: 'Precio de la vivienda',
  currentMonthlyRent: 'Renta mensual actual',
  downPaymentPct: 'Enganche',
  mortgageNominalAnnualRatePct: 'Tasa anual de la hipoteca',
  mortgageTermYears: 'Plazo de la hipoteca',
  closingCostPct: 'Gastos de compra / escrituración',
  comparisonHorizonYears: 'Horizonte de comparación',
  rentGrowthAnnualPct: 'Aumento anual esperado de la renta',
  homeAppreciationAnnualPct: 'Apreciación anual de la vivienda',
  opportunityReturnAnnualPct: 'Rendimiento anual de invertir la diferencia',
  maintenanceAnnualPct: 'Mantenimiento anual estimado',
  ownerAnnualTaxInsurancePct: 'Predial, seguro y cuotas anuales',
  sellingCostPct: 'Costo estimado de venta',
  catPct: 'CAT del crédito',
};

const SCENARIOS = {
  conservative: { homeAppreciationAnnualPct: 2, rentGrowthAnnualPct: 3.5, opportunityReturnAnnualPct: 6 },
  base: { homeAppreciationAnnualPct: 4, rentGrowthAnnualPct: 5, opportunityReturnAnnualPct: 8 },
  high: { homeAppreciationAnnualPct: 6, rentGrowthAnnualPct: 6.5, opportunityReturnAnnualPct: 10 },
};

function money(value) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0);
}

function pesos(value) {
  return `${money(value)} pesos`;
}

function percentage(value) {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

function readDefaults(root) {
  const script = root.querySelector('[data-rent-vs-buy-defaults]');
  if (!script) return {};
  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    console.error('No pudimos leer los supuestos base de rentar vs comprar', error);
    return {};
  }
}

function readInputs(root) {
  const inputs = {};
  for (const input of root.querySelectorAll('[data-rvb-input]')) {
    inputs[input.name] = input.value;
  }
  return inputs;
}

function writeFieldMessages(root, validation, result) {
  for (const node of root.querySelectorAll('[data-error-for]')) {
    node.textContent = '';
    node.classList.add('hidden');
  }

  const issues = [...validation.errors, ...validation.warnings, ...(result?.warnings || [])];
  for (const issue of issues) {
    if (!issue.field) continue;
    const node = root.querySelector(`[data-error-for="${issue.field}"]`);
    if (!node || node.textContent) continue;
    node.textContent = issue.message;
    node.classList.toggle('text-red-700', issue.type === 'error');
    node.classList.toggle('dark:text-red-300', issue.type === 'error');
    node.classList.toggle('text-amber-700', issue.type !== 'error');
    node.classList.toggle('dark:text-amber-300', issue.type !== 'error');
    node.classList.remove('hidden');
  }
}

function renderMetric(label, value, helper = '') {
  return `
    <div class="money-static-card">
      <p class="money-tool-kicker">${label}</p>
      <p class="text-xl font-black text-accent-900 dark:text-primary-dark">${value}</p>
      ${helper ? `<p class="mt-1 text-sm text-accent-700 dark:text-accent-dark-600">${helper}</p>` : ''}
    </div>`;
}

function verdictCopy(result) {
  const difference = Math.abs(result.endState.differenceBuyMinusRent);
  if (result.verdict === 'tie') {
    return {
      eyebrow: 'Resultado sensible',
      headline: 'Está prácticamente empatado',
      body: 'Con una diferencia así, pesan más liquidez, estabilidad y riesgo que declarar un ganador.',
      aria: `Empate aproximado. La diferencia estimada es ${pesos(difference)}.`,
    };
  }
  if (result.verdict === 'buy') {
    return {
      eyebrow: 'Resultado del escenario',
      headline: `Comprar sale adelante por ${money(difference)}`,
      body: `Al final de ${result.inputs.comparisonHorizonYears} años, la vivienda deja más patrimonio estimado que rentar e invertir la diferencia.`,
      aria: `Comprar sale adelante por ${pesos(difference)}.`,
    };
  }
  return {
    eyebrow: 'Resultado del escenario',
    headline: `Rentar sale adelante por ${money(difference)}`,
    body: `Al final de ${result.inputs.comparisonHorizonYears} años, rentar e invertir la diferencia termina con más patrimonio estimado que comprar.`,
    aria: `Rentar sale adelante por ${pesos(difference)}.`,
  };
}

function meaningCopy(result) {
  if (result.verdict === 'buy') {
    return 'Comprar gana porque la plusvalía y el pago de capital superan el costo de la hipoteca, los gastos de compra, mantenimiento y el dinero que podrías haber invertido rentando.';
  }
  if (result.verdict === 'rent') {
    return 'Comprar no pierde porque “comprar sea malo”. Pierde porque el enganche y los gastos iniciales también tienen costo de oportunidad: si no los metes al ladrillo, podrían estar invertidos.';
  }
  return 'Si la diferencia sale chica, no fuerces una conclusión. Aquí probablemente importan más cosas que la calculadora no puede saber: liquidez, estabilidad laboral, tiempo que te quieres quedar y ganas de arreglar goteras.';
}

function renderWarnings(result) {
  const displayWarnings = result.warnings.filter((warning) => warning.code || warning.type === 'warning');
  if (displayWarnings.length === 0) return '';
  return `
    <div class="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/70 dark:bg-amber-950/40 dark:text-amber-100">
      <p class="font-bold">Ojo con estos supuestos</p>
      <ul class="mb-0 mt-2 list-disc pl-5">
        ${displayWarnings.map((warning) => `<li>${warning.message}</li>`).join('')}
      </ul>
    </div>`;
}

function renderResult(root, result) {
  const output = root.querySelector('[data-rvb-output]');
  const verdict = verdictCopy(result);
  output.classList.remove('hidden');
  output.innerHTML = `
    <section class="space-y-5" aria-live="polite" aria-label="${verdict.aria}">
      <div class="rounded-2xl border-2 border-accent-500/30 bg-white p-5 shadow-md dark:border-accent-dark-500/40 dark:bg-background-dark">
        <p class="money-tool-kicker">${verdict.eyebrow}</p>
        <h2 class="pt-2 pb-2 text-3xl font-black text-accent-500 dark:text-accent-dark-500">${verdict.headline}</h2>
        <p class="text-accent-700 dark:text-accent-dark-600">${verdict.body}</p>
        <p class="mt-3 text-xs text-accent-600 dark:text-accent-dark-600">No es recomendación. Es la diferencia entre patrimonios al final del horizonte con los supuestos capturados.</p>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          ${renderMetric('Comprando', money(result.endState.buyerNetEquity), 'Patrimonio neto estimado')}
          ${renderMetric('Rentando', money(result.endState.renterNetWorth), 'Patrimonio estimado al invertir la diferencia')}
        </div>
      </div>
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        ${renderMetric('Mensualidad inicial de hipoteca', money(result.payment.monthlyMortgagePayment), 'Calculada con tasa nominal, no CAT.')}
        ${renderMetric('Efectivo inicial para comprar', money(result.payment.initialBuyerCash), 'Enganche + gastos de compra.')}
        ${renderMetric('Costo mensual promedio como propietario', money(result.totals.averageMonthlyOwnerCost), 'Hipoteca + mantenimiento + predial/seguro/cuotas.')}
        ${renderMetric('Renta proyectada al final', money(result.endState.projectedMonthlyRent), `Con aumento anual de renta de ${percentage(result.inputs.rentGrowthAnnualPct)}.`)}
        ${renderMetric('Saldo de la hipoteca al final', money(result.endState.remainingLoanBalance))}
        ${renderMetric('Valor estimado de la vivienda al final', money(result.endState.homeValue))}
        ${renderMetric('Costo estimado de venta', money(result.endState.saleCosts))}
        ${renderMetric('Total pagado en intereses', money(result.totals.totalInterestPaid))}
        ${renderMetric('Punto de equilibrio', result.breakevenLabel)}
      </div>
      ${renderWarnings(result)}
      <div class="money-tool-note">
        <p class="font-black text-accent-900 dark:text-primary-dark">Qué significa este resultado</p>
        <p class="mb-0 mt-2 text-accent-800 dark:text-accent-dark-200">${meaningCopy(result)} Cambia plusvalía, aumento de renta y rendimiento de inversión. Si el resultado se voltea con un ajuste pequeño, no tienes una respuesta sólida; tienes un escenario sensible.</p>
      </div>
    </section>`;
}

function renderInvalid(root, validation) {
  const output = root.querySelector('[data-rvb-output]');
  output.classList.remove('hidden');
  output.innerHTML = `
    <section class="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-900 dark:border-red-500/80 dark:bg-red-950/40 dark:text-red-100" aria-live="polite">
      <p class="money-tool-kicker">Faltan datos para comparar</p>
      <h2 class="pt-2 pb-2 text-2xl font-black">No pude calcular con esos datos</h2>
      <p>Revisa los campos marcados. Normalmente pasa por un precio en cero, una tasa fuera de rango o un horizonte imposible.</p>
      <ul class="mb-0 mt-2 list-disc pl-5">
        ${validation.errors.map((error) => `<li><strong>${FIELD_LABELS[error.field] || error.field}:</strong> ${error.message}</li>`).join('')}
      </ul>
    </section>`;
  const summary = root.querySelector('[data-rvb-summary]');
  if (summary) summary.value = '';
}

function updatePreviews(root, inputs) {
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const downPaymentPct = Number(inputs.downPaymentPct) || 0;
  const closingCostPct = Number(inputs.closingCostPct) || 0;
  const downPaymentPreview = root.querySelector('[data-down-payment-preview]');
  const closingPreview = root.querySelector('[data-closing-preview]');
  if (downPaymentPreview) downPaymentPreview.textContent = `Con este precio, tu enganche sería de ${money(purchasePrice * downPaymentPct / 100)}.`;
  if (closingPreview) closingPreview.textContent = `Aprox. ${money(purchasePrice * closingCostPct / 100)} con este precio.`;
}

function updateShareSummary(root, result) {
  const summary = root.querySelector('[data-rvb-summary]');
  if (!summary) return;
  const winner = result.verdict === 'buy' ? 'comprar' : result.verdict === 'rent' ? 'rentar' : 'empate aproximado';
  const difference = Math.abs(result.endState.differenceBuyMinusRent);
  summary.value = `Escenario rentar vs comprar en Perro Dinero: vivienda de ${money(result.inputs.purchasePrice)}, renta de ${money(result.inputs.currentMonthlyRent)}, enganche ${percentage(result.inputs.downPaymentPct)}, hipoteca ${percentage(result.inputs.mortgageNominalAnnualRatePct)} a ${result.inputs.mortgageTermYears} años, horizonte ${result.inputs.comparisonHorizonYears} años. Con estos supuestos, comprar termina con ${money(result.endState.buyerNetEquity)} y rentar con ${money(result.endState.renterNetWorth)}. Resultado estimado: ${winner}${result.verdict === 'tie' ? '' : ` +${money(difference)}`}. No es recomendación; depende de los supuestos.`;
}

function calculate(root) {
  const inputs = readInputs(root);
  const validation = validateRentVsBuyInputs(inputs);
  updatePreviews(root, inputs);
  if (!validation.isValid) {
    writeFieldMessages(root, validation, null);
    renderInvalid(root, validation);
    return;
  }
  const result = simulateRentVsBuy(inputs);
  writeFieldMessages(root, validation, result);
  renderResult(root, result);
  updateShareSummary(root, result);
}

function applyScenario(root, scenarioName) {
  const scenario = SCENARIOS[scenarioName];
  if (!scenario) return;
  for (const [field, value] of Object.entries(scenario)) {
    const input = root.querySelector(`[data-rvb-input][name="${field}"]`);
    if (input) input.value = value;
  }
  calculate(root);
}

function setupCopyButton(root) {
  const button = root.querySelector('[data-copy-rvb-summary]');
  const summary = root.querySelector('[data-rvb-summary]');
  const status = root.querySelector('[data-copy-status]');
  if (!button || !summary || !status) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      status.textContent = 'Resumen copiado.';
    } catch {
      summary.focus();
      summary.select();
      status.textContent = 'No se pudo copiar; selecciona el texto manualmente.';
    }
  });
}

export function initRentVsBuyMexico() {
  const root = document.querySelector('[data-rent-vs-buy-mx]');
  if (!root) return;
  const defaults = readDefaults(root);
  for (const input of root.querySelectorAll('[data-rvb-input]')) {
    if (Object.prototype.hasOwnProperty.call(defaults, input.name)) input.value = defaults[input.name];
    input.addEventListener('input', () => calculate(root));
    input.addEventListener('change', () => calculate(root));
  }
  for (const button of root.querySelectorAll('[data-rvb-scenario]')) {
    button.addEventListener('click', () => applyScenario(root, button.dataset.rvbScenario));
  }
  const calculateButton = root.querySelector('[data-rvb-calculate]');
  if (calculateButton) calculateButton.addEventListener('click', () => calculate(root));
  setupCopyButton(root);
  calculate(root);
}
