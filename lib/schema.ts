export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AutoRevealed',
    url: 'https://AutoRevealed.com',
    logo: 'https://AutoRevealed.com/favicon.ico',
    description: "Trust data, not words. Check any car's history in seconds",
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['en'],
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AutoRevealed',
    description: "Trust data, not words. Check any car's history in seconds",
    image: 'https://AutoRevealed.com/favicon.ico',
    url: 'https://AutoRevealed.com',
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Global',
    },
    serviceType: 'Vehicle History Reports',
  };
}

export function getProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Car History Report',
    description: "Complete vehicle history check from 900+ global databases",
    brand: {
      '@type': 'Brand',
      name: 'AutoRevealed',
    },
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      offerCount: '3',
    },
  };
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || 'https://AutoRevealed.com/favicon.ico',
    datePublished: article.datePublished || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author || 'AutoRevealed',
    },
  };
}
