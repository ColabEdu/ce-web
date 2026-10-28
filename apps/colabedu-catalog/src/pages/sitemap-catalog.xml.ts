import type { APIRoute } from 'astro';
import { collectCatalogUrls, buildSitemapXml, type SitemapFilter } from '@/lib/sitemapHelper';

export const GET: APIRoute = async () => {
  const scope = (process.env.PUBLIC_SITEMAP_SCOPE as SitemapFilter['scope']) || 'all';
  const urls = collectCatalogUrls({ scope });
  const sitemapXml = buildSitemapXml(urls);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'noindex', // Sitemap itself shouldn't be indexed as web page
    },
  });
};
