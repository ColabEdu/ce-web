import { loadCatalog, slugify } from './catalogLoader';

export interface SitemapFilter {
  scope?: 'all' | 'pilot' | 'es' | 'us' | 'intl' | 'global';
  pilotCourseSlugs?: string[];
}

export const CANONICAL_DOMAIN = 'https://colabedu.org';

// Default Canary / Pilot Courses for controlled SEO rollout
export const DEFAULT_PILOT_COURSE_IDENTIFIERS = [
  'lengua-castellana', // 1º ESO Lengua Castellana y Literatura (Marea Verde / EDIA)
  'chemistry',        // AP Chemistry (OpenStax / PhET)
];

/**
 * Collects catalog URLs with optional scope filtering (Canary Pilot, Country, or All)
 */
export function collectCatalogUrls(filter: SitemapFilter = {}): string[] {
  const { courses, lessons } = loadCatalog();
  const domain = CANONICAL_DOMAIN;
  const scope = filter.scope || 'all';
  const pilotIdentifiers = filter.pilotCourseSlugs || DEFAULT_PILOT_COURSE_IDENTIFIERS;

  const urls: string[] = [];

  // Home and catalog root
  if (scope === 'all' || scope === 'pilot') {
    urls.push(`${domain}/catalog`);
  }

  // 1. Filtered Courses
  for (const c of courses) {
    const isPilot = pilotIdentifiers.some((id) => 
      c.id.toLowerCase().includes(id) || 
      c.computedSlug.toLowerCase().includes(id) ||
      c.canonicalPath.toLowerCase().includes(id)
    );

    if (scope === 'pilot' && !isPilot) {
      continue;
    }

    if (scope !== 'all' && scope !== 'pilot' && c.country !== scope) {
      continue;
    }

    // Country hub
    const countryHub = `${domain}/catalog/${c.country}`;
    if (!urls.includes(countryHub)) {
      urls.push(countryHub);
    }

    // Course canonical landing
    urls.push(`${domain}${c.canonicalPath}`);

    // Lessons attached to units
    for (const u of c.units) {
      if (u.resolvedLessons) {
        for (const l of u.resolvedLessons) {
          const lessonUrl = `${domain}/catalog/${c.country}/${c.level}/${c.computedSlug}/${u.slug}/${l.computedSlug}`;
          if (!urls.includes(lessonUrl)) {
            urls.push(lessonUrl);
          }
        }
      }
    }
  }

  // 2. Standalone Lessons (Only if scope is 'all' or matching country)
  if (scope === 'all' || scope === 'es' || scope === 'us') {
    for (const l of lessons) {
      const country = l.standardRef?.includes('us') ? 'us' : 'es';
      if (scope !== 'all' && country !== scope) continue;

      const level = slugify(l.educationLevel || 'general');
      const subject = slugify(l.subject || 'general');
      const unitSlug = slugify(l.targetUnitRef || 'general');
      const standaloneUrl = `${domain}/catalog/${country}/${level}/${subject}/${unitSlug}/${l.computedSlug}`;
      if (!urls.includes(standaloneUrl)) {
        urls.push(standaloneUrl);
      }
    }
  }

  // 3. Official Exams and Practice Tests
  const { exams } = loadCatalog();
  for (const ex of exams) {
    if (scope !== 'all' && scope !== 'pilot' && ex.country !== scope) {
      continue;
    }
    const isPilot = pilotIdentifiers.some((id) =>
      ex.id.toLowerCase().includes(id) ||
      ex.subject.toLowerCase().includes(id) ||
      ex.canonicalPath.toLowerCase().includes(id)
    );
    if (scope === 'pilot' && !isPilot) {
      continue;
    }

    // Exam hub for subject
    const examHubUrl = `${domain}/catalog/${ex.country}/${ex.level}/${ex.subject}/examenes`;
    if (!urls.includes(examHubUrl)) {
      urls.push(examHubUrl);
    }

    // Exam detail
    const examUrl = `${domain}${ex.canonicalPath}`;
    if (!urls.includes(examUrl)) {
      urls.push(examUrl);
    }
  }

  return urls;
}


/**
 * Builds standard XML sitemap for a list of URLs
 */
export function buildSitemapXml(urls: string[]): string {
  const currentDate = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    const depth = url.split('/').filter(Boolean).length;
    let priority = '0.7';
    let changefreq = 'weekly';

    if (url.endsWith('/catalog')) {
      priority = '1.0';
      changefreq = 'daily';
    } else if (depth <= 4) {
      priority = '0.9'; // Country & Course landings
      changefreq = 'weekly';
    } else {
      priority = '0.8'; // Individual lessons
      changefreq = 'monthly';
    }

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;
}

/**
 * Builds standard XML Sitemap Index pointing to sub-sitemaps
 */
export function buildSitemapIndexXml(subSitemaps: string[]): string {
  const currentDate = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${subSitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;
}
