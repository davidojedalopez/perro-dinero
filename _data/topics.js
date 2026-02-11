const canonical = [
  {
    slug: 'presupuesto',
    title: 'Presupuesto',
    definition: 'Plan para asignar tus ingresos con intención y controlar gastos de forma sostenible.',
    key_links: [
      '/posts/2020/05/13/conoce-ynab-y-crea-tu-presupuesto/',
      '/posts/2022/09/07/meses-sin-intereses-al-reves/',
      '/posts/2022/08/28/granja-de-deseos/'
    ],
    seo: {
      title: 'Presupuesto personal: guía y recursos | Perro Dinero',
      description: 'Aprende a crear y mantener un presupuesto personal efectivo con ejemplos prácticos.'
    }
  },
  {
    slug: 'inversion',
    title: 'Inversión',
    definition: 'Estrategias y vehículos para hacer crecer tu patrimonio con base en riesgo, plazo y diversificación.',
    key_links: [
      '/posts/2020/08/14/etf/',
      '/posts/2020/09/03/cetesdirecto/',
      '/posts/2020/06/17/tu-portafolio-de-inversiones-desde-cero/'
    ],
    seo: {
      title: 'Inversión para principiantes y largo plazo | Perro Dinero',
      description: 'Conceptos, estrategias y recursos para invertir con claridad y disciplina.'
    }
  },
  {
    slug: 'ahorro',
    title: 'Ahorro',
    definition: 'Hábitos y sistemas para reservar dinero de forma constante sin comprometer tu estabilidad.',
    key_links: [
      '/posts/2020/07/30/la-unica-forma-sostenible-de-ahorrar-mas/',
      '/posts/2020/10/20/tu-fondo-de-emergencia/',
      '/posts/2020/05/06/bola-de-nieve/'
    ],
    seo: {
      title: 'Ahorro inteligente y fondo de emergencia | Perro Dinero',
      description: 'Tácticas prácticas para ahorrar más y construir un fondo de emergencia sólido.'
    }
  },
  {
    slug: 'deudas',
    title: 'Deudas',
    definition: 'Uso responsable del crédito y métodos para liquidar deudas minimizando intereses y estrés financiero.',
    key_links: [
      '/posts/2020/05/06/bola-de-nieve/',
      '/posts/2020/05/21/amortizacion/',
      '/posts/2020/09/18/deuda-el-asesino-de-la-creatividad/'
    ],
    seo: {
      title: 'Deudas y crédito: control y salida | Perro Dinero',
      description: 'Aprende a priorizar pagos, reducir intereses y recuperar estabilidad financiera.'
    }
  },
  {
    slug: 'seguros',
    title: 'Seguros',
    definition: 'Coberturas clave para proteger tu patrimonio ante eventos de alto impacto económico.',
    key_links: [
      '/posts/2021/01/17/12-consejos-financieros/'
    ],
    seo: {
      title: 'Seguros personales: bases y recomendaciones | Perro Dinero',
      description: 'Qué seguros considerar para blindar tus finanzas personales y familiares.'
    }
  }
];

const aliases = {
  presupuesto: 'presupuesto',
  presupuestos: 'presupuesto',
  'meses sin intereses': 'presupuesto',
  inversion: 'inversion',
  inversiones: 'inversion',
  'inversión': 'inversion',
  ahorro: 'ahorro',
  ahorros: 'ahorro',
  deudas: 'deudas',
  deuda: 'deudas',
  credito: 'deudas',
  'crédito': 'deudas',
  creditos: 'deudas',
  'créditos': 'deudas',
  seguros: 'seguros',
  seguro: 'seguros'
};

const bySlug = canonical.reduce((acc, topic) => {
  acc[topic.slug] = topic;
  return acc;
}, {});

function normalizeTopicSlug(topic) {
  if (!topic || typeof topic !== 'string') {
    return null;
  }

  const normalized = topic.trim().toLowerCase();
  const aliased = aliases[normalized] || normalized;
  return bySlug[aliased] ? aliased : null;
}

function normalizeTopics(topics = []) {
  const list = Array.isArray(topics) ? topics : [topics];
  return [...new Set(list.map(normalizeTopicSlug).filter(Boolean))];
}

module.exports = {
  canonical,
  aliases,
  bySlug,
  normalizeTopicSlug,
  normalizeTopics
};
