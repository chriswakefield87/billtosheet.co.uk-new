export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BillToSheet',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    description: 'Convert invoice PDFs to CSV and Excel format instantly',
    sameAs: [],
  }
}

export function generateSoftwareApplicationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BillToSheet Invoice to CSV Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description: 'Convert invoice PDFs to CSV and Excel format instantly. Extract invoice data from Amazon, Stripe, QuickBooks, and more.',
    url: `${baseUrl}/invoice-to-csv`,
    featureList: [
      'PDF to CSV conversion',
      'PDF to Excel conversion',
      'Automatic invoice data extraction',
      'Multi-platform support',
      'Free trial available',
    ],
  }
}
