import '../styles/base.css'
import '../styles/main.css'
import { annotate } from 'rough-notation'

window.addEventListener("load", (event) => {
  setDarkModeToggle();
  setAnnotations();
  setNewsletterObserver();
  setDebtPlannerTool();
}, false);

function setNewsletterObserver() {
  const newsletterCta = document.querySelector('.newsletter-cta');
  if (!newsletterCta) {
    return;
  }
  const iframe = newsletterCta.querySelector('iframe.newsletter-cta-iframe');
  if (!iframe) {
    return;
  }

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        iframe.src = iframe.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(newsletterCta);
}

function setAnnotations() {
  const annotations = document.querySelectorAll('.annotated');
  const options = {
    threshold: 1
  };

  if (annotations.length <= 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          annotate(entry.target, {
            type: 'box',
            padding: 5,
            multiline: true,
            animationDuration: 1000,
            color: "#b91c1c"
          }).show();
        }, 500)
        observer.unobserve(entry.target)
      }
    });
  }, options);

  for (const annotation of annotations) {
    observer.observe(annotation);
  }
}

function setDarkModeToggle() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if (!darkModeToggle) {
    return;
  }

  darkModeToggle.checked = !document.documentElement.classList.contains('dark');
  darkModeToggle.parentElement.classList.remove('hidden');

  darkModeToggle.addEventListener('click', (event) => {
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('dark-mode-enabled', 'false');
    } else {
      localStorage.setItem('dark-mode-enabled', 'true');
    }
    document.documentElement.classList.toggle('dark');
  });
}

function setDebtPlannerTool() {
  const tool = document.querySelector('[data-debt-planner]');
  if (!tool) {
    return;
  }

  const addDebtButton = tool.querySelector('[data-add-debt]');
  const calculateButton = tool.querySelector('[data-calc]');
  const rowsContainer = tool.querySelector('[data-debt-rows]');
  const cardsContainer = tool.querySelector('[data-debt-cards]');
  const rowTemplate = tool.querySelector('template[data-debt-row]');
  const cardTemplate = tool.querySelector('template[data-debt-card]');
  const extraPaymentInput = tool.querySelector('[data-extra-payment]');
  const resultsContainer = tool.querySelector('[data-results]');
  const resultsRows = tool.querySelector('[data-results-rows]');
  const resultsCards = tool.querySelector('[data-results-cards]');
  const errorBox = tool.querySelector('[data-error]');
  const totalMonths = tool.querySelector('[data-total-months]');
  const totalInterest = tool.querySelector('[data-total-interest]');
  const totalPaid = tool.querySelector('[data-total-paid]');
  const totalDebt = tool.querySelector('[data-total-debt]');
  const snowballInterest = tool.querySelector('[data-snowball-interest]');
  const snowballMonths = tool.querySelector('[data-snowball-months]');
  const avalancheInterest = tool.querySelector('[data-avalanche-interest]');
  const avalancheMonths = tool.querySelector('[data-avalanche-months]');
  const recommendation = tool.querySelector('[data-recommendation]');
  const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  });

  tool.addEventListener('focusin', (event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    if (event.target.type === 'text' || event.target.type === 'number') {
      event.target.select();
    }
  });

  const defaultDebts = [
    { name: 'Tarjeta de crédito (tasa alta)', balance: 18000, rate: 59, min: 700 },
    { name: 'Crédito automotriz (tasa media)', balance: 95000, rate: 18, min: 2100 },
    { name: 'Préstamo personal (tasa baja)', balance: 40000, rate: 12, min: 1200 }
  ];

  const formatMonths = (months) => {
    if (!Number.isFinite(months)) {
      return '';
    }
    return months === 1 ? '1 mes' : `${months} meses`;
  };

  const showError = (message) => {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  };

  const clearError = () => {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
  };

  const createRow = (values = {}) => {
    const fragment = rowTemplate.content.cloneNode(true);
    const row = fragment.querySelector('[data-debt-row]');
    const nameInput = row.querySelector('[data-field="name"]');
    const balanceInput = row.querySelector('[data-field="balance"]');
    const rateInput = row.querySelector('[data-field="rate"]');
    const minInput = row.querySelector('[data-field="min"]');
    const removeButton = row.querySelector('[data-remove]');
    const rowId = `debt-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    nameInput.value = values.name || '';
    balanceInput.value = values.balance ?? '';
    rateInput.value = values.rate ?? '';
    minInput.value = values.min ?? '';

    row.dataset.rowId = rowId;
    removeButton.addEventListener('click', () => {
      tool.querySelectorAll(`[data-row-id="${rowId}"]`).forEach((item) => item.remove());
    });

    rowsContainer.appendChild(fragment);

    if (cardTemplate && cardsContainer) {
      const cardFragment = cardTemplate.content.cloneNode(true);
      const card = cardFragment.querySelector('[data-debt-card]');
      const cardNameInput = card.querySelector('[data-field="name"]');
      const cardBalanceInput = card.querySelector('[data-field="balance"]');
      const cardRateInput = card.querySelector('[data-field="rate"]');
      const cardMinInput = card.querySelector('[data-field="min"]');
      const cardRemoveButton = card.querySelector('[data-remove]');

      cardNameInput.value = values.name || '';
      cardBalanceInput.value = values.balance ?? '';
      cardRateInput.value = values.rate ?? '';
      cardMinInput.value = values.min ?? '';
      card.dataset.rowId = rowId;

      cardRemoveButton.addEventListener('click', () => {
        tool.querySelectorAll(`[data-row-id="${rowId}"]`).forEach((item) => item.remove());
      });

      cardsContainer.appendChild(cardFragment);
    }
  };

  const parseNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const collectDebts = () => {
    const sourceContainer = cardsContainer && cardsContainer.children.length > 0
      ? cardsContainer
      : rowsContainer;
    const rows = Array.from(sourceContainer.querySelectorAll('[data-debt-row], [data-debt-card]'));
    return rows
      .map((row) => {
        const name = row.querySelector('[data-field="name"]').value.trim();
        const balance = parseNumber(row.querySelector('[data-field="balance"]').value);
        const rate = parseNumber(row.querySelector('[data-field="rate"]').value);
        const min = parseNumber(row.querySelector('[data-field="min"]').value);

        return {
          name,
          balance,
          rate,
          minPayment: min
        };
      })
      .filter((debt) => debt.name && debt.balance > 0);
  };

  const simulatePlan = (debts, extraPayment, strategy) => {
    const sortByStrategy = (items) => [...items].sort((a, b) => {
      if (strategy === 'avalanche') {
        if (b.rate === a.rate) {
          return a.balance - b.balance;
        }
        return b.rate - a.rate;
      }
      if (a.balance === b.balance) {
        return b.rate - a.rate;
      }
      return a.balance - b.balance;
    });

    const state = debts.map((debt) => ({
      ...debt,
      balance: debt.balance,
      interestPaid: 0,
      totalPaid: 0,
      payoffMonth: null
    }));

    const maxMonths = 600;
    let month = 0;
    let totalInterestPaid = 0;

    while (month < maxMonths && state.some((debt) => debt.balance > 0)) {
      month += 1;

      state.forEach((debt) => {
        if (debt.balance <= 0) {
          return;
        }
        const monthlyRate = debt.rate > 0 ? debt.rate / 12 / 100 : 0;
        const interest = debt.balance * monthlyRate;
        debt.balance += interest;
        debt.interestPaid += interest;
        totalInterestPaid += interest;
      });

      state.forEach((debt) => {
        if (debt.balance <= 0) {
          return;
        }
        const payment = Math.min(debt.minPayment, debt.balance);
        debt.balance -= payment;
        debt.totalPaid += payment;
      });

      let remainingExtra = extraPayment;
      const prioritizedDebts = sortByStrategy(state.filter((debt) => debt.balance > 0));
      for (const debt of prioritizedDebts) {
        if (remainingExtra <= 0) {
          break;
        }
        const payment = Math.min(remainingExtra, debt.balance);
        debt.balance -= payment;
        debt.totalPaid += payment;
        remainingExtra -= payment;
      }

      state.forEach((debt) => {
        if (debt.balance <= 0 && debt.payoffMonth === null) {
          debt.payoffMonth = month;
        }
      });
    }

    return {
      months: month,
      totalInterestPaid,
      totalPaid: state.reduce((sum, debt) => sum + debt.totalPaid, 0),
      debts: state,
      maxedOut: month >= maxMonths
    };
  };

  const renderResults = (result, comparison) => {
    resultsRows.innerHTML = '';
    if (resultsCards) {
      resultsCards.innerHTML = '';
    }

    const orderedDebts = [...result.debts].sort((a, b) => {
      if (a.payoffMonth === null && b.payoffMonth === null) {
        return 0;
      }
      if (a.payoffMonth === null) {
        return 1;
      }
      if (b.payoffMonth === null) {
        return -1;
      }
      return a.payoffMonth - b.payoffMonth;
    });

    orderedDebts.forEach((debt, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-3 font-semibold text-accent-900 dark:text-accent-dark-200">${index + 1}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${debt.name}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${formatMonths(debt.payoffMonth)}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${currencyFormatter.format(debt.interestPaid)}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${currencyFormatter.format(debt.totalPaid)}</td>
      `;
      resultsRows.appendChild(row);

      if (resultsCards) {
        const card = document.createElement('div');
        card.className = 'rounded-xl border border-accent-200/60 dark:border-foreground-dark/60 bg-white dark:bg-background-dark p-4 space-y-2';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-accent-700 dark:text-accent-dark-600">Orden ${index + 1}</p>
            <p class="text-sm font-semibold text-accent-900 dark:text-accent-dark-200">${debt.name}</p>
          </div>
          <div class="text-sm text-accent-700 dark:text-accent-dark-600">
            <p><span class="font-semibold">Mes de liquidación:</span> ${formatMonths(debt.payoffMonth)}</p>
            <p><span class="font-semibold">Interés pagado:</span> ${currencyFormatter.format(debt.interestPaid)}</p>
            <p><span class="font-semibold">Pago total:</span> ${currencyFormatter.format(debt.totalPaid)}</p>
          </div>
        `;
        resultsCards.appendChild(card);
      }
    });

    totalMonths.textContent = formatMonths(result.months);
    totalInterest.textContent = currencyFormatter.format(result.totalInterestPaid);
    totalPaid.textContent = currencyFormatter.format(result.totalPaid);

    if (comparison) {
      totalDebt.textContent = currencyFormatter.format(comparison.totalDebt);
      snowballInterest.textContent = currencyFormatter.format(comparison.snowball.totalInterestPaid);
      snowballMonths.textContent = formatMonths(comparison.snowball.months);
      avalancheInterest.textContent = currencyFormatter.format(comparison.avalanche.totalInterestPaid);
      avalancheMonths.textContent = formatMonths(comparison.avalanche.months);
      recommendation.textContent = comparison.recommendation;
    }
  };

  addDebtButton.addEventListener('click', () => {
    createRow();
  });

  calculateButton.addEventListener('click', () => {
    clearError();
    const debts = collectDebts();
    const extraPayment = parseNumber(extraPaymentInput.value);

    if (debts.length === 0) {
      showError('Agrega al menos una deuda con saldo válido.');
      resultsContainer.classList.remove('hidden');
      return;
    }

    const totalMinimums = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
    if (totalMinimums + extraPayment <= 0) {
      showError('Agrega un pago mínimo o un pago extra mensual.');
      resultsContainer.classList.remove('hidden');
      return;
    }

    const snowballResult = simulatePlan(debts, extraPayment, 'snowball');
    const avalancheResult = simulatePlan(debts, extraPayment, 'avalanche');
    const totalDebtValue = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const interestDiff = snowballResult.totalInterestPaid - avalancheResult.totalInterestPaid;
    const isTie = Math.abs(interestDiff) < 0.01;
    const bestResult = interestDiff <= 0
      ? { label: 'bola de nieve', result: snowballResult, other: avalancheResult }
      : { label: 'avalancha', result: avalancheResult, other: snowballResult };
    const interestSavings = Math.abs(interestDiff);
    const otherLabel = bestResult.label === 'bola de nieve' ? 'avalancha' : 'bola de nieve';
    const recommendationText = isTie
      ? `Ambas estrategias generan intereses muy similares (${currencyFormatter.format(snowballResult.totalInterestPaid)} sobre ${currencyFormatter.format(totalDebtValue)}), así que puedes elegir la que te motive más.`
      : `La mejor opción para pagar menos intereses es ${bestResult.label}, con ${currencyFormatter.format(bestResult.result.totalInterestPaid)} de intereses sobre ${currencyFormatter.format(totalDebtValue)}. Ahorras ${currencyFormatter.format(interestSavings)} frente a ${otherLabel}.`;
    const comparison = {
      totalDebt: totalDebtValue,
      snowball: snowballResult,
      avalanche: avalancheResult,
      recommendation: recommendationText
    };

    const result = bestResult.result;
    if (snowballResult.maxedOut || avalancheResult.maxedOut) {
      showError('La simulación superó 600 meses. Revisa los pagos mínimos o la tasa de interés.');
    }
    renderResults(result, comparison);
    resultsContainer.classList.remove('hidden');
  });

  if (rowsContainer.children.length === 0) {
    defaultDebts.forEach((debt) => createRow(debt));
  }
}
