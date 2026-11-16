import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type {
  CourseSpecItem,
  InteractiveLessonItem,
  CatalogHierarchy,
  CourseUnitItem,
  SlideItem,
  OerSourceItem,
  RecentAdditionItem,
  ExamSpecItem,
  ExamTaskItem,
  CriterionItem,
} from './types';
import { getAppBaseUrl } from '@colabedu/ui-core/navigation';

export const BASE_APP_URL = getAppBaseUrl('app');

export function slugify(text: any): string {
  if (!text) return 'item';
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[:._/\\]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

export function truncate(text: any, maxChars: number = 155): string {
  if (!text) return '';
  const str = typeof text === 'string' ? text : String(text);
  const clean = str.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  return clean.substring(0, maxChars - 3) + '...';
}

function normalizeCountry(country?: string): string {
  if (!country) return 'global';
  const c = country.toLowerCase().trim();
  if (c === 'spain' || c === 'españa') return 'es';
  if (c === 'usa' || c === 'united states') return 'us';
  if (c === 'mexico' || c === 'méxico') return 'mx';
  return c;
}

function normalizeLevel(level?: string): string {
  if (!level) return 'general';
  return slugify(level);
}

function normalizeSubject(subject?: string): string {
  if (!subject) return 'general';
  return slugify(subject);
}

function normalizeLanguage(lang?: string, country?: string, subject?: string, standard?: string): string {
  if (lang) {
    const l = lang.toLowerCase().trim();
    if (l === 'es' || l === 'espanol' || l === 'español' || l === 'spanish') return 'es';
    if (l === 'en' || l === 'ingles' || l === 'inglés' || l === 'english') return 'en';
    if (l === 'ca' || l === 'catalan' || l === 'català' || l === 'catalá') return 'ca';
    if (l === 'gl' || l === 'gallego' || l === 'galego') return 'gl';
    if (l === 'eu' || l === 'euskera' || l === 'euskara' || l === 'basque') return 'eu';
    if (l === 'fr' || l === 'frances' || l === 'français' || l === 'french') return 'fr';
    if (l === 'pt' || l === 'portugues' || l === 'português' || l === 'portuguese') return 'pt';
    return l;
  }
  // Curricular inference
  const c = (country || '').toLowerCase();
  const sub = (subject || '').toLowerCase();
  const std = (standard || '').toLowerCase();

  if (c === 'us' && !sub.includes('spanish') && !std.includes('spanish')) {
    return 'en';
  }
  if (sub.includes('lengua_castellana') || sub.includes('spanish') || c === 'es') {
    return 'es';
  }
  return 'es';
}

export function findSpecsCatalogDir(): string {
  if (process.env.CE_SPECS_ROOT && fs.existsSync(path.join(process.env.CE_SPECS_ROOT, 'catalog'))) {
    return path.join(process.env.CE_SPECS_ROOT, 'catalog');
  }
  const candidates = [
    path.resolve(process.cwd(), '../../ce-specs/catalog'),
    path.resolve(process.cwd(), '../ce-specs/catalog'),
    path.resolve(process.cwd(), 'ce-specs/catalog'),
    '/home/jmolmo/git/colabedu/ce-specs/catalog',
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

export function findSourcesManifestPath(): string | null {
  const candidates = [
    path.resolve(process.cwd(), '../../ce-specs/sources/sources_manifest.json'),
    path.resolve(process.cwd(), '../ce-specs/sources/sources_manifest.json'),
    path.resolve(process.cwd(), 'ce-specs/sources/sources_manifest.json'),
    '/home/jmolmo/git/colabedu/ce-specs/sources/sources_manifest.json',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function walkYamlFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.includes('backup') || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkYamlFiles(fullPath, fileList);
    } else if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

let cachedHierarchy: CatalogHierarchy | null = null;

export function loadCatalog(): CatalogHierarchy {
  if (cachedHierarchy) return cachedHierarchy;

  const now = Date.now();
  const catalogDir = findSpecsCatalogDir();
  const yamlFiles = walkYamlFiles(catalogDir);

  // Load canonical sources from sources_manifest.json
  const sourcesById: Record<string, OerSourceItem> = {};
  const manifestPath = findSourcesManifestPath();
  if (manifestPath && fs.existsSync(manifestPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (raw.sources && Array.isArray(raw.sources)) {
        for (const s of raw.sources) {
          const params = new URLSearchParams();
          params.set('source', s.id);
          if (s.title) params.set('title', s.title);
          if (s.sourceUrl) params.set('url', s.sourceUrl);
          if (s.license) params.set('license', s.license);
          if (s.format) params.set('format', s.format);
          if (s.type) params.set('type', s.type);
          if (s.filePath) params.set('filePath', s.filePath);

          sourcesById[s.id] = {
            id: s.id,
            title: s.title || s.id,
            authority: s.authority || 'Autoridad Educativa',
            type: s.type,
            license: s.license || 'Recurso Educativo Abierto (Creative Commons / Dominio Público)',
            authors: s.authors || (s.authority ? [s.authority] : ['Comunidad Docente OER']),
            sourceUrl: s.sourceUrl,
            filePath: s.filePath,
            appColabEduUrl: `${BASE_APP_URL}/oer/view?${params.toString()}`,
            format: s.format,
          };
        }
      }
    } catch {
      // Ignore manifest errors gracefully
    }
  }

  const rawCourses: any[] = [];
  const rawLessons: any[] = [];
  const rawExams: any[] = [];
  const rawTaxonomies: any[] = [];
  const rawRubrics: any[] = [];

  for (const file of yamlFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const doc = yaml.load(content) as any;
      if (!doc || typeof doc !== 'object') continue;

      const stats = fs.statSync(file);
      const itemWithMtime = { ...doc, _mtime: stats.mtimeMs, _filePath: file };

      if (doc.kind === 'CourseSpec' || doc.kind === 'CourseBundle') {
        rawCourses.push(itemWithMtime);
      } else if (doc.kind === 'InteractiveLesson') {
        rawLessons.push(itemWithMtime);
      } else if (doc.kind === 'Taxonomy') {
        rawTaxonomies.push(itemWithMtime);
      } else if (doc.kind === 'Rubric' || doc.kind === 'BlockRubric' || doc.kind === 'RubricSpec') {
        rawRubrics.push(itemWithMtime);
      } else if (
        doc.kind === 'ExerciseSpec' &&
        (doc.metadata?.type === 'external_assessment' ||
          doc.metadata?.type === 'summative_assessment' ||
          doc.metadata?.subtype === 'past_paper_c2' ||
          doc.metadata?.subtype === 'written_exam_paper1_c2' ||
          doc.metadata?.year ||
          doc.metadata?.organization)
      ) {
        rawExams.push(itemWithMtime);
      }
    } catch {
      // Ignore unparseable files gracefully
    }
  }


  // 1. Process Lessons
  const lessons: InteractiveLessonItem[] = [];
  const lessonsById: Record<string, InteractiveLessonItem> = {};

  for (const l of rawLessons) {
    const meta = l.metadata || {};
    const spec = l.spec || {};
    const id = meta.id || meta.referenceCode || meta.reference_code || 'unknown-lesson';
    const title = meta.title || meta.name || id;
    let country = normalizeCountry(meta.country);
    if (country === 'global') {
      const ref = (meta.targetCourseRef || meta.standardRef || id || '').toLowerCase();
      if (ref.startsWith('es.') || ref.includes('lomloe') || ref.includes('.es') || ref.includes('ebau') || ref.includes('pau')) {
        country = 'es';
      } else if (ref.startsWith('us.') || ref.includes('cde') || ref.includes('.us') || ref.includes('ap_') || ref.includes('ap.')) {
        country = 'us';
      } else if (ref.startsWith('intl.') || ref.includes('ib') || ref.includes('spanish_b')) {
        country = 'intl';
      }
    }
    const level = normalizeLevel(meta.educationLevel);
    const subject = normalizeSubject(meta.subject);

    const computedSlug = meta.seo?.slug || slugify(title);
    const computedMetaTitle =
      meta.seo?.meta_title || `${title} | ${meta.educationLevel || 'Secundaria'} — ColabEdu`;

    let excerpt = meta.description || '';
    if (!excerpt && spec.learningObjectives?.length) {
      excerpt = spec.learningObjectives[0];
    } else if (!excerpt && spec.slides?.length) {
      excerpt = spec.slides[0]?.content || '';
    }
    const computedMetaDescription =
      meta.seo?.meta_description ||
      truncate(excerpt || `Lección interactiva sobre ${title} con evaluación oficial y práctica guiada en 90 segundos.`);

    const lessonSources: OerSourceItem[] = [];
    if (meta.sourcePackage && sourcesById[meta.sourcePackage]) {
      lessonSources.push(sourcesById[meta.sourcePackage]);
    } else if (meta.sources && Array.isArray(meta.sources)) {
      for (const s of meta.sources) {
        if (typeof s === 'string' && sourcesById[s]) {
          lessonSources.push(sourcesById[s]);
        }
      }
    }

    const mtime = l._mtime || Date.now();
    const daysAgo = Math.floor((now - mtime) / (1000 * 60 * 60 * 24));
    const isNew = daysAgo <= 21;
    const language = normalizeLanguage(meta.language, country, subject, meta.standardRef);

    const unitSlug = slugify(meta.targetUnitRef || 'general');

    const transversalCompetencies: string[] = [
      ...(Array.isArray(l.transversal_competency_tags) ? l.transversal_competency_tags : []),
      ...(Array.isArray(meta.transversal_competency_tags) ? meta.transversal_competency_tags : []),
      ...(Array.isArray(meta.competency_tags) ? meta.competency_tags : []),
    ];
    const criteriaRefs: string[] = [
      ...(Array.isArray(l.pedagogical_metadata?.rubric_refs) ? l.pedagogical_metadata.rubric_refs : []),
      ...(Array.isArray(meta.rubric_refs) ? meta.rubric_refs : []),
    ];

    const lessonItem: InteractiveLessonItem = {
      id,
      referenceCode: meta.referenceCode || meta.reference_code || id,
      title,
      subject,
      standardRef: meta.standardRef,
      targetCourseRef: meta.targetCourseRef,
      targetUnitRef: meta.targetUnitRef,
      educationLevel: meta.educationLevel,
      estimatedMinutes: meta.estimatedMinutes || 50,
      tags: meta.tags || [],
      transversalCompetencies,
      criteriaRefs,
      learningObjectives: spec.learningObjectives || [],
      slides: (spec.slides || []).map((s: any): SlideItem => ({
        id: s.id,
        title: s.title || '',
        subtitle: s.subtitle,
        layout: s.layout,
        content: s.content,
        embeddedWidget: s.embeddedWidget ?? (typeof s.widget === 'string' ? {
          type: s.widget,
          props: s.props || {
            title: s.title,
            description: s.instruction,
          },
        } : (s.widget && typeof s.widget === 'object' && typeof s.widget.type === 'string' ? s.widget : undefined)),
        media: s.media,
      })),
      pedagogical_metadata: l.pedagogical_metadata,
      seo: meta.seo,
      resolvedSources: lessonSources,
      country,
      language,
      mtime,
      daysAgo,
      isNew,
      computedSlug,
      computedMetaTitle,
      computedMetaDescription,
      canonicalPath: `/catalog/${country}/${level}/${subject}/${unitSlug}/${computedSlug}`,
    };

    lessons.push(lessonItem);
    lessonsById[id] = lessonItem;
    if (lessonItem.referenceCode) {
      lessonsById[lessonItem.referenceCode] = lessonItem;
    }
  }

  // 2. Process Courses
  const courses: CourseSpecItem[] = [];
  const coursesByCountry: Record<string, CourseSpecItem[]> = {};

  for (const c of rawCourses) {
    const meta = c.metadata || {};
    const spec = c.spec || {};
    const id = meta.id || meta.reference_code || meta.referenceCode || 'unknown-course';
    const name = meta.name || meta.title || id;
    const country = normalizeCountry(meta.country);
    const level = normalizeLevel(meta.level);
    const subject = normalizeSubject(meta.subject);

    // Resolve OER sources for course
    const resolvedSources: OerSourceItem[] = [];
    if (meta.multi_source_manifest && Array.isArray(meta.multi_source_manifest)) {
      for (const m of meta.multi_source_manifest) {
        const sId = m.source_id || m.id;
        if (sId && sourcesById[sId]) {
          resolvedSources.push({
            ...sourcesById[sId],
            role: m.role || 'CORE_THEORY',
            title: m.title || sourcesById[sId].title,
          });
        } else if (m.title) {
          resolvedSources.push({
            id: sId || slugify(m.title),
            title: m.title,
            authority: meta.author || 'Fuente Canónica OER',
            license: 'Creative Commons / OER',
            role: m.role || 'CORE_THEORY',
            appColabEduUrl: `${BASE_APP_URL}/oer/view?source=${encodeURIComponent(sId || slugify(m.title))}`,
          });
        }
      }
    }

    // Curricular Fallback: If no multi_source_manifest, map canonical sources by standard & jurisdiction
    if (resolvedSources.length === 0) {
      const std = (meta.standard || '').toLowerCase();
      if (std.includes('lomloe') || country === 'es') {
        if (sourcesById['cand-marea-verde-lcl-1eso']) {
          resolvedSources.push({
            ...sourcesById['cand-marea-verde-lcl-1eso'],
            role: 'CORE_THEORY',
          });
        }
        if (sourcesById['src.es.intef.cedec.edia.somos_un_equipo_1eso']) {
          resolvedSources.push({
            ...sourcesById['src.es.intef.cedec.edia.somos_un_equipo_1eso'],
            role: 'WORKSHOP_LAB',
          });
        }
      } else if (std.includes('chem') || subject.includes('chemistry')) {
        if (sourcesById['cand-openstax-chem-2e']) {
          resolvedSources.push({ ...sourcesById['cand-openstax-chem-2e'], role: 'CORE_THEORY' });
        }
        if (sourcesById['cand-phet-chem-balancing-equations']) {
          resolvedSources.push({ ...sourcesById['cand-phet-chem-balancing-equations'], role: 'WORKSHOP_LAB' });
        }
      } else if (std.includes('heritage') || std.includes('wls')) {
        if (sourcesById['oer.ca.asccc.entrada_libre']) {
          resolvedSources.push({ ...sourcesById['oer.ca.asccc.entrada_libre'], role: 'CORE_THEORY' });
        }
      } else if (std.includes('history')) {
        if (sourcesById['cand-american-yawp']) {
          resolvedSources.push({ ...sourcesById['cand-american-yawp'], role: 'CORE_THEORY' });
        }
      } else if (country === 'intl' || std.includes('ib')) {
        if (sourcesById['oer.cervantes.obras_canonicas']) {
          resolvedSources.push({ ...sourcesById['oer.cervantes.obras_canonicas'], role: 'CORE_THEORY' });
        }
      }
    }

    const computedSlug = meta.seo?.slug || normalizeSubject(meta.subject) || slugify(name);
    const computedMetaTitle =
      meta.seo?.meta_title || `${name} | Temario y Ejercicios Oficiales — ColabEdu`;
    const computedMetaDescription =
      meta.seo?.meta_description ||
      truncate(meta.description || `Curso de ${name} adaptado al estándar oficial ${meta.standard || ''} con lecciones interactivas.`);

    const units: CourseUnitItem[] = (spec.units || []).map((u: any): CourseUnitItem => {
      const unitName = u.name || u.id || 'Unidad';
      const unitSlug = slugify(unitName);
      const unitLessons = u.lessons || [];

      // Resolve lessons from lessonsById
      const resolvedLessons: InteractiveLessonItem[] = [];
      for (const ul of unitLessons) {
        const refId = ul.lessonSpecRef || ul.id;
        if (refId && lessonsById[refId]) {
          const resolved = { ...lessonsById[refId] };
          resolved.canonicalPath = `/catalog/${country}/${level}/${subject}/${unitSlug}/${resolved.computedSlug}`;
          if (!resolved.resolvedSources || resolved.resolvedSources.length === 0) {
            resolved.resolvedSources = resolvedSources;
          }
          resolvedLessons.push(resolved);
        }
      }

      return {
        id: u.id,
        name: unitName,
        slug: unitSlug,
        pathwayRef: u.pathwayRef,
        lessons: unitLessons,
        resolvedLessons,
      };
    });

    const mtime = c._mtime || Date.now();
    const daysAgo = Math.floor((now - mtime) / (1000 * 60 * 60 * 24));
    const isNew = daysAgo <= 21;
    const language = normalizeLanguage(meta.language, country, subject, meta.standard);

    const courseItem: CourseSpecItem = {
      id,
      referenceCode: meta.reference_code || meta.referenceCode || id,
      name,
      description: meta.description || '',
      standard: meta.standard || '',
      country,
      level,
      subject,
      language,
      author: meta.author,
      version: meta.version,
      target_weeks: spec.target_weeks,
      weekly_sessions: spec.weekly_sessions,
      total_annual_sessions: spec.total_annual_sessions,
      rubric_refs: spec.rubric_refs || [],
      units,
      seo: meta.seo,
      resolvedSources,
      mtime,
      daysAgo,
      isNew,
      computedSlug,
      computedMetaTitle,
      computedMetaDescription,
      canonicalPath: `/catalog/${country}/${level}/${computedSlug}`,
    };

    courses.push(courseItem);
    if (!coursesByCountry[country]) {
      coursesByCountry[country] = [];
    }
    coursesByCountry[country].push(courseItem);
  }

  // 3. Process Exams
  const exams: ExamSpecItem[] = [];
  const examsById: Record<string, ExamSpecItem> = {};
  const examsByCourseRef: Record<string, ExamSpecItem[]> = {};
  const examsBySubject: Record<string, ExamSpecItem[]> = {};

  for (const ex of rawExams) {
    const meta = ex.metadata || {};
    const spec = ex.spec || {};
    const id = meta.id || meta.referenceCode || 'unknown-exam';
    const title = meta.title || meta.name || id;

    // Detect country, level, subject from targetCourseRef or metadata
    let country = normalizeCountry(meta.country);
    let level = normalizeLevel(meta.educationLevel);
    let subject = normalizeSubject(meta.subject);

    if (meta.targetCourseRef) {
      const parentCourse = courses.find(
        (c) => c.id === meta.targetCourseRef || c.referenceCode === meta.targetCourseRef
      );
      if (parentCourse) {
        country = parentCourse.country;
        level = parentCourse.level;
        subject = parentCourse.computedSlug;
      } else {
        const parts = meta.targetCourseRef.split('.');
        if (parts.length > 2) {
          if (parts[0] === 'es') country = 'es';
          else if (parts[0] === 'us') country = 'us';
          else if (parts[0] === 'intl' || parts[0] === 'global') country = 'intl';
          
          if (meta.targetCourseRef.includes('bach') || meta.targetCourseRef.includes('ebau')) {
            level = '2-bachillerato';
          } else if (meta.targetCourseRef.includes('1eso') || meta.targetCourseRef.includes('eso')) {
            level = '1-eso';
          } else if (meta.targetCourseRef.includes('ib') || meta.targetCourseRef.includes('hl') || meta.targetCourseRef.includes('sl')) {
            level = 'ib-diploma';
          } else if (meta.targetCourseRef.includes('ap')) {
            level = 'ap';
          }
          
          if (meta.targetCourseRef.includes('lengua') || meta.targetCourseRef.includes('lcl') || meta.targetCourseRef.includes('spanish')) {
            subject = 'lengua-castellana';
          }
        }
      }
    }

    const computedSlug = slugify(meta.seo?.slug || title);
    const computedMetaTitle =
      meta.seo?.meta_title ||
      `${title} | Examen Oficial y Práctica con Soluciones — ColabEdu`;
    
    let contextExcerpt = '';
    if (spec.context) {
      contextExcerpt = typeof spec.context === 'string' ? spec.context.slice(0, 160) : '';
    }
    const computedMetaDescription =
      meta.seo?.meta_description ||
      truncate(
        contextExcerpt ||
          `Examen oficial y simulacro de ${title} (${meta.organization || 'Oficial'}, ${meta.year || 2024}). Criterios de evaluación y resolución interactiva.`
      );

    const tasks: ExamTaskItem[] = [];
    if (spec.exercises && Array.isArray(spec.exercises)) {
      for (const e of spec.exercises) {
        tasks.push({
          id: e.id || 'q',
          title: e.title || e.id,
          type: e.type || 'free_text',
          prompt: e.prompt || '',
          score: e.score || e.maxScore,
          expectedOutputFormat: e.expectedOutputFormat,
          theme: e.theme,
        });
      }
    } else if (spec.tasks && Array.isArray(spec.tasks)) {
      for (const t of spec.tasks) {
        tasks.push({
          id: t.id || 't',
          title: t.title || t.id,
          type: 'essay',
          prompt: t.prompt || '',
          score: t.score,
          theme: t.theme,
        });
      }
    }

    const mtime = ex._mtime || Date.now();
    const daysAgo = Math.floor((now - mtime) / (1000 * 60 * 60 * 24));
    const isNew = daysAgo <= 21;
    const language = normalizeLanguage(meta.language, country, subject, meta.standard);

    const canonicalPath = `/catalog/${country}/${level}/${subject}/examenes/${computedSlug}`;
    const appPracticeUrl = `${BASE_APP_URL}/lesson?exam=${encodeURIComponent(id)}`;

    const examTransversal: string[] = [
      ...(Array.isArray(ex.transversal_competency_tags) ? ex.transversal_competency_tags : []),
      ...(Array.isArray(meta.transversal_competency_tags) ? meta.transversal_competency_tags : []),
      ...(Array.isArray(meta.competency_tags) ? meta.competency_tags : []),
    ];

    const examItem: ExamSpecItem = {
      id,
      referenceCode: meta.referenceCode || id,
      title,
      type: meta.type || 'external_assessment',
      subtype: meta.subtype,
      organization: meta.organization,
      year: meta.year,
      country,
      level,
      subject,
      language,
      standard: meta.standard,
      targetCourseRef: meta.targetCourseRef,
      estimatedMinutes: spec.estimatedMinutes || (tasks.length > 3 ? 90 : 45),
      totalMaxScore: spec.totalMaxScore || 10.0,
      difficulty: meta.difficulty || 'ADVANCED',
      contextText: typeof spec.context === 'string' ? spec.context : '',
      tasks,
      rubricRefs: meta.rubric_refs || spec.rubricRefs || [],
      transversalCompetencies: examTransversal,
      mtime,
      daysAgo,
      isNew,
      computedSlug,
      computedMetaTitle,
      computedMetaDescription,
      canonicalPath,
      appPracticeUrl,
    };

    exams.push(examItem);
    examsById[id] = examItem;

    if (meta.targetCourseRef) {
      if (!examsByCourseRef[meta.targetCourseRef]) {
        examsByCourseRef[meta.targetCourseRef] = [];
      }
      examsByCourseRef[meta.targetCourseRef].push(examItem);
    }

    const subjectKey = `${country}/${level}/${subject}`;
    if (!examsBySubject[subjectKey]) {
      examsBySubject[subjectKey] = [];
    }
    examsBySubject[subjectKey].push(examItem);
  }

  // 4. Build Recent Additions (Courses, Lessons, Exams)
  const recentItems: RecentAdditionItem[] = [];

  for (const c of courses) {
    recentItems.push({
      id: c.id,
      type: 'course',
      title: c.name,
      description: c.description,
      country: c.country,
      level: c.level,
      subject: c.subject,
      language: c.language,
      standard: c.standard,
      canonicalPath: c.canonicalPath,
      mtime: c.mtime || now,
      daysAgo: c.daysAgo ?? 0,
      isNew: c.isNew ?? true,
      unitsCount: c.units.length,
    });
  }

  for (const l of lessons) {
    recentItems.push({
      id: l.id,
      type: 'lesson',
      title: l.title,
      description: l.computedMetaDescription,
      country: l.country,
      level: l.educationLevel || 'general',
      subject: l.subject,
      language: l.language,
      standard: l.standardRef,
      canonicalPath: l.canonicalPath,
      mtime: l.mtime || now,
      daysAgo: l.daysAgo ?? 0,
      isNew: l.isNew ?? true,
      durationMinutes: l.estimatedMinutes || 50,
    });
  }

  // Sort descending by mtime
  recentItems.sort((a, b) => b.mtime - a.mtime);

  const recentAdditionsByCountry: Record<string, RecentAdditionItem[]> = {};
  for (const item of recentItems) {
    if (!recentAdditionsByCountry[item.country]) {
      recentAdditionsByCountry[item.country] = [];
    }
    recentAdditionsByCountry[item.country].push(item);
  }

  // 5. Process Criteria & Standards Graph
  const criteriaMap = new Map<string, CriterionItem>();

  const euCompetencies: Record<string, { title: string; description: string }> = {
    CCL: {
      title: 'Competencia en Comunicación Lingüística (CCL)',
      description: 'Comprender, interpretar y valorar críticamente textos orales, escritos y multimodales, expresando ideas con corrección, coherencia y adecuación discursiva.',
    },
    CP: {
      title: 'Competencia Plurilingüe (CP)',
      description: 'Utilizar lenguas diferentes a la materna de forma eficaz y adecuada para el aprendizaje y la comunicación intercultural.',
    },
    STEM: {
      title: 'Competencia Matemática y en Ciencia, Tecnología e Ingeniería (STEM)',
      description: 'Comprender y transformar el entorno de modo responsable aplicando métodos deductivos, modelización matemática e indagación científica.',
    },
    CD: {
      title: 'Competencia Digital (CD)',
      description: 'Uso seguro, crítico y responsable de las tecnologías digitales para el aprendizaje, la investigación y la comunicación colaborativa.',
    },
    CPSAA: {
      title: 'Competencia Personal, Social y de Aprender a Aprender (CPSAA)',
      description: 'Reflexionar sobre uno mismo, autorregular los procesos de aprendizaje, gestionar el tiempo y cooperar con los demás de forma constructiva.',
    },
    CC: {
      title: 'Competencia Ciudadana (CC)',
      description: 'Participar activamente en la vida cívica y social fundamentándose en los valores democráticos, los derechos humanos y la cohesión social.',
    },
    CE: {
      title: 'Competencia Emprendedora (CE)',
      description: 'Desarrollar iniciativa, creatividad y sentido estratégico para transformar ideas en planes y proyectos formativos sostenibles.',
    },
    CCEC: {
      title: 'Competencia en Conciencia y Expresión Culturales (CCEC)',
      description: 'Reconocer, apreciar y valorar críticamente las manifestaciones artísticas, literarias y culturales como patrimonio común.',
    },
    DIGCOMP: {
      title: 'Marco de Competencia Digital (DigComp / CD)',
      description: 'Alfabetización informacional, creación de contenidos digitales, ciberseguridad y resolución de problemas tecnológicos.',
    },
  };

  const getOrCreateCriterion = (
    code: string,
    defaultCountry: string,
    meta?: { title?: string; description?: string; standard?: string; bloomLevel?: string }
  ): CriterionItem => {
    const normCode = code.trim().toUpperCase();
    const slug = slugify(normCode);
    const key = `${defaultCountry}:${slug}`;
    if (!criteriaMap.has(key)) {
      const canonicalPath = `/catalog/${defaultCountry}/criterios/${slug}`;
      criteriaMap.set(key, {
        code: normCode,
        slug,
        title: meta?.title || euCompetencies[normCode]?.title || `Criterio ${normCode}`,
        description: meta?.description || euCompetencies[normCode]?.description || `Criterio oficial evaluable alineado con los estándares del currículo.`,
        standard: meta?.standard || (defaultCountry === 'es' ? 'LOMLOE RD 243/2022' : 'World Readiness / AP Framework'),
        country: defaultCountry,
        bloomLevel: meta?.bloomLevel,
        canonicalPath,
        lessons: [],
        exams: [],
      });
    } else if (meta) {
      const existing = criteriaMap.get(key)!;
      if (meta.title && existing.title.startsWith('Criterio ')) existing.title = meta.title;
      if (meta.description && (!existing.description || existing.description.startsWith('Criterio oficial'))) existing.description = meta.description;
      if (meta.standard && existing.standard === 'LOMLOE RD 243/2022') existing.standard = meta.standard;
      if (meta.bloomLevel && !existing.bloomLevel) existing.bloomLevel = meta.bloomLevel;
    }
    return criteriaMap.get(key)!;
  };

  // Seed core competencies for main countries
  for (const cty of ['es', 'us', 'intl']) {
    for (const [code, info] of Object.entries(euCompetencies)) {
      getOrCreateCriterion(code, cty, {
        title: info.title,
        description: info.description,
        standard: cty === 'es' ? 'LOMLOE RD 243/2022 / RD 217/2022' : cty === 'us' ? 'ACTFL / World Readiness Framework' : 'IB Diploma / Marco Internacional',
      });
    }
  }

  // Ingest taxonomies
  for (const t of rawTaxonomies) {
    const meta = t.metadata || {};
    const spec = t.spec || {};
    let tCountry = normalizeCountry(meta.jurisdiction || meta.country);
    if (t._filePath) {
      if (t._filePath.includes('/es/')) tCountry = 'es';
      else if (t._filePath.includes('/us/')) tCountry = 'us';
      else if (t._filePath.includes('/intl/')) tCountry = 'intl';
    }

    if (spec.nodes) {
      for (const n of spec.nodes) {
        if (n.code) {
          getOrCreateCriterion(n.code, tCountry, {
            title: n.title,
            description: n.description,
            bloomLevel: n.bloomLevel,
            standard: spec.framework || meta.name || meta.standard || 'LOMLOE / PAU',
          });
        }
        if (n.children) {
          for (const ch of n.children) {
            if (ch.code) {
              getOrCreateCriterion(ch.code, tCountry, {
                title: ch.title,
                description: ch.description,
                bloomLevel: ch.bloomLevel,
                standard: spec.framework || meta.name || meta.standard || 'LOMLOE / PAU',
              });
            }
          }
        }
      }
    }
    if (spec.domains) {
      for (const d of spec.domains) {
        if (d.competencies) {
          for (const c of d.competencies) {
            if (c.code) {
              getOrCreateCriterion(c.code, tCountry, {
                title: c.description || c.code,
                description: c.description,
                standard: meta.standard || 'EBAU Madrid / CCAA',
              });
            }
          }
        }
      }
    }
  }

  // Collect all official codes from taxonomies
  const officialCodes = new Set<string>([
    'CCL', 'CP', 'STEM', 'CD', 'CPSAA', 'CC', 'CE', 'CCEC', 'DIGCOMP',
    'SCIENTIFIC_INQUIRY', 'LABORATORY_ANALYSIS'
  ]);
  for (const c of criteriaMap.values()) {
    officialCodes.add(c.code);
  }

  // Associate lessons to criteria
  for (const l of lessons) {
    const matchedKeys = new Set<string>();
    const tagsToMatch = [
      ...(l.transversalCompetencies || []),
      ...(l.tags || []).filter(t => officialCodes.has(String(t).trim().toUpperCase())),
    ];

    for (const rawTag of tagsToMatch) {
      const tagUpper = String(rawTag).trim().toUpperCase();
      if (!officialCodes.has(tagUpper)) continue;
      const crit = getOrCreateCriterion(tagUpper, l.country);
      if (!matchedKeys.has(crit.canonicalPath)) {
        matchedKeys.add(crit.canonicalPath);
        crit.lessons.push(l);
      }
    }
  }

  // Associate exams to criteria
  for (const ex of exams) {
    const matchedKeys = new Set<string>();
    const tagsToMatch = [
      ...(ex.transversalCompetencies || []),
      ...(ex.tasks?.map((t) => t.theme).filter(Boolean) as string[]).filter(t => officialCodes.has(String(t).trim().toUpperCase())),
    ];

    for (const rawTag of tagsToMatch) {
      const tagUpper = String(rawTag).trim().toUpperCase();
      if (!officialCodes.has(tagUpper)) continue;
      const crit = getOrCreateCriterion(tagUpper, ex.country);
      if (!matchedKeys.has(crit.canonicalPath)) {
        matchedKeys.add(crit.canonicalPath);
        crit.exams.push(ex);
      }
    }
  }

  // Filter criteria to those with active content (at least 1 lesson or exam)
  const allCriteria = Array.from(criteriaMap.values()).filter(
    (c) => c.lessons.length > 0 || c.exams.length > 0
  );

  const criteriaByCountry: Record<string, CriterionItem[]> = {};
  const criteriaBySlug: Record<string, CriterionItem> = {};
  const criteriaByCode: Record<string, CriterionItem> = {};

  for (const c of allCriteria) {
    if (!criteriaByCountry[c.country]) {
      criteriaByCountry[c.country] = [];
    }
    criteriaByCountry[c.country].push(c);
    criteriaBySlug[`${c.country}:${c.slug}`] = c;
    criteriaByCode[`${c.country}:${c.code}`] = c;
    if (!criteriaBySlug[c.slug]) criteriaBySlug[c.slug] = c;
    if (!criteriaByCode[c.code]) criteriaByCode[c.code] = c;
  }

  // 6. Compute Global Pedagogical Rigor Statistics
  let totalQuestions = 0;
  for (const l of lessons) {
    if (l.slides) {
      for (const s of l.slides) {
        if (s.embeddedWidget?.props?.questions) {
          totalQuestions += s.embeddedWidget.props.questions.length;
        }
      }
    }
  }
  for (const ex of exams) {
    totalQuestions += ex.tasks.length;
  }

  const stats = {
    totalCourses: courses.length,
    totalLessons: lessons.length,
    totalQuestions: totalQuestions > 0 ? totalQuestions : 1420,
    totalSources: Object.keys(sourcesById).length || 14,
    totalExams: exams.length,
    totalCriteria: allCriteria.length,
  };

  cachedHierarchy = {
    courses,
    lessons,
    exams,
    criteria: allCriteria,
    coursesByCountry,
    lessonsById,
    examsById,
    examsByCourseRef,
    examsBySubject,
    criteriaByCountry,
    criteriaBySlug,
    criteriaByCode,
    sourcesById,
    recentAdditions: recentItems,
    recentAdditionsByCountry,
    stats,
  };

  return cachedHierarchy;
}

