# Changelog

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
