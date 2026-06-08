const REQUIRED_NUMERIC_FIELDS = [
  'purchasePrice',
  'currentMonthlyRent',
  'downPaymentPct',
  'mortgageTermYears',
  'mortgageNominalAnnualRatePct',
  'closingCostPct',
  'ownerAnnualTaxInsurancePct',
  'maintenanceAnnualPct',
  'homeAppreciationAnnualPct',
  'rentGrowthAnnualPct',
  'opportunityReturnAnnualPct',
  'sellingCostPct',
  'comparisonHorizonYears',
];

const FIELD_RANGES = {
  purchasePrice: { min: 0, max: Number.POSITIVE_INFINITY, inclusiveMin: false, message: 'Pon un precio de vivienda mayor a $0 para poder comparar.' },
  currentMonthlyRent: { min: 0, max: Number.POSITIVE_INFINITY, message: 'La renta no puede ser negativa.' },
  downPaymentPct: { min: 0, max: 95, message: 'Usa un enganche entre 0% y 95%.' },
  mortgageTermYears: { min: 1, max: 30, message: 'El plazo debe estar entre 1 y 30 años.' },
  mortgageNominalAnnualRatePct: { min: 0, max: 30, message: 'Pon una tasa entre 0% y 30%.' },
  catPct: { min: 0, max: 100, optional: true, message: 'El CAT debe estar entre 0% y 100%.' },
  closingCostPct: { min: 0, max: 25, message: 'Usa un porcentaje entre 0% y 25%.' },
  ownerAnnualTaxInsurancePct: { min: 0, max: 25, message: 'Usa un valor entre 0% y 25%.' },
  maintenanceAnnualPct: { min: 0, max: 25, message: 'Usa un valor entre 0% y 25%.' },
  homeAppreciationAnnualPct: { min: -20, max: 50, message: 'Usa un valor entre -20% y 50%.' },
  rentGrowthAnnualPct: { min: -20, max: 50, message: 'Usa un valor entre -20% y 50%.' },
  opportunityReturnAnnualPct: { min: -20, max: 50, message: 'Usa un valor entre -20% y 50%.' },
  sellingCostPct: { min: 0, max: 25, message: 'Usa un valor entre 0% y 25%.' },
  comparisonHorizonYears: { min: 1, max: 40, message: 'Usa un horizonte entre 1 y 40 años.' },
};

function asFiniteNumber(value) {
  if (value === '' || value === null || value === undefined) return Number.NaN;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function annualPctToEffectiveMonthlyRate(annualPct) {
  return (1 + annualPct / 100) ** (1 / 12) - 1;
}

function mortgagePayment(principal, annualNominalRatePct, termMonths) {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualNominalRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return principal * monthlyRate / (1 - (1 + monthlyRate) ** -termMonths);
}

function normalizeInputs(inputs) {
  return Object.fromEntries(
    [...REQUIRED_NUMERIC_FIELDS, 'catPct'].map((field) => [field, asFiniteNumber(inputs[field])]),
  );
}

function issue(type, field, message, code = field) {
  return { type, field, message, code };
}

export function validateRentVsBuyInputs(rawInputs) {
  const inputs = normalizeInputs(rawInputs);
  const errors = [];
  const warnings = [];

  for (const field of REQUIRED_NUMERIC_FIELDS) {
    if (!Number.isFinite(inputs[field])) {
      errors.push(issue('error', field, 'Captura un número válido.'));
    }
  }

  if (rawInputs.catPct !== '' && rawInputs.catPct !== null && rawInputs.catPct !== undefined && !Number.isFinite(inputs.catPct)) {
    errors.push(issue('error', 'catPct', 'Captura un CAT válido.'));
  }

  for (const [field, range] of Object.entries(FIELD_RANGES)) {
    const value = inputs[field];
    if (!Number.isFinite(value)) continue;
    const minOk = range.inclusiveMin === false ? value > range.min : value >= range.min;
    const maxOk = value <= range.max;
    if (!minOk || !maxOk) errors.push(issue('error', field, range.message));
  }

  if (inputs.currentMonthlyRent === 0) {
    warnings.push(issue('warning', 'currentMonthlyRent', 'Si hoy no pagas renta, rentar puede verse artificialmente barato.', 'zero-rent'));
  }
  if (Number.isFinite(inputs.downPaymentPct) && inputs.downPaymentPct < 5) {
    warnings.push(issue('warning', 'downPaymentPct', 'Con un enganche tan bajo, el banco puede pedir más requisitos o cambiar la tasa.', 'low-down-payment'));
  }
  if (Number.isFinite(inputs.downPaymentPct) && inputs.downPaymentPct > 80) {
    warnings.push(issue('warning', 'downPaymentPct', 'Este escenario se parece más a comprar casi de contado.', 'high-down-payment'));
  }
  if (Number.isFinite(inputs.mortgageNominalAnnualRatePct) && inputs.mortgageNominalAnnualRatePct > 18) {
    warnings.push(issue('warning', 'mortgageNominalAnnualRatePct', 'Esa tasa está muy alta para una hipoteca tradicional; revisa si capturaste CAT en lugar de tasa.', 'high-mortgage-rate'));
  }

  return { isValid: errors.length === 0, errors, warnings, inputs };
}

function breakevenLabel(month, horizonYears) {
  if (month === null) return `No aparece en ${horizonYears} ${horizonYears === 1 ? 'año' : 'años'}`;
  const year = Math.ceil(month / 12);
  const monthInYear = ((month - 1) % 12) + 1;
  return `Año ${year}, mes ${monthInYear}`;
}

export function simulateRentVsBuy(rawInputs) {
  const validation = validateRentVsBuyInputs(rawInputs);
  if (!validation.isValid) {
    throw new Error(`Invalid rent-vs-buy inputs: ${validation.errors.map((error) => error.field).join(', ')}`);
  }

  const inputs = validation.inputs;
  const termMonths = Math.round(inputs.mortgageTermYears * 12);
  const horizonMonths = Math.round(inputs.comparisonHorizonYears * 12);
  const downPayment = inputs.purchasePrice * inputs.downPaymentPct / 100;
  const closingCosts = inputs.purchasePrice * inputs.closingCostPct / 100;
  const initialBuyerCash = downPayment + closingCosts;
  const loanPrincipal = Math.max(0, inputs.purchasePrice - downPayment);
  const monthlyMortgagePayment = mortgagePayment(loanPrincipal, inputs.mortgageNominalAnnualRatePct, termMonths);
  const mortgageMonthlyRate = inputs.mortgageNominalAnnualRatePct / 100 / 12;
  const homeAppreciationMonthlyRate = annualPctToEffectiveMonthlyRate(inputs.homeAppreciationAnnualPct);
  const rentGrowthMonthlyRate = annualPctToEffectiveMonthlyRate(inputs.rentGrowthAnnualPct);
  const opportunityMonthlyRate = annualPctToEffectiveMonthlyRate(inputs.opportunityReturnAnnualPct);
  const ownerAnnualCarryPct = inputs.ownerAnnualTaxInsurancePct + inputs.maintenanceAnnualPct;

  let balance = loanPrincipal;
  let renterPortfolio = initialBuyerCash;
  let breakevenMonth = null;
  let wentNegative = false;
  let totalInterestPaid = 0;
  let totalMortgagePaid = 0;
  let totalRentPaid = 0;
  let totalOwnerNonMortgage = 0;
  const timeline = [];

  for (let month = 1; month <= horizonMonths; month += 1) {
    const homeValue = inputs.purchasePrice * (1 + homeAppreciationMonthlyRate) ** (month - 1);
    const monthlyRent = inputs.currentMonthlyRent * (1 + rentGrowthMonthlyRate) ** (month - 1);
    const ownerNonMortgage = homeValue * (ownerAnnualCarryPct / 100) / 12;
    let mortgageInterest = 0;
    let mortgagePrincipal = 0;
    let activeMortgagePayment = 0;

    if (month <= termMonths && balance > 0.005) {
      mortgageInterest = balance * mortgageMonthlyRate;
      activeMortgagePayment = Math.min(monthlyMortgagePayment, balance + mortgageInterest);
      mortgagePrincipal = activeMortgagePayment - mortgageInterest;
      balance = Math.max(0, balance - mortgagePrincipal);
      totalInterestPaid += mortgageInterest;
      totalMortgagePaid += activeMortgagePayment;
    }

    const ownerCashflow = activeMortgagePayment + ownerNonMortgage;
    renterPortfolio = renterPortfolio * (1 + opportunityMonthlyRate) + (ownerCashflow - monthlyRent);
    totalRentPaid += monthlyRent;
    totalOwnerNonMortgage += ownerNonMortgage;
    if (renterPortfolio < 0) wentNegative = true;

    const saleCosts = homeValue * inputs.sellingCostPct / 100;
    const buyerNetEquity = homeValue - saleCosts - balance;
    if (breakevenMonth === null && buyerNetEquity >= renterPortfolio) {
      breakevenMonth = month;
    }

    timeline.push({
      month,
      homeValue: roundMoney(homeValue),
      monthlyRent: roundMoney(monthlyRent),
      ownerNonMortgage: roundMoney(ownerNonMortgage),
      mortgagePayment: roundMoney(activeMortgagePayment),
      mortgageInterest: roundMoney(mortgageInterest),
      mortgagePrincipal: roundMoney(mortgagePrincipal),
      remainingLoanBalance: roundMoney(balance),
      renterNetWorth: roundMoney(renterPortfolio),
      buyerNetEquity: roundMoney(buyerNetEquity),
      differenceBuyMinusRent: roundMoney(buyerNetEquity - renterPortfolio),
    });
  }

  const endHomeValue = inputs.purchasePrice * (1 + homeAppreciationMonthlyRate) ** horizonMonths;
  const projectedMonthlyRent = inputs.currentMonthlyRent * (1 + rentGrowthMonthlyRate) ** horizonMonths;
  const saleCosts = endHomeValue * inputs.sellingCostPct / 100;
  const buyerNetEquity = endHomeValue - saleCosts - balance;
  const differenceBuyMinusRent = buyerNetEquity - renterPortfolio;
  const closeThreshold = Math.max(inputs.purchasePrice * 0.05, 50_000);
  const verdict = Math.abs(differenceBuyMinusRent) <= closeThreshold
    ? 'tie'
    : differenceBuyMinusRent > 0 ? 'buy' : 'rent';

  const warnings = [...validation.warnings];
  if (rawInputs.catPct !== '' && rawInputs.catPct !== null && rawInputs.catPct !== undefined && Number.isFinite(inputs.catPct) && inputs.catPct > 0) {
    warnings.push({ type: 'warning', field: 'catPct', code: 'cat-informational', message: 'CAT capturado solo como referencia. No cambia la mensualidad en esta versión.' });
  }
  if (wentNegative) {
    warnings.push({ type: 'warning', field: null, code: 'negative-renter-portfolio', message: 'Este escenario implica que quien renta necesitaría poner dinero adicional o endeudarse en algunos meses.' });
  }

  return {
    inputs,
    payment: {
      loanPrincipal: roundMoney(loanPrincipal),
      downPayment: roundMoney(downPayment),
      closingCosts: roundMoney(closingCosts),
      initialBuyerCash: roundMoney(initialBuyerCash),
      monthlyMortgagePayment: roundMoney(monthlyMortgagePayment),
      catPct: Number.isFinite(inputs.catPct) ? inputs.catPct : null,
      catUsedForAmortization: false,
    },
    totals: {
      totalInterestPaid: roundMoney(totalInterestPaid),
      totalMortgagePaid: roundMoney(totalMortgagePaid),
      totalRentPaid: roundMoney(totalRentPaid),
      totalOwnerNonMortgage: roundMoney(totalOwnerNonMortgage),
      averageMonthlyOwnerCost: roundMoney((totalMortgagePaid + totalOwnerNonMortgage) / horizonMonths),
    },
    endState: {
      remainingLoanBalance: roundMoney(balance),
      homeValue: roundMoney(endHomeValue),
      projectedMonthlyRent: roundMoney(projectedMonthlyRent),
      saleCosts: roundMoney(saleCosts),
      buyerNetEquity: roundMoney(buyerNetEquity),
      renterNetWorth: roundMoney(renterPortfolio),
      differenceBuyMinusRent: roundMoney(differenceBuyMinusRent),
    },
    breakevenMonth,
    breakevenLabel: breakevenLabel(breakevenMonth, inputs.comparisonHorizonYears),
    verdict,
    warnings,
    timeline,
  };
}
