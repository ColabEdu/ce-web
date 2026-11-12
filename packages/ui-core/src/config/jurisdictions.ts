/**
 * ColabEdu Sovereign Curricular Jurisdictions & Localization Registry
 *
 * Defines the authoritative mapping for:
 * 1. Educational Jurisdictions (L0 Grounding, Standards, Frameworks, Evaluation Scales)
 * 2. Supported / Heritage / Community Languages (>1M speakers)
 * 3. Default Currencies, OER Repositories and Territorial Metadata.
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  asset?: string;
  isOfficial: boolean;
  isHeritageOrCommunity?: boolean;
  speakerCountDescription?: string;
}

export interface OfficialEvaluationScale {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  passingScore: number;
  precision: number;
  format: (score: number) => string;
}

export interface EducationalJurisdiction {
  code: string; // ISO 3166-1 alpha-2 or territorial slug: 'es', 'us', 'mx', 'intl'
  name: string;
  nativeName: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Global';
  defaultLocale: string;
  supportedLocales: LanguageOption[];
  primaryFramework: string;
  normativeReference: string;
  description: string;
  defaultCurrency: 'EUR' | 'USD' | 'MXN' | 'GBP' | 'JPY' | 'INR';
  currencySymbol: string;
  taxPolicy: 'VAT_INCLUDED' | 'SALES_TAX_EXEMPT_DISTRICT' | 'STANDARD_TAX';
  canonicalOerRepositories: Array<{
    id: string;
    name: string;
    authority: string;
    url: string;
  }>;
  evaluationScale: OfficialEvaluationScale;
}

export const JURISDICTIONS_REGISTRY: Record<string, EducationalJurisdiction> = {
  es: {
    code: 'es',
    name: 'Spain',
    nativeName: 'España',
    flag: '🇪🇸',
    region: 'Europe',
    defaultLocale: 'es',
    supportedLocales: [
      { code: 'es', name: 'Spanish', nativeName: 'Español (Castellano)', flag: '🇪🇸', isOfficial: true },
      { code: 'ca', name: 'Catalan', nativeName: 'Català', asset: '/catalog/assets/flags/flag_ca.png', isOfficial: true, speakerCountDescription: '>9M hablantes' },
      { code: 'gl', name: 'Galician', nativeName: 'Galego', asset: '/catalog/assets/flags/flag_gl.png', isOfficial: true, speakerCountDescription: '>2.5M hablantes' },
      { code: 'eu', name: 'Basque', nativeName: 'Euskara', asset: '/catalog/assets/flags/flag_eu.png', isOfficial: true, speakerCountDescription: '>1M hablantes' },
      { code: 'en', name: 'English', nativeName: 'English (Bilingual CLIL)', flag: '🇬🇧', isOfficial: false },
    ],
    primaryFramework: 'LOMLOE / EBAU-PAU (RD 243/2022 & RD 534/2024)',
    normativeReference: 'BOE-A-2022-5521 / BOE-A-2024-11842',
    description: 'Currículo nacional de ESO y Bachillerato, alineado con las matrices de especificaciones y criterios de corrección armonizados de acceso a la universidad (PAU).',
    defaultCurrency: 'EUR',
    currencySymbol: '€',
    taxPolicy: 'VAT_INCLUDED',
    canonicalOerRepositories: [
      { id: 'edia', name: 'Proyecto EDIA', authority: 'CEDEC / INTEF', url: 'https://cedec.intef.es/proyecto-edia/' },
      { id: 'procomun', name: 'Procomún', authority: 'Ministerio de Educación y FP', url: 'https://procomun.educacion.gob.es/' },
      { id: 'marea-verde', name: 'Textos Marea Verde', authority: 'Comunidad Docente Abierta', url: 'https://www.apoyomareaverde.es/' },
    ],
    evaluationScale: {
      id: 'scale.lomloe.es',
      name: 'Escala Oficial LOMLOE / EBAU (0 - 10)',
      minScore: 0.0,
      maxScore: 10.0,
      passingScore: 5.0,
      precision: 2,
      format: (score) => score.toFixed(2),
    },
  },

  us: {
    code: 'us',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    defaultLocale: 'en',
    supportedLocales: [
      { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', isOfficial: true },
      { code: 'es', name: 'Spanish', nativeName: 'Español (Heritage / ELL / Newcomers)', flag: '🇲🇽', isOfficial: false, isHeritageOrCommunity: true, speakerCountDescription: '>41M Spanish speakers in US (>1.2M in CA K-12)' },
      { code: 'zh', name: 'Chinese', nativeName: '中文 (Mandarin / Cantonese)', flag: '🇨🇳', isOfficial: false, isHeritageOrCommunity: true, speakerCountDescription: '>3.5M speakers in US (>1M in California)' },
      { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog / Filipino', flag: '🇵🇭', isOfficial: false, isHeritageOrCommunity: true, speakerCountDescription: '>1.7M speakers in US (>800k in California)' },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', isOfficial: false, isHeritageOrCommunity: true, speakerCountDescription: '>1.5M speakers in US (>600k in California)' },
    ],
    primaryFramework: 'College Board Advanced Placement (AP) & California CDE',
    normativeReference: 'College Board AP Course & Exam Descriptions / California CDE Frameworks',
    description: 'Advanced Placement (AP), Common Core and California CDE standards with multi-lingual scaffolding for English Learners and Heritage speakers.',
    defaultCurrency: 'USD',
    currencySymbol: '$',
    taxPolicy: 'SALES_TAX_EXEMPT_DISTRICT',
    canonicalOerRepositories: [
      { id: 'openstax', name: 'OpenStax', authority: 'Rice University', url: 'https://openstax.org/' },
      { id: 'ck12', name: 'CK-12 Foundation', authority: 'CK-12', url: 'https://www.ck12.org/' },
      { id: 'oercommons', name: 'OER Commons', authority: 'ISKME', url: 'https://www.oercommons.org/' },
    ],
    evaluationScale: {
      id: 'scale.ap.us',
      name: 'AP Composite Score (1 - 5) & Percentage Rubric (0 - 100%)',
      minScore: 1,
      maxScore: 5,
      passingScore: 3,
      precision: 0,
      format: (score) => Math.round(score).toString(),
    },
  },

  mx: {
    code: 'mx',
    name: 'Mexico',
    nativeName: 'México',
    flag: '🇲🇽',
    region: 'Americas',
    defaultLocale: 'es',
    supportedLocales: [
      { code: 'es', name: 'Spanish', nativeName: 'Español (México)', flag: '🇲🇽', isOfficial: true },
      { code: 'en', name: 'English', nativeName: 'Inglés (Lengua Adicional)', flag: '🇺🇸', isOfficial: false },
    ],
    primaryFramework: 'SEP / Marco Curricular Común (NEM & CENEVAL EXANI-II)',
    normativeReference: 'Acuerdo Secretarial SEP 01/01/24 / CENEVAL EXANI Guías Oficiales',
    description: 'Planes de estudio de Educación Media Superior (Preparatoria/Bachillerato) de la Secretaría de Educación Pública y preparación de reactivos CENEVAL EXANI-II.',
    defaultCurrency: 'MXN',
    currencySymbol: '$',
    taxPolicy: 'VAT_INCLUDED',
    canonicalOerRepositories: [
      { id: 'sep-conaliteg', name: 'CONALITEG', authority: 'Secretaría de Educación Pública', url: 'https://conaliteg.sep.gob.mx/' },
      { id: 'redalyc', name: 'Redalyc / UAEM', authority: 'Red de Revistas Científicas de ALyC', url: 'https://www.redalyc.org/' },
      { id: 'recursos-unam', name: 'Recursos Educativos Abiertos UNAM', authority: 'Universidad Nacional Autónoma de México', url: 'https://cuaieed.unam.mx/' },
    ],
    evaluationScale: {
      id: 'scale.sep.mx',
      name: 'Escala Oficial SEP / Bachillerato (5 - 10)',
      minScore: 5.0,
      maxScore: 10.0,
      passingScore: 6.0,
      precision: 1,
      format: (score) => score.toFixed(1),
    },
  },

  intl: {
    code: 'intl',
    name: 'International',
    nativeName: 'Internacional',
    flag: '🌐',
    region: 'Global',
    defaultLocale: 'en',
    supportedLocales: [
      { code: 'en', name: 'English', nativeName: 'English (IB Working Language)', flag: '🇬🇧', isOfficial: true },
      { code: 'es', name: 'Spanish', nativeName: 'Español (Lengua A / B)', flag: '🇪🇸', isOfficial: true },
      { code: 'fr', name: 'French', nativeName: 'Français (Langue A / B)', flag: '🇫🇷', isOfficial: true },
    ],
    primaryFramework: 'International Baccalaureate (IB Diploma Programme)',
    normativeReference: 'IBO Diploma Programme Assessment Principles & Subject Guides',
    description: 'International Baccalaureate (IB) Diploma courses focusing on critical inquiry, conceptual understanding, and Criterion-referenced assessment (1-7).',
    defaultCurrency: 'USD',
    currencySymbol: '$',
    taxPolicy: 'SALES_TAX_EXEMPT_DISTRICT',
    canonicalOerRepositories: [
      { id: 'mit-ocw', name: 'MIT OpenCourseWare', authority: 'MIT', url: 'https://ocw.mit.edu/' },
      { id: 'cervantes', name: 'Biblioteca Virtual Miguel de Cervantes', authority: 'Instituto Cervantes', url: 'https://www.cervantesvirtual.com/' },
    ],
    evaluationScale: {
      id: 'scale.ib.intl',
      name: 'IB Diploma Grade Scale (1 - 7)',
      minScore: 1,
      maxScore: 7,
      passingScore: 4,
      precision: 0,
      format: (score) => Math.round(score).toString(),
    },
  },
};

/**
 * Returns all active jurisdiction keys.
 */
export function getAvailableJurisdictions(): EducationalJurisdiction[] {
  return Object.values(JURISDICTIONS_REGISTRY);
}

/**
 * Safely resolves a jurisdiction by country code, with fallback to Spain or International.
 */
export function resolveJurisdiction(countryCode?: string): EducationalJurisdiction {
  if (!countryCode) return JURISDICTIONS_REGISTRY['es'];
  const normalized = countryCode.toLowerCase().trim();
  return JURISDICTIONS_REGISTRY[normalized] || JURISDICTIONS_REGISTRY['es'];
}
