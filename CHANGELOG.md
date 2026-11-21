# Changelog

## [0.9.16] - 2026-11-20

### Added
- **Esponsorización OER, Filtrado `seoStatus` y Refinamiento de Páginas Curriculares (`apps/colabedu-net`, `apps/colabedu-catalog`)**:
  - Nueva página bilingüe de esponsorización de digitalización de libros OER (`#4`).
  - Filtrado de catálogo por `metadata.seo.status` con insignia `Experimental` y actualización de `catalog-philosophy.astro` e `interactive-lessons.astro` (`/{es,en}`).
  - Gate de validación JSON Schema en CI para `extension-selectors.v1.json`.

### Changed
- **Ecosystem Alignment**: Alineación de release a **`0.9.16`**.

## [0.9.13] - 2026-11-19

### Added
- **Trust & Compliance Center de 2 Niveles y Páginas Legales Bilingües (`apps/colabedu-net`)**:
  - Publicados los 9 PDFs de Nivel 1 en `apps/colabedu-net/public/legal/` (`ColabEdu-DPA-GDPR-LOPDGDD-ES.pdf`, `ColabEdu-DPA-GDPR-EN.pdf`, `ColabEdu-US-SDPC-FERPA-Exhibit.pdf`, `ColabEdu-EU-AI-Act-Transparency-Sheet.pdf`, `ColabEdu-Extension-Security-OnePager.pdf`, `ColabEdu-Privacy-Policy-and-COPPA-Notice-{ES,EN}.pdf` y `ColabEdu-Terms-of-Service-and-AUP-{ES,EN}.pdf`).
  - Nuevas páginas legales `/{es,en}/privacy.astro` (Política de Privacidad & Aviso COPPA) y `/{es,en}/terms.astro` (Términos del Servicio & AUP) enlazadas desde `Footer.astro`.
  - Actualizado `/{es,en}/trust.astro` con diseño en 2 niveles (Nivel 1 de descarga pública directa y Nivel 2 de solicitud del Paquete de Auditoría Institucional para DPDs y CISOs).
- **Documentación del Flag `--zero-pii` en Tutoriales del CLI (`apps/colabedu-org`, `apps/colabedu-support`)**:
  - Sincronizados los 4 tutoriales del CLI (`es`/`en` en `colabedu-org` y `colabedu-support`) documentando `--zero-pii=true|false` en `./ce-cli.sh grading evaluate`.

## [0.9.12] - 2026-11-13

### Added
- **Vistas Modulares de Aula Diaria y Exploración por Zona en `colabedu-net`**:
  - Nuevos componentes modulares (`HomeView.astro`, `DailyClassroomView.astro`, `DailyCourseExplorer.astro`, `SubjectsByZoneView.astro`) y dataset curricular `dailyCurriculum.ts`.
  - Nuevas rutas estáticas `/en/daily-classroom`, `/en/index-institutional`, `/en/subjects` y `/es/asignaturas`.
  - Documentación operativa de despliegue demo en `DEMO_DEPLOYMENT.md`.

### Changed
- **Refactorización de Portada, Cabecera y Modales (`colabedu-net`, `colabedu-org`, `ui-core`)**:
  - Simplificación de `es/index.astro` y `en/index.astro` delegando en `HomeView.astro`; mejoras en `Header.astro`, `cross-competencies.astro`, `Footer.astro` y `GlobalModalHost.astro`.
  - **Ecosystem Alignment**: Alineación de release a **`0.9.12`**.

## [0.9.11] - 2026-11-12

### Added
- **Ecosistema de los Tres Catálogos en `colabedu-net` (`src/pages/{es,en}/catalogs.astro`)**:
  - Nueva página canónica que explica la convivencia y estructura de los tres catálogos: Cursos Canónicos por Ritmo (`FULL_YEAR`, `INTENSIVE`, `EXAM_MASTERY`, `REMEDIATION`), OER Públicos Digitalizados (con esponsorización B2G), y el Catálogo de la Comunidad docente.
- **Paneles de Rúbrica y Atribución OER en `colabedu-catalog`**:
  - `TeacherRubricPanel.astro`: Desglose interactivo de criterios de evaluación, descriptores cualitativos y ponderaciones para docentes.
  - `OerAttributionPanel.astro`: Panel de trazabilidad legal de licencias abiertas (Creative Commons BY-SA, INTEF, OpenStax).
  - Componente de marcado estructurado JSON-LD `LearningResourceJsonLd.astro` optimizado para indexación en Google for Education.
- **Tutoriales Completos del CLI y Base de Conocimiento de Soporte**:
  - Publicado el tutorial del CLI en inglés y español en `ce-web/apps/colabedu-support/src/content/docs/{admin,en/admin}/cli-tutorial.mdx`.
  - Actualizado el tutorial canónico en `ce-web/apps/colabedu-org/src/content/docs/{es,en}/gitops-operations/cli-tutorial.mdx` enlazando con `CHANGELOG_CLI.md`.
- **Modales Contextuales y Analítica PLG**:
  - Modales de soporte y telemetría de eventos de embudo en Google Analytics 4 (GA4).

### Changed
- **Ecosystem Alignment**: Bump de versión a **`0.9.11`**.

## [0.9.10] - 2026-10-28

### Added
- **Catalog Multilingual Switcher & Regional Flags**:
  - Restored dynamic locale negotiation and language selector across `colabedu.org` and course catalog pages.
  - Added SVG and PNG regional flag icons for Catalan (`flag_ca.png`), Basque (`flag_eu.png`), and Galician (`flag_gl.png`).
- **SEO Static Generation & Canary Sitemaps**:
  - Configured deterministic Astro 5 SSG sitemap generation with partitioned sitemaps (Canary Pilot, Spain, US AP).
- **Multi-Standard Curriculum & Readiness Documentation**:
  - Updated documentation portal with references for the 6-layer OPS readiness radar, national EBAU/PAU certification, and multi-standard assessment frameworks (US AP, California CDE, Mexico SEP, and IB DP).

### Changed
- **Ecosystem Alignment**: Bumped web platform documentation to version `0.9.10`.

## [0.9.9] - 2026-10-17

### Added
- **CLI & Curator Complete Reference Documentation**:
  - `docs/cli-complete-reference-es.md` and `docs/cli-complete-reference-en.md`: Comprehensive documentation covering `./ce-cli.sh` syntax for grading, OER ingestion, and course readiness.
  - Updated Curator tutorials (`tutorial-cli-curator-es.md`, `tutorial-cli-curator-en.md`).

## [0.9.2] - 2026-09-10

### Changed
- **Ecosystem Alignment**: Bumped web documentation and reference portals to align with release `v0.9.2`.

## [0.9.0] - 2026-09-06

### Added
- **Catalog & Reference Documentation Updates**: Updated reference docs and curriculum catalog specifications for v0.9.0 release.
- **Digital Sovereignty & AI Ethics Content**: Expanded documentation on regional sovereignty and local model execution.

## [0.5.0] - 2026-05-24

### Added
- ColabEdu institutional website and documentation structure (Astro/Firebase).
- Translation scripts for i18n support.
- PNPM workspace configuration for frontend packages.
- Dockerfile, Skaffold, and deployment configs for the web application.
- Initial UI mockups and design assets.

### Changed
- Migrated static content to a monorepo structure.
