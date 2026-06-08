function getStaleStatus({ observedAtEpoch, maxAgeDays = 14, warningAgeDays = 7, now = Date.now() } = {}) {
  if (!Number.isFinite(observedAtEpoch)) {
    return {
      level: 'expired',
      ageDays: null,
      message: 'No tenemos una tasa CETES vigente para este plazo. Captura una tasa manual para calcular.',
    };
  }

  const ageDays = Math.max(0, Math.floor((now - observedAtEpoch) / 86_400_000));
  if (ageDays > maxAgeDays) {
    return {
      level: 'expired',
      ageDays,
      message: `La tasa de referencia tiene ${ageDays} días. Conviene revisar una tasa más reciente o capturar una manual.`,
    };
  }
  if (ageDays > warningAgeDays) {
    return {
      level: 'warning',
      ageDays,
      message: `La tasa de referencia tiene ${ageDays} días. Puedes usarla para comparar, pero conviene revisar una tasa más reciente.`,
    };
  }
  return {
    level: 'ok',
    ageDays,
    message: 'Tasa de referencia reciente para esta estimación.',
  };
}

module.exports = { getStaleStatus };
