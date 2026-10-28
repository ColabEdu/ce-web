import type { APIRoute } from 'astro';
import { collectCatalogUrls, buildSitemapXml } from '@/lib/sitemapHelper';

export const GET: APIRoute = async () => {
  const urls = collectCatalogUrls({ scope: 'intl' });
  const sitemapXml = buildSitemapXml(urls);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
};
