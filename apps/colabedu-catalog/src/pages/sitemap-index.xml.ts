import type { APIRoute } from 'astro';
import { buildSitemapIndexXml, CANONICAL_DOMAIN } from '@/lib/sitemapHelper';

export const GET: APIRoute = async () => {
  // Google Official Sitemap Index referencing regional and pilot sitemaps
  const subSitemaps = [
    `${CANONICAL_DOMAIN}/catalog/sitemap-pilot.xml`,
    `${CANONICAL_DOMAIN}/catalog/sitemap-es.xml`,
    `${CANONICAL_DOMAIN}/catalog/sitemap-us.xml`,
    `${CANONICAL_DOMAIN}/catalog/sitemap-intl.xml`,
    `${CANONICAL_DOMAIN}/catalog/sitemap-catalog.xml`,
  ];

  const sitemapIndexXml = buildSitemapIndexXml(subSitemaps);

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
};
