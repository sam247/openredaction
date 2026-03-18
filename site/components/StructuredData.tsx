export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openredaction.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenRedaction',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Open source AI-powered PII detection and redaction tool',
    sameAs: [
      'https://github.com/sam247/openredaction',
    ],
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenRedaction',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is OpenRedaction free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, the OpenRedaction library is free and open-source. Use it locally or self-host with no fees. Enterprise support and custom deployments are available via contact.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between regex mode and AI mode?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'OpenRedaction uses 500+ tested regex patterns for fast, deterministic PII detection. It works completely offline and is free. You run it in your own environment via the npm library.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does OpenRedaction store my data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you use the open-source library, your data never leaves your environment. We do not operate a hosted service that processes or stores your text. Processing runs in your process only.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get enterprise support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'OpenRedaction is open source and self-hostable. For enterprise support, custom deployments, or SLAs, contact us via the Enterprise page or contact form.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

