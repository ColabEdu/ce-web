export interface SeoMetadata {
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  search_queries?: string[];
  featured_axiom?: string;
}

export interface SlideQuestion {
  text: string;
  options?: string[];
  correct?: number;
  explanation?: string;
}

export interface SlideWidget {
  type: string;
  props?: {
    title?: string;
    questions?: SlideQuestion[];
    pairs?: Array<{ left: string; right: string }>;
    taskId?: string;
  };
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  layout?: string;
  content?: string;
  embeddedWidget?: SlideWidget;
  media?: {
    type?: string;
    src?: string;
    caption?: string;
  };
}

export interface OerSourceItem {
  id: string;
  title: string;
  authority: string;
  type?: string;
  license: string;
  authors?: string[];
  sourceUrl?: string;
  filePath?: string;
  appColabEduUrl?: string;
  format?: string;
  role?: string;
}

export interface InteractiveLessonItem {
  id: string;
  referenceCode: string;
  title: string;
  subject: string;
  standardRef?: string;
  targetCourseRef?: string;
  targetUnitRef?: string;
  educationLevel?: string;
  estimatedMinutes?: number;
  tags?: string[];
  learningObjectives?: string[];
  slides?: SlideItem[];
  pedagogical_metadata?: {
    target_audience?: string;
    scaffolding_strategy?: string;
    cognitive_domains?: string[];
    ap_framework_alignment?: {
      theme?: string;
      topic?: string;
      skills?: string[];
    };
  };
  seo?: SeoMetadata;
  resolvedSources?: OerSourceItem[];
  country: string;
  educationLevel?: string;
  language: string;
  mtime?: number;
  daysAgo?: number;
  isNew?: boolean;
  // Computed fields for SEO & routing
  computedSlug: string;
  computedMetaTitle: string;
  computedMetaDescription: string;
  canonicalPath: string;
}

export interface CourseUnitLessonRef {
  title: string;
  lessonSpecRef?: string;
  estimatedDurationMinutes?: number;
  estimatedSlides?: number;
}

export interface CourseUnitItem {
  id: string;
  name: string;
  slug: string;
  pathwayRef?: string;
  lessons: CourseUnitLessonRef[];
  resolvedLessons?: InteractiveLessonItem[];
}

export interface CourseSpecItem {
  id: string;
  referenceCode: string;
  name: string;
  description: string;
  standard: string;
  country: string;
  level: string;
  subject: string;
  language: string;
  author?: string;
  version?: string;
  target_weeks?: number;
  weekly_sessions?: number;
  total_annual_sessions?: number;
  rubric_refs?: string[];
  units: CourseUnitItem[];
  seo?: SeoMetadata;
  resolvedSources?: OerSourceItem[];
  mtime?: number;
  daysAgo?: number;
  isNew?: boolean;
  // Computed fields
  computedSlug: string;
  computedMetaTitle: string;
  computedMetaDescription: string;
  canonicalPath: string;
}

export interface RecentAdditionItem {
  id: string;
  type: 'course' | 'lesson';
  title: string;
  description: string;
  country: string;
  level: string;
  subject: string;
  language: string;
  standard?: string;
  canonicalPath: string;
  mtime: number;
  daysAgo: number;
  isNew: boolean;
  durationMinutes?: number;
  unitsCount?: number;
}

export interface ExamTaskItem {
  id: string;
  title?: string;
  type: string;
  prompt: string;
  score?: number;
  expectedOutputFormat?: string;
  theme?: string;
  guidelines?: string[];
}

export interface ExamSpecItem {
  id: string;
  referenceCode: string;
  title: string;
  type: string;
  subtype?: string;
  organization?: string;
  year?: number;
  country: string;
  level: string;
  subject: string;
  language: string;
  standard?: string;
  targetCourseRef?: string;
  estimatedMinutes?: number;
  totalMaxScore?: number;
  difficulty?: string;
  contextText?: string;
  tasks: ExamTaskItem[];
  rubricRefs?: string[];
  mtime: number;
  daysAgo: number;
  isNew: boolean;
  computedSlug: string;
  computedMetaTitle: string;
  computedMetaDescription: string;
  canonicalPath: string;
  appPracticeUrl: string;
}

export interface CatalogGlobalStats {
  totalCourses: number;
  totalLessons: number;
  totalQuestions: number;
  totalSources: number;
  totalExams: number;
}

export interface CatalogHierarchy {
  courses: CourseSpecItem[];
  lessons: InteractiveLessonItem[];
  exams: ExamSpecItem[];
  coursesByCountry: Record<string, CourseSpecItem[]>;
  lessonsById: Record<string, InteractiveLessonItem>;
  examsById: Record<string, ExamSpecItem>;
  examsByCourseRef: Record<string, ExamSpecItem[]>;
  examsBySubject: Record<string, ExamSpecItem[]>;
  sourcesById: Record<string, OerSourceItem>;
  recentAdditions: RecentAdditionItem[];
  recentAdditionsByCountry: Record<string, RecentAdditionItem[]>;
  stats: CatalogGlobalStats;
}


