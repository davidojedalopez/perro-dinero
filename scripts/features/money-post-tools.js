const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat('es-MX', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const parseMoney = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
};

const parseRate = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
};

const setText = (root, key, value) => {
  const node = root.querySelector(`[data-output="${key}"]`);
  if (node) node.textContent = value;
};

const setBar = (root, key, percentValue) => {
  const node = root.querySelector(`[data-bar="${key}"]`);
  if (node) node.style.width = `${Math.max(0, Math.min(100, percentValue))}%`;
};

const field = (root, key) => root.querySelector(`[data-field="${key}"]`);

const bindToolInputs = (tool, update, selector = 'input, select') => {
  tool.querySelectorAll(selector).forEach((input) => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });
};

export function initMoneyParkingTools() {
  document.querySelectorAll('[data-cash-parking]').forEach((root) => {
    initParkingSelector(root);
    initSofipoProtection(root);
    initCetesLadder(root);
  });
}

export function initRetirementLayerTools() {
  document.querySelectorAll('[data-retirement-layers]').forEach((root) => {
    initRetirementPriorities(root);
    initPprDeduction(root);
    initLiquidityLock(root);
  });
}

export function initMoneyPostTools() {
  initMoneyParkingTools();
  initRetirementLayerTools();
}

function initParkingSelector(root) {
  const tool = root.querySelector('[data-parking-selector]');
  if (!tool) return;

  const update = () => {
    const amount = parseMoney(field(tool, 'parking-amount')?.value, 40000);
    const horizon = field(tool, 'parking-horizon')?.value || 'six-months';
    const pain = parseRate(field(tool, 'parking-liquidity')?.value, 8);
    const acceptsRisk = field(tool, 'parking-risk')?.checked;
    const purpose = field(tool, 'parking-purpose')?.value || 'goal';

    let recommendation = 'CETES del plazo más cercano';
    let reason = 'Tienes fecha relativamente clara, así que amarrar plazo puede ordenar la decisión.';
    let liquidityScore = 50;
    let yieldScore = 55;
    let riskScore = 35;

    if (purpose === 'emergency' || horizon === 'now' || pain >= 8) {
      recommendation = 'BONDDIA o cuenta muy líquida';
      reason = 'Aquí la puerta de salida vale más que exprimir unos puntos de tasa. El dinero tiene que aparecer cuando lo necesitas.';
      liquidityScore = 95;
      yieldScore = 35;
      riskScore = 15;
    } else if (horizon === 'one-year-plus' && acceptsRisk && amount <= 220860) {
      recommendation = 'SOFIPO revisada, sin rebasar protección';
      reason = 'Puede tener sentido perseguir más tasa si aceptas riesgo de institución, entiendes condiciones y no usas dinero de emergencia.';
      liquidityScore = 30;
      yieldScore = 85;
      riskScore = 70;
    } else if (horizon === 'one-year-plus' && amount > 220860) {
      recommendation = 'Divide: CETES + SOFIPO sólo hasta el paraguas';
      reason = 'El monto ya rebasa el ejemplo de protección por SOFIPO. No finjas que todo está igual de cubierto.';
      liquidityScore = 35;
      yieldScore = 65;
      riskScore = 60;
    } else if (horizon === 'one-three') {
      recommendation = 'BONDDIA o CETES 28/91 días';
      reason = 'La fecha está cerca. Puedes usar plazos cortos, pero no bloquees todo si la fecha se puede adelantar.';
      liquidityScore = 75;
      yieldScore = 45;
      riskScore = 25;
    }

    setText(tool, 'parking-recommendation', recommendation);
    setText(tool, 'parking-reason', reason);
    setText(tool, 'parking-amount', currency.format(amount));
    setBar(tool, 'parking-liquidity', liquidityScore);
    setBar(tool, 'parking-yield', yieldScore);
    setBar(tool, 'parking-risk', riskScore);
  };

  bindToolInputs(tool, update);
  update();
}

function initSofipoProtection(root) {
  const tool = root.querySelector('[data-sofipo-protection]');
  if (!tool) return;

  const update = () => {
    const amount = parseMoney(field(tool, 'sofipo-amount')?.value, 250000);
    const institutions = Math.max(1, Math.floor(parseMoney(field(tool, 'sofipo-count')?.value, 1)));
    const udiValue = parseMoney(field(tool, 'udi-value')?.value, 8.834391);
    const perSofipo = 25000 * udiValue;
    const totalCovered = perSofipo * institutions;
    const protectedAmount = Math.min(amount, totalCovered);
    const exposed = Math.max(0, amount - protectedAmount);
    const protectedPercent = amount ? protectedAmount / amount * 100 : 0;

    setText(tool, 'per-sofipo', currency.format(perSofipo));
    setText(tool, 'total-covered', currency.format(totalCovered));
    setText(tool, 'protected-amount', currency.format(protectedAmount));
    setText(tool, 'exposed-amount', currency.format(exposed));
    setText(tool, 'protection-story', exposed > 0
      ? `Con estos supuestos, ${currency.format(exposed)} queda fuera del paraguas. No es tragedia automática, pero ya no es “todo está protegido”.`
      : 'Todo el monto queda debajo del paraguas aproximado. Aun así revisa institución, plazo, tasa neta y condiciones de salida.');
    setBar(tool, 'protected', protectedPercent);
    setBar(tool, 'exposed', 100 - protectedPercent);
  };

  bindToolInputs(tool, update, 'input');
  update();
}

function initCetesLadder(root) {
  const tool = root.querySelector('[data-cetes-ladder]');
  if (!tool) return;

  const terms = [28, 91, 182, 364];
  const update = () => {
    const amount = parseMoney(field(tool, 'ladder-amount')?.value, 80000);
    const steps = Math.max(1, Math.min(4, Math.floor(parseMoney(field(tool, 'ladder-steps')?.value, 4))));
    const rate = parseRate(field(tool, 'ladder-rate')?.value, 7.16) / 100;
    const selectedTerms = terms.slice(0, steps);
    const perStep = amount / steps;
    const gross = selectedTerms.reduce((sum, days) => sum + perStep * rate * days / 365, 0);
    const cadence = selectedTerms.length > 1 ? `cada ${selectedTerms[0]} a ${selectedTerms[selectedTerms.length - 1]} días se libera una parte` : `una parte vence a ${selectedTerms[0]} días`;

    setText(tool, 'ladder-per-step', currency.format(perStep));
    setText(tool, 'ladder-gross', currency.format(gross));
    setText(tool, 'ladder-cadence', cadence);

    const list = tool.querySelector('[data-output="ladder-list"]');
    if (list) {
      list.innerHTML = selectedTerms.map((days, index) => `<li><strong>Escalón ${index + 1}:</strong> ${currency.format(perStep)} a ${days} días</li>`).join('');
    }
  };

  bindToolInputs(tool, update, 'input');
  update();
}

function initRetirementPriorities(root) {
  const tool = root.querySelector('[data-retirement-priority]');
  if (!tool) return;

  const update = () => {
    const hasAfore = field(tool, 'has-afore')?.checked;
    const emergency = field(tool, 'has-emergency')?.checked;
    const expensiveDebt = field(tool, 'has-debt')?.checked;
    const income = parseMoney(field(tool, 'annual-income')?.value, 600000);
    const canLock = field(tool, 'can-lock')?.checked;
    const wantsFlex = field(tool, 'wants-flexibility')?.checked;

    let priority = 'Ordena la base antes de elegir producto';
    let story = 'Si falta fondo de emergencia o hay deuda cara, el retiro empieza por no sabotear tu flujo de hoy.';
    let afore = hasAfore ? 70 : 20;
    let ppr = 20;
    let etf = wantsFlex ? 55 : 35;

    if (expensiveDebt || !emergency) {
      priority = expensiveDebt ? 'Primero mata deuda cara' : 'Primero arma fondo de emergencia';
      afore = hasAfore ? 45 : 15;
      ppr = 10;
      etf = 20;
    } else if (income >= 800000 && canLock) {
      priority = 'PPR puede tener sentido fiscal';
      story = 'Si pagas ISR relevante y de verdad puedes amarrar dinero hasta retiro, el PPR deja de ser folleto y empieza a ser herramienta.';
      ppr = 85;
      afore = hasAfore ? 75 : 25;
      etf = wantsFlex ? 70 : 45;
    } else if (wantsFlex) {
      priority = 'ETFs pueden ser la capa flexible';
      story = 'Con fondo listo y deuda controlada, los ETFs pueden complementar sin candado fiscal. Eso sí: tú cargas la receta, impuestos y rebalanceo.';
      etf = 85;
      afore = hasAfore ? 75 : 30;
      ppr = canLock && income > 400000 ? 55 : 25;
    } else if (hasAfore) {
      priority = 'Revisa y fortalece tu AFORE';
      story = 'No es el producto más sexy, pero ya está en tu edificio. Comisión, SIEFORE y aportaciones voluntarias importan más que ignorarla.';
      afore = 90;
      ppr = canLock ? 50 : 20;
      etf = 45;
    }

    setText(tool, 'retirement-priority', priority);
    setText(tool, 'retirement-story', story);
    setBar(tool, 'afore-layer', afore);
    setBar(tool, 'ppr-layer', ppr);
    setBar(tool, 'etf-layer', etf);
  };

  bindToolInputs(tool, update, 'input');
  update();
}

function initPprDeduction(root) {
  const tool = root.querySelector('[data-ppr-deduction]');
  if (!tool) return;

  const update = () => {
    const income = parseMoney(field(tool, 'ppr-income')?.value, 1200000);
    const umaAnnual = parseMoney(field(tool, 'uma-annual')?.value, 42794.64);
    const contribution = parseMoney(field(tool, 'ppr-contribution')?.value, 120000);
    const marginalRate = parseRate(field(tool, 'marginal-rate')?.value, 30) / 100;
    const incomeLimit = income * 0.10;
    const umaLimit = umaAnnual * 5;
    const deductibleLimit = Math.min(incomeLimit, umaLimit);
    const deductible = Math.min(contribution, deductibleLimit);
    const excess = Math.max(0, contribution - deductibleLimit);
    const estimatedTax = deductible * marginalRate;

    setText(tool, 'income-limit', currency.format(incomeLimit));
    setText(tool, 'uma-limit', currency.format(umaLimit));
    setText(tool, 'deductible-limit', currency.format(deductibleLimit));
    setText(tool, 'deductible-amount', currency.format(deductible));
    setText(tool, 'excess-amount', currency.format(excess));
    setText(tool, 'tax-estimate', currency.format(estimatedTax));
    setText(tool, 'ppr-note', excess > 0
      ? 'Hay aportación por encima del límite deducible estimado. Eso no la vuelve inútil, pero ya no todo juega el mismo partido fiscal.'
      : 'La aportación cabe dentro del límite deducible estimado. Ahora falta revisar comisiones, candado, artículo fiscal y si de verdad no necesitas esa lana antes.');
    setBar(tool, 'income-limit', Math.min(100, incomeLimit / Math.max(incomeLimit, umaLimit) * 100));
    setBar(tool, 'uma-limit', Math.min(100, umaLimit / Math.max(incomeLimit, umaLimit) * 100));
  };

  bindToolInputs(tool, update, 'input');
  update();
}

function initLiquidityLock(root) {
  const tool = root.querySelector('[data-liquidity-lock]');
  if (!tool) return;

  const update = () => {
    const amount = parseMoney(field(tool, 'lock-amount')?.value, 100000);
    const aforeShare = parseRate(field(tool, 'afore-share')?.value, 30);
    const pprShare = parseRate(field(tool, 'ppr-share')?.value, 30);
    const etfShare = Math.max(0, 100 - aforeShare - pprShare);
    const scenario = field(tool, 'lock-scenario')?.value || 'emergency';
    const aforeAmount = amount * aforeShare / 100;
    const pprAmount = amount * pprShare / 100;
    const etfAmount = amount * etfShare / 100;

    let accessible = etfAmount;
    let story = 'En una emergencia de corto plazo, la parte más accesible suele ser ETFs/cuenta flexible. AFORE y PPR tienen reglas o candados fuertes.';
    if (scenario === 'retirement') {
      accessible = amount;
      story = 'A los 65, las tres capas empiezan a hacer el trabajo para el que fueron pensadas. El candado deja de estorbar tanto.';
    } else if (scenario === 'house') {
      accessible = etfAmount;
      story = 'Para comprar casa, la flexibilidad importa. Vender ETFs puede no convenir si el mercado va abajo, pero al menos la puerta existe.';
    } else if (scenario === 'move') {
      accessible = etfAmount + pprAmount * 0.25;
      story = 'Cambio de país o vida rara: la flexibilidad se vuelve valiosa. PPR/AFORE pueden tener supuestos, trámites o castigos.';
    }

    setText(tool, 'afore-amount', currency.format(aforeAmount));
    setText(tool, 'ppr-amount', currency.format(pprAmount));
    setText(tool, 'etf-amount', currency.format(etfAmount));
    setText(tool, 'accessible-amount', currency.format(accessible));
    setText(tool, 'lock-story', story);
    setText(tool, 'etf-share', `${Math.round(etfShare)}%`);
    setBar(tool, 'afore-lock', aforeShare);
    setBar(tool, 'ppr-lock', pprShare);
    setBar(tool, 'etf-lock', etfShare);
  };

  bindToolInputs(tool, update);
  update();
}
