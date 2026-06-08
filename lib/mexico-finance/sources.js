const SOURCES = {
  banxicoCetes: {
    id: 'banxico-cetes',
    name: 'Banxico SIE, CETES',
    url: 'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CF107&sector=22&locale=es',
    description: 'Tasas de referencia por plazo para CETES.',
  },
  cetesdirecto: {
    id: 'cetesdirecto',
    name: 'Cetesdirecto',
    url: 'https://www.cetesdirecto.com/sites/portal/productos.cetesdirecto',
    description: 'Producto CETES y comportamiento de títulos completos.',
  },
  lif2026: {
    id: 'lif-2026',
    name: 'Ley de Ingresos de la Federación 2026, Art. 24',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2026.pdf',
    description: 'Retención anual aplicable a intereses pagados por instituciones financieras.',
  },
  lisr: {
    id: 'lisr',
    name: 'Ley del ISR',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf',
    description: 'Tratamiento de intereses, retenciones e interés real.',
  },
  inegiInpc: {
    id: 'inegi-inpc',
    name: 'INEGI INPC',
    url: 'https://www.inegi.org.mx/temas/inpc/',
    description: 'Fuente oficial de inflación para consultar escenarios.',
  },
};

module.exports = { SOURCES };
