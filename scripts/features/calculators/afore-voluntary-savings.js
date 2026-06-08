import { calculateAforeVoluntarySavings, DEFAULT_AFORE_DATA } from '../../calculators/afore-voluntary-savings.mjs';

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat('es-MX', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function initAforeVoluntarySavingsCalculator() {
  document.querySelectorAll('[data-afore-voluntary-savings]').forEach(initCalculator);
}

function initCalculator(root) {
  const form = root.querySelector('[data-afore-form]');
  const copyButton = root.querySelector('[data-copy-summary]');
  const copyStatus = root.querySelector('[data-copy-status]');
  const errorSummary = root.querySelector('[data-error-summary]');
  let lastResult = null;
  if (!form) return;

  const updateConditionalFields = () => {
    const mode = new FormData(form).get('modoMeta') || 'replacement';
    root.querySelectorAll('[data-goal-field]').forEach((element) => {
      const active = element.getAttribute('data-goal-field') === mode;
      element.hidden = !active;
      element.querySelectorAll('input').forEach((input) => { input.disabled = !active; });
    });
  };

  const update = () => {
    updateConditionalFields();
    const result = calculateAforeVoluntarySavings(readInput(form), DEFAULT_AFORE_DATA);
    lastResult = result;
    renderErrors(root, result, errorSummary);
    if (!result.ok) return renderInvalid(root);
    return renderResult(root, result);
  };

  form.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); update(); });

  root.querySelectorAll('[data-scenario]').forEach((button) => {
    button.addEventListener('click', () => { applyScenario(form, button.getAttribute('data-scenario')); update(); });
  });

  copyButton?.addEventListener('click', async () => {
    if (!lastResult?.ok) return;
    try {
      await navigator.clipboard.writeText(buildSummary(lastResult));
      if (copyStatus) copyStatus.textContent = 'Resumen copiado. Pégalo donde quieras, pero no olvides los supuestos.';
    } catch {
      if (copyStatus) copyStatus.textContent = 'No se pudo copiar. Puedes seleccionar el resumen manualmente.';
    }
  });

  update();
}

function readInput(form) {
  const formData = new FormData(form);
  return {
    edadActual: formData.get('edadActual'),
    edadRetiro: formData.get('edadRetiro'),
    saldoActualAfore: formData.get('saldoActualAfore'),
    salarioMensualSbc: formData.get('salarioMensualSbc'),
    aportacionVoluntariaActualMensual: formData.get('aportacionVoluntariaActualMensual'),
    modoMeta: formData.get('modoMeta') || 'replacement',
    tasaReemplazoDeseada: formData.get('tasaReemplazoDeseada'),
    ingresoMensualDeseado: formData.get('ingresoMensualDeseado'),
    rendimientoRealAnualNetoAcumulacion: formData.get('rendimientoRealAnualNetoAcumulacion'),
    rendimientoRealAnualRetiro: formData.get('rendimientoRealAnualRetiro'),
    aniosRetiroAFinanciar: formData.get('aniosRetiroAFinanciar'),
    incluirVivienda: formData.has('incluirVivienda'),
  };
}

function renderErrors(root, result, errorSummary) {
  root.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = ''; });
  if (result.ok) {
    errorSummary?.classList.add('hidden');
    if (errorSummary) errorSummary.textContent = '';
    return;
  }
  for (const item of result.errors) {
    const node = root.querySelector(`[data-error-for="${item.field}"]`);
    if (node) node.textContent = item.message;
  }
  if (errorSummary) {
    errorSummary.classList.remove('hidden');
    errorSummary.innerHTML = `<p class="font-bold">Hay datos que no cuadran</p><ul>${result.errors.map((item) => `<li>${escapeHtml(item.message)}</li>`).join('')}</ul>`;
  }
}

function renderInvalid(root) {
  setOutput(root, 'requiredVoluntaryMonthly', 'Falta un dato');
  setOutput(root, 'supportLine', 'Completa edad, saldo, salario/SBC y meta de retiro. En cuanto estén listos, actualizamos el resultado.');
  ['additionalVoluntaryMonthly', 'estimatedMonthlyIncome', 'estimatedReplacementRate', 'targetMonthlyIncome', 'projectedBalance', 'targetCapital', 'capitalGap', 'mandatoryMonthly', 'monthsToRetirement', 'futureValueCurrentBalance', 'totalVoluntaryMonthlyNeeded', 'currentVoluntaryMonthly'].forEach((key) => setOutput(root, key, '—'));
  setOutput(root, 'contributionBreakdown', 'Corrige los datos para ver las aportaciones modeladas.');
  setWarnings(root, []);
}

function renderResult(root, result) {
  const { inputs, assumptions, contributions, projection, required, target } = result;
  const alreadyOnTarget = required.additionalVoluntaryMonthlyNeeded <= 0;
  setOutput(root, 'requiredVoluntaryMonthly', currency.format(required.totalVoluntaryMonthlyNeeded));
  setOutput(root, 'additionalVoluntaryMonthly', currency.format(required.additionalVoluntaryMonthlyNeeded));
  setOutput(root, 'estimatedMonthlyIncome', `${currency.format(projection.estimatedMonthlyIncome)}/mes`);
  setOutput(root, 'estimatedReplacementRate', percent.format(projection.estimatedReplacementRate));
  setOutput(root, 'targetMonthlyIncome', `${currency.format(target.targetMonthlyIncome)}/mes`);
  setOutput(root, 'projectedBalance', currency.format(projection.projectedBalanceWithoutAdditionalVoluntary));
  setOutput(root, 'targetCapital', currency.format(target.targetCapital));
  setOutput(root, 'capitalGap', currency.format(required.capitalGapAfterCurrentSavings));
  setOutput(root, 'mandatoryMonthly', `${currency.format(contributions.mandatoryMonthly)}/mes`);
  setOutput(root, 'monthsToRetirement', `${assumptions.monthsToRetirement} meses`);
  setOutput(root, 'futureValueCurrentBalance', currency.format(projection.futureValueCurrentBalance));
  setOutput(root, 'totalVoluntaryMonthlyNeeded', `${currency.format(required.totalVoluntaryMonthlyNeeded)}/mes`);
  setOutput(root, 'currentVoluntaryMonthly', `${currency.format(inputs.aportacionVoluntariaActualMensual)}/mes`);
  setOutput(root, 'contributionBreakdown', `Retiro patronal 2%, CEV trabajador 1.125%, CEV patronal ${percent.format(contributions.employerCevRate)} (${contributions.employerCevBracket})${inputs.incluirVivienda ? ' + vivienda Infonavit 5%' : ''}.`);
  if (alreadyOnTarget) {
    setOutput(root, 'supportLine', 'Con estos supuestos, tu trayectoria ya alcanza la meta. No lo leas como garantía: cambia si cambian rendimiento, salario, edad de retiro o reglas usadas.');
    setOutput(root, 'meaningText', 'Tu escenario aparece en meta con los datos actuales. Eso no significa “ya la hiciste”; significa que no hay brecha bajo este modelo y estos supuestos. Revisa datos reales antes de decidir.');
  } else if (inputs.aportacionVoluntariaActualMensual > 0) {
    setOutput(root, 'supportLine', `Para tu escenario, la aportación voluntaria total necesaria sería de ${currency.format(required.totalVoluntaryMonthlyNeeded)} al mes. Ya modelas ${currency.format(inputs.aportacionVoluntariaActualMensual)}, así que faltaría agregar aproximadamente ${currency.format(required.additionalVoluntaryMonthlyNeeded)} al mes.`);
    setOutput(root, 'meaningText', 'La brecha no es deuda. Es la distancia entre lo que el modelo proyecta y el capital que necesitarías para sostener el ingreso que elegiste.');
  } else {
    setOutput(root, 'supportLine', `Para tu escenario, tendrías que aportar aproximadamente ${currency.format(required.totalVoluntaryMonthlyNeeded)} al mes desde ahora hasta los ${inputs.edadRetiro} para acercarte a tu meta de ${currency.format(target.targetMonthlyIncome)} mensuales en retiro.`);
    setOutput(root, 'meaningText', 'Este número no dice “esto debes hacer”. Dice: con estos supuestos, esta sería la aportación mensual que cerraría la brecha del modelo. Si el rendimiento baja, te retiras antes o sube tu meta, la aportación necesaria sube.');
  }
  setWarnings(root, result.warnings);
}

function setWarnings(root, warnings) {
  const node = root.querySelector('[data-warning-list]');
  if (!node) return;
  if (!warnings.length) { node.hidden = true; node.innerHTML = ''; return; }
  node.hidden = false;
  node.innerHTML = `<h2 class="text-xl">Datos por revisar</h2><ul>${warnings.map((warning) => `<li>${escapeHtml(warning.message)}</li>`).join('')}</ul>`;
}

function applyScenario(form, scenario) {
  if (scenario === 'retire-later') {
    const retirementAge = form.querySelector('[name="edadRetiro"]');
    retirementAge.value = String((Number(retirementAge.value) || 65) + 2);
  } else if (scenario === 'lower-goal') {
    const replacementRadio = form.querySelector('[name="modoMeta"][value="replacement"]');
    const replacementRate = form.querySelector('[name="tasaReemplazoDeseada"]');
    if (replacementRadio) replacementRadio.checked = true;
    if (replacementRate) replacementRate.value = '60';
  } else if (scenario === 'lower-return') {
    const accumulationReturn = form.querySelector('[name="rendimientoRealAnualNetoAcumulacion"]');
    if (accumulationReturn) accumulationReturn.value = '3';
  }
}

function buildSummary(result) {
  const { inputs, target, required } = result;
  const goal = inputs.modoMeta === 'income' ? `meta de ${currency.format(target.targetMonthlyIncome)} mensuales` : `meta de ${percent.format(inputs.tasaReemplazoDeseada)} de ingreso`;
  return `Con ${currency.format(inputs.saldoActualAfore)} de saldo AFORE, ${currency.format(inputs.salarioMensualSbc)} de SBC, retiro a los ${inputs.edadRetiro} y ${goal}, el estimador calcula una aportación voluntaria necesaria de ~${currency.format(required.totalVoluntaryMonthlyNeeded)} al mes. Supuestos: pesos de hoy, ${(inputs.rendimientoRealAnualNetoAcumulacion * 100).toFixed(1)}% real anual neto antes del retiro, ${(inputs.rendimientoRealAnualRetiro * 100).toFixed(1)}% real durante retiro, ${inputs.aniosRetiroAFinanciar} años de retiro financiados, vivienda Infonavit ${inputs.incluirVivienda ? 'incluida' : 'no incluida'}. No es cotización oficial ni asesoría.`;
}

function setOutput(root, name, value) {
  const node = root.querySelector(`[data-output="${name}"]`);
  if (node) node.textContent = value;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
