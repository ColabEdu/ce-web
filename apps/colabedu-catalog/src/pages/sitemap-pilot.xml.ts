import type { APIRoute } from 'astro';
import { collectCatalogUrls, buildSitemapXml } from '@/lib/sitemapHelper';

export const GET: APIRoute = async () => {
  // Canary Pilot Sitemap: Strictly limited to pilot courses for controlled GSC indexing
  const urls = collectCatalogUrls({ scope: 'pilot' });
  const sitemapXml = buildSitemapXml(urls);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
};
