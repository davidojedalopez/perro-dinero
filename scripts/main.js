import '../styles/base.css'
import '../styles/main.css'

window.addEventListener('load', () => {
  setDarkModeToggle();
  loadPageFeatures();
}, false);

function loadPageFeatures() {
  if (document.querySelector('.annotated')) {
    import(/* webpackChunkName: "annotations" */ './features/annotations')
      .then(({ initAnnotations }) => initAnnotations())
      .catch((error) => console.error('Failed to load annotations feature', error));
  }

  if (document.querySelector('[data-debt-planner]')) {
    import(/* webpackChunkName: "debt-planner" */ './features/debt-planner')
      .then(({ initDebtPlanner }) => initDebtPlanner())
      .catch((error) => console.error('Failed to load debt planner feature', error));
  }

  if (document.querySelector('[data-pay-debt-invest]')) {
    import(/* webpackChunkName: "pay-debt-invest" */ './features/pay-debt-invest')
      .then(({ initPayDebtInvestTool }) => initPayDebtInvestTool())
      .catch((error) => console.error('Failed to load pay debt vs invest feature', error));
  }

  if (document.querySelector('.newsletter-cta')) {
    import(/* webpackChunkName: "newsletter-observer" */ './features/newsletter-observer')
      .then(({ initNewsletterObserver }) => initNewsletterObserver())
      .catch((error) => console.error('Failed to load newsletter observer feature', error));
  }
}

function setDarkModeToggle() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if (!darkModeToggle) {
    return;
  }

  darkModeToggle.checked = !document.documentElement.classList.contains('dark');
  darkModeToggle.parentElement.classList.remove('hidden');

  darkModeToggle.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('dark-mode-enabled', 'false');
    } else {
      localStorage.setItem('dark-mode-enabled', 'true');
    }
    document.documentElement.classList.toggle('dark');
  });
}
