const themes = [
  {
    slug: 'presupuesto',
    title: 'Presupuesto',
    emoji: '📒',
    definition: 'Organizar tu dinero antes de gastarlo para que cada peso tenga un propósito.',
    keyLinks: [
      { label: '¿Qué es un presupuesto?', href: '/posts/conoce-ynab-y-crea-tu-presupuesto/' },
      { label: 'Hábitos financieros primero', href: '/posts/habitos-antes-que-nada/' },
      { label: '10 consejos para mejorar tus finanzas', href: '/posts/10-consejos-para-mejorar-tus-finanzas/' }
    ],
    keywords: ['presupuesto', 'presupuestos', 'ynab', 'gastos', 'habitos', 'suscripciones']
  },
  {
    slug: 'inversion',
    title: 'Inversión',
    emoji: '📈',
    definition: 'Poner tu dinero a trabajar en instrumentos que pueden crecer su valor con el tiempo.',
    keyLinks: [
      { label: 'Tu portafolio desde cero', href: '/posts/tu-portafolio-de-inversiones-desde-cero/' },
      { label: 'Interés compuesto', href: '/posts/interes-compuesto/' },
      { label: '¿Qué son los ETF?', href: '/posts/etf/' }
    ],
    keywords: ['inversion', 'inversiones', 'etf', 'etfs', 'fibras', 'cetes', 'voo', 'vwo', 'vnq', 'sic', 'criptomonedas', 'bitcoin', 'portafolio', 'interés compuesto']
  },
  {
    slug: 'ahorro',
    title: 'Ahorro',
    emoji: '🐷',
    definition: 'Separar parte de tus ingresos para protegerte y avanzar hacia metas concretas.',
    keyLinks: [
      { label: 'Fondo de emergencia', href: '/posts/tu-fondo-de-emergencia/' },
      { label: 'Forma sostenible de ahorrar más', href: '/posts/la-unica-forma-sostenible-de-ahorrar-mas/' },
      { label: 'Encuentra tu suficiente', href: '/posts/encuentra-tu-suficiente/' }
    ],
    keywords: ['ahorro', 'fondo de emergencia', 'liquidez', 'suficiente', 'cetes', 'bonddia']
  },
  {
    slug: 'deudas',
    title: 'Deudas',
    emoji: '💳',
    definition: 'Usar crédito con estrategia para no comprometer tu flujo y acelerar tus objetivos.',
    keyLinks: [
      { label: 'Método bola de nieve', href: '/posts/bola-de-nieve/' },
      { label: 'Amortización explicada', href: '/posts/amortizacion/' },
      { label: 'Deuda: el asesino de la creatividad', href: '/posts/deuda-el-asesino-de-la-creatividad/' }
    ],
    keywords: ['deuda', 'deudas', 'credito', 'crédito', 'tarjeta de crédito', 'tarjeta de credito', 'meses sin intereses', 'amortizacion', 'hipoteca']
  },
  {
    slug: 'seguros',
    title: 'Seguros',
    emoji: '🛡️',
    definition: 'Transferir riesgos grandes a una aseguradora para proteger tu patrimonio y tu tranquilidad.',
    keyLinks: [
      { label: 'CAT y factores para comparar créditos', href: '/posts/cat-y-5-cosas-que-no-sabias/' },
      { label: 'Asesor financiero: cómo evaluarlo', href: '/posts/recomendaciones-para-encontrar-al-mejor-asesor-financiero/' },
      { label: '12 consejos financieros prácticos', href: '/posts/12-consejos-financieros/' }
    ],
    keywords: ['seguros', 'aseguradora', 'cobertura', 'riesgo', 'cat']
  }
]

const manualAssignments = {
  'rentar-o-comprar': ['presupuesto', 'deudas'],
  'meses-sin-intereses-al-reves': ['deudas', 'presupuesto'],
  'mis-tarjetas-de-credito': ['deudas', 'presupuesto'],
  'que-son-las-fibras': ['inversion'],
  'impuestos-en-fibras': ['inversion'],
  'bienes-raices-o-fibras': ['inversion'],
  'tu-fondo-de-emergencia': ['ahorro', 'presupuesto'],
  'la-unica-forma-sostenible-de-ahorrar-mas': ['ahorro', 'presupuesto'],
  'cetes': ['inversion', 'ahorro'],
  'cetesdirecto': ['inversion', 'ahorro'],
  'interes-compuesto': ['inversion', 'ahorro'],
  'interes-compuesto-en-cetes': ['inversion', 'ahorro'],
  'cat-y-5-cosas-que-no-sabias': ['deudas', 'seguros']
}

const normalize = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const unique = (values) => Array.from(new Set(values))

const getThemesForPost = ({ fileSlug, tags = [], title = '' }) => {
  const normalizedTags = tags.map(normalize)
  const normalizedTitle = normalize(title)

  const matchesByKeyword = themes
    .filter((theme) => theme.keywords.some((keyword) => {
      const normalizedKeyword = normalize(keyword)
      return normalizedTags.some((tag) => tag.includes(normalizedKeyword)) || normalizedTitle.includes(normalizedKeyword)
    }))
    .map((theme) => theme.slug)

  const manual = manualAssignments[fileSlug] || []
  return unique([...matchesByKeyword, ...manual])
}

module.exports = {
  list: themes,
  bySlug: Object.fromEntries(themes.map((theme) => [theme.slug, theme])),
  getThemesForPost
}
