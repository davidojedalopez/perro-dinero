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
  const iframe = newsletterCta.querySelector('iframe.newsletter-cta-iframe');

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
  const rowTemplate = tool.querySelector('template[data-debt-row]');
  const extraPaymentInput = tool.querySelector('[data-extra-payment]');
  const strategyInput = tool.querySelector('[data-strategy]');
  const resultsContainer = tool.querySelector('[data-results]');
  const resultsRows = tool.querySelector('[data-results-rows]');
  const errorBox = tool.querySelector('[data-error]');
  const totalMonths = tool.querySelector('[data-total-months]');
  const totalInterest = tool.querySelector('[data-total-interest]');
  const totalPaid = tool.querySelector('[data-total-paid]');
  const currencyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  });

  const defaultDebts = [
    { name: 'Tarjeta de crédito', balance: 18000, rate: 42, min: 900 },
    { name: 'Préstamo personal', balance: 60000, rate: 22, min: 1800 }
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

    nameInput.value = values.name || '';
    balanceInput.value = values.balance ?? '';
    rateInput.value = values.rate ?? '';
    minInput.value = values.min ?? '';

    removeButton.addEventListener('click', () => {
      row.remove();
    });

    rowsContainer.appendChild(fragment);
  };

  const parseNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const collectDebts = () => {
    const rows = Array.from(rowsContainer.querySelectorAll('[data-debt-row]'));
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
    const sortedDebts = [...debts].sort((a, b) => {
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

    const state = sortedDebts.map((debt) => ({
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
      for (const debt of state) {
        if (remainingExtra <= 0) {
          break;
        }
        if (debt.balance <= 0) {
          continue;
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

  const renderResults = (result) => {
    resultsRows.innerHTML = '';

    result.debts.forEach((debt, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-3 font-semibold text-accent-900 dark:text-accent-dark-200">${index + 1}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${debt.name}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${formatMonths(debt.payoffMonth)}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${currencyFormatter.format(debt.interestPaid)}</td>
        <td class="px-4 py-3 text-accent-800 dark:text-accent-dark-200">${currencyFormatter.format(debt.totalPaid)}</td>
      `;
      resultsRows.appendChild(row);
    });

    totalMonths.textContent = formatMonths(result.months);
    totalInterest.textContent = currencyFormatter.format(result.totalInterestPaid);
    totalPaid.textContent = currencyFormatter.format(result.totalPaid);
  };

  addDebtButton.addEventListener('click', () => {
    createRow();
  });

  calculateButton.addEventListener('click', () => {
    clearError();
    const debts = collectDebts();
    const extraPayment = parseNumber(extraPaymentInput.value);
    const strategy = strategyInput.value;

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

    const result = simulatePlan(debts, extraPayment, strategy);
    if (result.maxedOut) {
      showError('La simulación superó 600 meses. Revisa los pagos mínimos o la tasa de interés.');
    }
    renderResults(result);
    resultsContainer.classList.remove('hidden');
  });

  if (rowsContainer.children.length === 0) {
    defaultDebts.forEach((debt) => createRow(debt));
  }
}
