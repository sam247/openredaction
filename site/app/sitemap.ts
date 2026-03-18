import { MetadataRoute } from 'next';
import { getAllBlogPostSlugs } from '@/lib/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openredaction.com';

  const routes = [
    '',
    '/playground',
    '/docs',
    '/blog',
    '/contact',
    '/pricing',
    '/about',
    '/careers',
    '/security',
    '/privacy',
    '/terms',
    '/changelog',
    '/status',
    '/use-cases/healthcare',
    '/use-cases/legal',
    '/use-cases/finance',
    '/use-cases/education',
  ];

  // Blog posts - dynamically generated from blogPosts data
  const blogPostSlugs = getAllBlogPostSlugs();
  const blogPostRoutes = blogPostSlugs.map(slug => `/blog/${slug}`);

  // Documentation pages
  const docRoutes = [
    '/docs',
    '/docs/getting-started',
    '/docs/api-reference',
    '/docs/tutorials',
    '/docs/examples',
    '/docs/self-hosting',
    '/docs/security',
    '/docs/changelog',
  ];

  // SEO landing pages
  const seoLandingPages = [
    '/nodejs-redaction',
    '/pii-detection',
    '/gdpr-redaction',
    '/hipaa-redaction',
  ];

  const allRoutes = [...routes, ...blogPostRoutes, ...docRoutes, ...seoLandingPages];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : route.startsWith('/blog') ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.startsWith('/blog') ? 0.7 : 0.8,
  }));
}

