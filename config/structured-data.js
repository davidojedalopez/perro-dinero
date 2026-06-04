const HEADLINE_CHARACTER_LIMIT = 110;

const SECTION_LABELS = {
  posts: 'Posts',
  libros: 'Libros',
  ensayosatomicos: 'Ensayos atómicos',
  herramientas: 'Herramientas',
  portafolio: 'Portafolio',
  'preguntas-frecuentes': 'Preguntas frecuentes',
  ebook: 'Ebook',
};

const SECTION_URLS = {
  posts: '/posts/',
  libros: '/libros/',
  ensayosatomicos: '/ensayosatomicos/',
};

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) {
        return entry.length > 0;
      }
      return entry !== undefined && entry !== null && entry !== '';
    })
  );
}

function asArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function stripHtml(value = '') {
  return value
    .toString()
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteSiteUrl(value, siteUrl) {
  if (!value || !siteUrl) {
    return '';
  }

  try {
    return new URL(value).href;
  } catch {
    const normalizedBase = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
    return new URL(value.toString().replace(/^\/+/, ''), normalizedBase).href;
  }
}

function normalizeKeywords(value) {
  return asArray(value)
    .flatMap((entry) => entry.toString().split(','))
    .map((entry) => entry.trim())
    .filter((entry) => entry && !['posts', 'books'].includes(entry));
}

function personSchema(personOrName, fallbackUrl) {
  if (!personOrName) {
    return undefined;
  }

  if (typeof personOrName === 'string') {
    return compactObject({
      '@type': 'Person',
      name: personOrName,
      url: fallbackUrl,
    });
  }

  return compactObject({
    '@type': 'Person',
    name: personOrName.name,
    url: personOrName.url || fallbackUrl,
  });
}

function buildWebSiteSchema({ metadata }) {
  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: metadata.title,
    url: absoluteSiteUrl('/', metadata.url),
    description: metadata.description,
    inLanguage: 'es-MX',
    publisher: personSchema(metadata.author),
  });
}

function buildBreadcrumbSchema({ metadata, page, pageTitle }) {
  if (!page?.url || page.url === '/' || page.url === '/404.html') {
    return undefined;
  }

  const segments = page.url.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }

  const firstSegment = segments[0];
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: absoluteSiteUrl('/', metadata.url),
    },
  ];

  if (SECTION_LABELS[firstSegment] && SECTION_URLS[firstSegment] && page.url !== SECTION_URLS[firstSegment]) {
    itemListElement.push(compactObject({
      '@type': 'ListItem',
      position: itemListElement.length + 1,
      name: SECTION_LABELS[firstSegment],
      item: absoluteSiteUrl(SECTION_URLS[firstSegment], metadata.url),
    }));
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: itemListElement.length + 1,
    name: pageTitle,
    item: absoluteSiteUrl(page.url, metadata.url),
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

function buildBlogPostingSchema(data, context) {
  const { metadata, page, pageTitle, pageDescription, coverPath } = context;
  const canonicalUrl = absoluteSiteUrl(page.url, metadata.url);
  const author = personSchema(data.author || metadata.author, metadata.author?.url);

  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: (data.headline || pageTitle || '').slice(0, HEADLINE_CHARACTER_LIMIT),
    description: pageDescription,
    keywords: normalizeKeywords(data.keywords || context.tags),
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author,
    publisher: personSchema(metadata.author),
    inLanguage: 'es-MX',
    image: data.image || absoluteSiteUrl(coverPath, metadata.url),
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
  });
}

function buildFAQPageSchema(context) {
  const faqs = context.collections?.faqs || [];
  const questions = faqs
    .map((faq) => compactObject({
      '@type': 'Question',
      name: faq.data?.question,
      acceptedAnswer: compactObject({
        '@type': 'Answer',
        text: stripHtml(faq.templateContent || ''),
      }),
    }))
    .filter((question) => question.name && question.acceptedAnswer?.text);

  if (questions.length === 0) {
    return undefined;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

function buildBookSchema(data, context) {
  const { metadata, page, pageTitle, pageDescription, coverPath, author, publishedAt } = context;
  const bookAuthor = personSchema(data.author || author);
  const url = absoluteSiteUrl(page.url, metadata.url);

  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: data.name || pageTitle,
    author: bookAuthor,
    description: pageDescription,
    image: data.image || absoluteSiteUrl(coverPath, metadata.url),
    url,
    inLanguage: 'es-MX',
    review: compactObject({
      '@type': 'Review',
      author: personSchema(metadata.author),
      datePublished: publishedAt,
      reviewBody: pageDescription,
    }),
  });
}

function buildStructuredData(data = {}, context = {}) {
  if (!context.metadata || !context.page || context.draft) {
    return [];
  }

  const schemas = [];

  if (context.page.url === '/') {
    schemas.push(buildWebSiteSchema(context));
  }

  const breadcrumb = buildBreadcrumbSchema(context);
  if (breadcrumb) {
    schemas.push(breadcrumb);
  }

  if (data.type === 'post') {
    schemas.push(buildBlogPostingSchema(data, context));
  }

  if (data.type === 'faq') {
    const faqPage = buildFAQPageSchema(context);
    if (faqPage) {
      schemas.push(faqPage);
    }
  }

  if (data.type === 'book') {
    schemas.push(buildBookSchema(data, context));
  }

  return schemas.filter(Boolean);
}

function renderStructuredData(data, context) {
  const schemas = buildStructuredData(data, context);
  if (schemas.length === 0) {
    return '';
  }

  return schemas
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n');
}

module.exports = {
  absoluteSiteUrl,
  buildStructuredData,
  renderStructuredData,
  stripHtml,
};
