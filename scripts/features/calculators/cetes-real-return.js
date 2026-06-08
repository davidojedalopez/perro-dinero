import { calculateCetesRealReturn } from '../../calculators/cetes-real-return.mjs';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numberFormatter = new Intl.NumberFormat('es-MX', {
  maximumFractionDigits: 0,
});

export function initCetesRealReturnCalculator() {
  const root = document.querySelector('[data-cetes-real-return]');
  if (!root) {
    return;
  }

  const data = readCalculatorData(root);
  if (!data) {
    return;
  }

  const form = root.querySelector('[data-cetes-form]');
  const fields = {
    amount: root.querySelector('[data-field="amount"]'),
    termId: root.querySelector('[data-field="termId"]'),
    annualRatePercent: root.querySelector('[data-field="annualRatePercent"]'),
    inflationAnnualPercent: root.querySelector('[data-field="inflationAnnualPercent"]'),
    withholdingAnnualRatePercent: root.querySelector('[data-field="withholdingAnnualRatePercent"]'),
  };
  const rateSource = root.querySelector('[data-rate-source]');
  const resetRateButton = root.querySelector('[data-reset-rate]');
  const copyButton = root.querySelector('[data-copy-summary]');
  const copyStatus = root.querySelector('[data-copy-status]');
  const errorSummary = root.querySelector('[data-error-summary]');
  const outputs = Object.fromEntries(Array.from(root.querySelectorAll('[data-output]')).map((node) => [node.dataset.output, node]));
  let rateIsManual = false;
  let latestResult = null;

  setRateFromSelectedTerm();
  updateRateSource();
  render();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    render();
  });

  root.addEventListener('input', (event) => {
    if (event.target === fields.annualRatePercent) {
      rateIsManual = !rateMatchesSelectedTerm();
      updateRateSource();
    }
    render();
  });

  fields.termId.addEventListener('change', () => {
    rateIsManual = false;
    setRateFromSelectedTerm();
    updateRateSource();
    render();
  });

  resetRateButton.addEventListener('click', () => {
    rateIsManual = false;
    setRateFromSelectedTerm();
    updateRateSource();
    render();
    fields.annualRatePercent.focus();
  });

  root.querySelectorAll('[data-inflation-scenario]').forEach((button) => {
    button.addEventListener('click', () => {
      fields.inflationAnnualPercent.value = button.dataset.inflationScenario;
      render();
      fields.inflationAnnualPercent.focus();
    });
  });

  copyButton.addEventListener('click', async () => {
    if (!latestResult?.ok) {
      copyStatus.textContent = 'Primero calcula un escenario válido.';
      return;
    }
    try {
      await navigator.clipboard.writeText(latestResult.summary);
      copyStatus.textContent = 'Resumen copiado. Ahora sí, a presumirle a tu yo financiero, no al SAT.';
    } catch {
      copyStatus.textContent = 'No pude copiar el resumen. Puedes seleccionarlo manualmente.';
    }
  });

  function render() {
    const input = collectInput();
    const result = calculateCetesRealReturn(input, data);
    clearErrors();
    copyStatus.textContent = '';

    if (!result.ok) {
      latestResult = null;
      resetResult();
      showErrors(result.errors);
      return;
    }

    latestResult = result;
    copyButton.disabled = false;
    renderResult(result);
  }

  function collectInput() {
    return {
      amount: fields.amount.value,
      termId: fields.termId.value,
      annualRatePercent: fields.annualRatePercent.value,
      inflationAnnualPercent: fields.inflationAnnualPercent.value,
      withholdingAnnualRatePercent: fields.withholdingAnnualRatePercent.value,
    };
  }

  function selectedTerm() {
    return data.terms.find((term) => term.id === fields.termId.value);
  }

  function setRateFromSelectedTerm() {
    const term = selectedTerm();
    fields.annualRatePercent.value = term && Number.isFinite(term.annualRatePercent)
      ? term.annualRatePercent
      : '';
  }

  function rateMatchesSelectedTerm() {
    const term = selectedTerm();
    if (!term) {
      return false;
    }
    return Math.abs(Number(fields.annualRatePercent.value) - Number(term.annualRatePercent)) < 0.000001;
  }

  function updateRateSource() {
    const term = selectedTerm();
    if (!term) {
      rateSource.textContent = 'Elige un plazo de la lista.';
      return;
    }
    if (rateIsManual || !rateMatchesSelectedTerm()) {
      rateSource.textContent = 'Tasa manual. Ya no estamos usando el dato de Banxico para este cálculo.';
      return;
    }
    const observed = term.source?.observedAt ? `, observado el ${term.source.observedAt}` : '';
    const stale = term.stale?.message ? ` ${term.stale.message}` : '';
    rateSource.textContent = `Tasa de referencia: ${term.source?.name || 'Banxico SIE'}, ${term.label}${observed}.${stale}`;
  }

  function clearErrors() {
    root.querySelectorAll('[data-error-for]').forEach((node) => {
      node.textContent = '';
    });
    errorSummary.textContent = '';
    errorSummary.classList.add('hidden');
  }

  function showErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
      const node = root.querySelector(`[data-error-for="${field}"]`);
      if (node) {
        node.textContent = message;
      }
    });
    errorSummary.innerHTML = `<p class="font-black">Revisa estos datos</p><ul>${Object.values(errors).map((message) => `<li>${escapeHtml(message)}</li>`).join('')}</ul>`;
    errorSummary.classList.remove('hidden');
  }

  function resetResult() {
    copyButton.disabled = true;
    outputs.maturityTotal.textContent = '—';
    outputs.netInterestText.textContent = 'Corrige los datos para calcular un escenario válido.';
    outputs.grossInterest.textContent = '—';
    outputs.withholding.textContent = '—';
    outputs.netNominalReturn.textContent = '—';
    outputs.inflationPeriod.textContent = '—';
    outputs.titlePrice.textContent = '—';
    outputs.titles.textContent = '—';
    outputs.effectiveInvestment.textContent = '—';
    outputs.uninvestedRemainder.textContent = '—';
    outputs.grossInterestDetail.textContent = '—';
    outputs.withholdingDetail.textContent = '—';
    outputs.maturityTotalDetail.textContent = '—';
    outputs.realReturnText.textContent = 'No mostramos resultados con datos inválidos para evitar números viejos.';
    outputs.explanation.textContent = 'Hay que corregir los campos marcados antes de estimar rendimiento neto o real.';
    outputs.message.textContent = 'Revisa los campos marcados. La calculadora oculta el resultado anterior hasta que el escenario vuelva a ser válido.';
  }

  function renderResult(result) {
    outputs.maturityTotal.textContent = formatMoney(result.maturityTotal);
    outputs.netInterestText.textContent = `Ganancia neta estimada: ${formatMoney(result.netInterest)} después de retención ISR provisional.`;
    outputs.grossInterest.textContent = formatMoney(result.grossInterest);
    outputs.withholding.textContent = formatMoney(result.withholding);
    outputs.netNominalReturn.textContent = formatPercent(result.netNominalReturnPeriodPercent);
    outputs.inflationPeriod.textContent = result.inflationPeriodPercent === null ? '—' : formatPercent(result.inflationPeriodPercent);
    outputs.titlePrice.textContent = formatMoney(result.titlePrice);
    outputs.titles.textContent = numberFormatter.format(result.titles);
    outputs.effectiveInvestment.textContent = formatMoney(result.effectiveInvestment);
    outputs.uninvestedRemainder.textContent = formatMoney(result.uninvestedRemainder);
    outputs.grossInterestDetail.textContent = formatMoney(result.grossInterest);
    outputs.withholdingDetail.textContent = `-${formatMoney(result.withholding)}`;
    outputs.maturityTotalDetail.textContent = formatMoney(result.maturityTotal);
    outputs.realReturnText.textContent = realReturnText(result);
    outputs.explanation.textContent = explanationText(result);
    outputs.message.textContent = result.messages[0] || result.source.note || `Calculado con ${result.term.days} días: base CETES ${result.cetesDayCountBase}, base ISR ${result.isrDayCountBase}.`;
  }
}

function readCalculatorData(root) {
  const script = root.querySelector('[data-cetes-data]');
  if (!script) {
    console.error('Missing CETES calculator data');
    return null;
  }
  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    console.error('Invalid CETES calculator data', error);
    return null;
  }
}

function realReturnText(result) {
  if (result.realReturnPeriodPercent === null) {
    return 'Falta inflación para saber si ganaste poder de compra. Por ahora estás viendo rendimiento neto nominal.';
  }
  if (result.realReturnPeriodPercent > 0.25) {
    return `Rendimiento real estimado: ${formatPercent(result.realReturnPeriodPercent)}. Tu resultado le ganaría a la inflación en este escenario.`;
  }
  if (result.realReturnPeriodPercent >= -0.25) {
    return `Rendimiento real estimado: ${formatPercent(result.realReturnPeriodPercent)}. Le gana por poquito; la inflación casi se come la ganancia.`;
  }
  return `Rendimiento real estimado: ${formatPercent(result.realReturnPeriodPercent)}. Aunque ganas dinero en pesos, perderías poder de compra en este escenario.`;
}

function explanationText(result) {
  if (result.realReturnPeriodPercent === null) {
    return 'Este cálculo todavía está incompleto para hablar de poder de compra. Ya sabemos cuánto quedaría después de la retención, pero falta decir contra qué inflación lo estás comparando.';
  }
  return 'Si el rendimiento real sale positivo, tu inversión habría crecido más que la inflación que capturaste. Si sale negativo, no significa que perdiste pesos: significa que, con ese escenario de inflación, tu dinero compraría menos que al inicio.';
}

function formatMoney(value) {
  return currencyFormatter.format(value);
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
