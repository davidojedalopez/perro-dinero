export function initPayDebtInvestTool() {
  document.querySelectorAll('[data-pay-debt-invest]').forEach((tool) => {
    initDebtVsInvestmentCalculator(tool);
    initEmergencyBounceSimulator(tool);
    initPayoffGame(tool);
  });
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-MX', {
  maximumFractionDigits: 1,
});

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function setText(root, selector, value) {
  const element = root.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setBar(root, selector, value, max) {
  const element = root.querySelector(selector);
  if (!element) {
    return;
  }
  const percentage = max > 0 ? Math.max(3, Math.min(100, (value / max) * 100)) : 0;
  element.style.width = `${percentage}%`;
}

function initDebtVsInvestmentCalculator(tool) {
  const calculator = tool.querySelector('[data-debt-vs-investment]');
  if (!calculator) {
    return;
  }

  const update = () => {
    const amount = parseNumber(calculator.querySelector('[data-field="amount"]')?.value, 0);
    const debtRate = parseNumber(calculator.querySelector('[data-field="debt-rate"]')?.value, 0);
    const investmentRate = parseNumber(calculator.querySelector('[data-field="investment-rate"]')?.value, 0);
    const taxRate = parseNumber(calculator.querySelector('[data-field="tax-rate"]')?.value, 0);
    const months = parseNumber(calculator.querySelector('[data-field="months"]')?.value, 12);
    const hasEmergencyFund = calculator.querySelector('[data-field="has-emergency-fund"]')?.checked;

    const years = months / 12;
    const debtInterestAvoided = amount * (debtRate / 100) * years;
    const netInvestmentRate = Math.max(investmentRate - taxRate, 0);
    const investmentGain = amount * (netInvestmentRate / 100) * years;
    const gap = debtInterestAvoided - investmentGain;
    const maxValue = Math.max(debtInterestAvoided, investmentGain, 1);

    setText(calculator, '[data-output="debt-interest"]', currencyFormatter.format(debtInterestAvoided));
    setText(calculator, '[data-output="investment-gain"]', currencyFormatter.format(investmentGain));
    setText(calculator, '[data-output="gap"]', currencyFormatter.format(Math.abs(gap)));
    setText(calculator, '[data-output="net-investment-rate"]', `${numberFormatter.format(netInvestmentRate)}%`);

    const decision = calculator.querySelector('[data-output="decision"]');
    if (decision) {
      if (!hasEmergencyFund) {
        decision.textContent = 'Primero considera separar un mini fondo. Si te quedas en ceros, el siguiente ladrillazo puede regresarte a la tarjeta.';
      } else if (gap > 500) {
        decision.textContent = 'Con estos números, pagar deuda se ve más poderoso que invertir. Esa tasa te está ladrando más fuerte que CETES.';
      } else if (gap < -500) {
        decision.textContent = 'Aquí invertir empieza a verse competitivo. Pero ojo: rendimiento esperado no es lo mismo que interés que dejas de pagar.';
      } else {
        decision.textContent = 'Está bastante parejo. La liquidez, impuestos, riesgo y paz mental probablemente deciden más que la calculadora.';
      }
    }

    setBar(calculator, '[data-bar="debt"]', debtInterestAvoided, maxValue);
    setBar(calculator, '[data-bar="investment"]', investmentGain, maxValue);
  };

  calculator.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });

  update();
}

function initEmergencyBounceSimulator(tool) {
  const simulator = tool.querySelector('[data-emergency-bounce]');
  if (!simulator) {
    return;
  }

  const update = () => {
    const extraMoney = parseNumber(simulator.querySelector('[data-field="extra-money"]')?.value, 0);
    const emergencyCost = parseNumber(simulator.querySelector('[data-field="emergency-cost"]')?.value, 0);
    const debtRate = parseNumber(simulator.querySelector('[data-field="bounce-rate"]')?.value, 0);
    const reservePercent = parseNumber(simulator.querySelector('[data-field="reserve-percent"]')?.value, 0);
    const reserve = extraMoney * (reservePercent / 100);
    const debtPayment = Math.max(extraMoney - reserve, 0);
    const newDebt = Math.max(emergencyCost - reserve, 0);
    const firstYearBounceCost = newDebt * (debtRate / 100);
    const maxValue = Math.max(extraMoney, emergencyCost, debtPayment, reserve, newDebt, 1);

    setText(simulator, '[data-output="reserve-percent"]', `${numberFormatter.format(reservePercent)}%`);
    setText(simulator, '[data-output="reserve"]', currencyFormatter.format(reserve));
    setText(simulator, '[data-output="debt-payment"]', currencyFormatter.format(debtPayment));
    setText(simulator, '[data-output="new-debt"]', currencyFormatter.format(newDebt));
    setText(simulator, '[data-output="bounce-cost"]', currencyFormatter.format(firstYearBounceCost));

    const story = simulator.querySelector('[data-output="bounce-story"]');
    if (story) {
      if (newDebt <= 0) {
        story.textContent = 'Tu mini fondo aguantó el golpe. No pagaste tanta deuda hoy, pero evitaste que la emergencia se financiara con tarjeta.';
      } else if (reserve <= 0) {
        story.textContent = 'Pagaste más deuda hoy, pero la emergencia completa rebotó a la tarjeta. Excel feliz, vida real enojada.';
      } else {
        story.textContent = 'El colchón no cubrió todo, pero sí redujo el rebote. A veces la decisión correcta es menos heroica y más sobrevivible.';
      }
    }

    setBar(simulator, '[data-bar="reserve"]', reserve, maxValue);
    setBar(simulator, '[data-bar="debt-payment"]', debtPayment, maxValue);
    setBar(simulator, '[data-bar="new-debt"]', newDebt, maxValue);
  };

  simulator.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });

  update();
}

function initPayoffGame(tool) {
  const game = tool.querySelector('[data-payoff-game]');
  if (!game) {
    return;
  }

  const debts = [
    { name: 'Tarjeta A', balance: 8000, rate: 52.7, minPayment: 450 },
    { name: 'Crédito personal', balance: 25000, rate: 40.5, minPayment: 1200 },
    { name: 'Auto', balance: 150000, rate: 14.3, minPayment: 3500 },
  ];

  const simulate = (strategy, extraPayment) => {
    const state = debts.map((debt) => ({ ...debt, paidOffMonth: null, interest: 0 }));
    let month = 0;
    let totalInterest = 0;
    const maxMonths = 600;

    const sortDebts = (items) => [...items].sort((a, b) => {
      if (strategy === 'avalanche') {
        return b.rate - a.rate || a.balance - b.balance;
      }
      return a.balance - b.balance || b.rate - a.rate;
    });

    while (month < maxMonths && state.some((debt) => debt.balance > 0.01)) {
      month += 1;
      state.forEach((debt) => {
        if (debt.balance <= 0.01) {
          return;
        }
        const interest = debt.balance * (debt.rate / 100 / 12);
        debt.balance += interest;
        debt.interest += interest;
        totalInterest += interest;
      });

      state.forEach((debt) => {
        if (debt.balance <= 0.01) {
          return;
        }
        const payment = Math.min(debt.minPayment, debt.balance);
        debt.balance -= payment;
      });

      let snowball = extraPayment;
      for (const debt of sortDebts(state.filter((item) => item.balance > 0.01))) {
        if (snowball <= 0) {
          break;
        }
        const payment = Math.min(snowball, debt.balance);
        debt.balance -= payment;
        snowball -= payment;
      }

      state.forEach((debt) => {
        if (debt.balance <= 0.01 && debt.paidOffMonth === null) {
          debt.paidOffMonth = month;
          debt.balance = 0;
        }
      });
    }

    return { month, totalInterest, maxedOut: month >= maxMonths };
  };

  const update = () => {
    const extraPayment = parseNumber(game.querySelector('[data-field="extra-payment"]')?.value, 0);
    const avalanche = simulate('avalanche', extraPayment);
    const snowball = simulate('snowball', extraPayment);
    const motivationCost = Math.max(snowball.totalInterest - avalanche.totalInterest, 0);
    const maxInterest = Math.max(avalanche.totalInterest, snowball.totalInterest, 1);

    setText(game, '[data-output="avalanche-months"]', `${avalanche.month} meses`);
    setText(game, '[data-output="avalanche-interest"]', currencyFormatter.format(avalanche.totalInterest));
    setText(game, '[data-output="snowball-months"]', `${snowball.month} meses`);
    setText(game, '[data-output="snowball-interest"]', currencyFormatter.format(snowball.totalInterest));
    setText(game, '[data-output="motivation-cost"]', currencyFormatter.format(motivationCost));

    const summary = game.querySelector('[data-output="payoff-summary"]');
    if (summary) {
      if (motivationCost < 100) {
        summary.textContent = 'En este escenario casi empatan. Si la bola de nieve te mantiene motivado, no es un pecado financiero.';
      } else {
        summary.textContent = `La avalancha cobra menos intereses. Si eliges bola de nieve, esa motivación cuesta aprox. ${currencyFormatter.format(motivationCost)}.`;
      }
    }

    setBar(game, '[data-bar="avalanche"]', avalanche.totalInterest, maxInterest);
    setBar(game, '[data-bar="snowball"]', snowball.totalInterest, maxInterest);
  };

  game.querySelectorAll('input').forEach((input) => input.addEventListener('input', update));
  update();
}
