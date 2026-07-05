import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
    redirects: {
        '/docs': '/lang-detect',
    },
    integrations: [
        mermaid(),
        starlight({
            title: 'ColabEdu.org',
            components: {
                Footer: './src/components/Footer.astro',
                SiteTitle: './src/components/SiteTitle.astro',
            },
            customCss: [
                '../../packages/ui-core/src/styles/starlight-overrides.css',
            ],
            head: [
                {
                    tag: 'script',
                    attrs: { type: 'module' },
                    content: 'import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"; mermaid.initialize({ startOnLoad: true, theme: "default" });'
                },
                {
                    tag: 'script',
                    content: `
                        const injectLink = () => {
                            if (!document.getElementById('custom-blog-link')) {
                                const target = document.querySelector('.social-icons') || document.querySelector('theme-select');
                                if (target && target.parentNode) {
                                    const link = document.createElement('a');
                                    link.id = 'custom-blog-link';
                                    link.href = '/es/news';
                                    link.textContent = 'Blog / News';
                                    link.style.cssText = 'margin-right: 1.5rem; font-weight: 600; color: var(--sl-color-accent-high); text-decoration: none;';
                                    target.parentNode.insertBefore(link, target);
                                }
                            }
                        };
                        document.addEventListener('DOMContentLoaded', injectLink);
                        document.addEventListener('astro:page-load', injectLink);
                    `
                }
            ],
            social: {
                github: 'https://github.com/colabedu/ce-web',
            },
            sidebar: [
                {
                    label: 'Visión Institucional',
                    translations: { en: 'Institutional Vision' },
                    items: [
                        { label: 'Nuestra Historia', translations: { en: 'Our Story' }, link: '/about/' },
                        { label: 'Soberanía Digital', translations: { en: 'Digital Sovereignty' }, link: '/soberania-digital/' },
                        { label: 'Estrategia Español', translations: { en: 'Spanish Strategy' }, link: '/focus-espanol/' },
                    ]
                },
                {
                    label: 'Especificación OAS',
                    translations: { en: 'OAS Specification' },
                    items: [
                        { label: 'Visión General', translations: { en: 'Overview' }, link: '/oas-spec/' },
                        { label: 'Vacío Tecnológico', translations: { en: 'Technological Gap' }, link: '/oas-spec/why-open-specs/' },
                        { label: 'Ecosistema y Comunidad', translations: { en: 'Ecosystem and Community' }, link: '/oas-spec/ecosistema-comunidad/' },
                        { label: 'Nomenclatura GitOps', translations: { en: 'GitOps Nomenclature' }, link: '/oas-spec/architecture/nomenclatura-gitops/' },
                        { label: 'Contenido Interactivo AI', translations: { en: 'Interactive AI Content' }, link: '/oas-spec/architecture/contenido-interactivo-ai/' },
                        {
                            label: 'Repositorio de Specs',
                            translations: { en: 'Specs Repository' },
                            items: [
                                { label: 'Repositorio de Especificaciones', translations: { en: 'Specifications Repository' }, link: '/specs-repository/' },
                                { label: 'Referencia YAML OAS', translations: { en: 'OAS YAML Reference' }, link: '/specs-repository/oas-yaml-reference/' },
                                {
                                    label: 'Esquemas y Modelos',
                                    translations: { en: 'Schemas & Models' },
                                    autogenerate: { directory: 'reference' },
                                },
                                {
                                    label: 'Catálogos',
                                    translations: { en: 'Catalogs' },
                                    autogenerate: { directory: 'specs-repository/spec-catalog' },
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Estándares y Taxonomías',
                    translations: { en: 'Standards and Taxonomies' },
                    items: [
                        { label: 'Visión General de Estándares', translations: { en: 'Standards Overview' }, link: '/standards/' },
                        { label: 'Estándar LOMLOE (España)', translations: { en: 'LOMLOE Standard' }, link: '/standards/es/lomloe/' },
                        { label: 'Estándar IB (Internacional)', translations: { en: 'IB Standard' }, link: '/standards/global/ib/' },
                        { label: 'Estándar AP (EE. UU.)', translations: { en: 'AP Standard' }, link: '/standards/us/ap/' },
                        { label: 'Estándar SEP (México)', translations: { en: 'SEP Standard' }, link: '/standards/mx/sep-mejoredu/' },
                        { label: 'Marcos de Competencia', translations: { en: 'Competency Frameworks' }, link: '/taxonomies/competency-frameworks/' },
                    ]
                },
                {
                    label: 'Motores de Contenido IA',
                    translations: { en: 'AI Content Engines' },
                    items: [
                        { label: 'Capacidades del Curador', translations: { en: 'Curator Capabilities' }, link: '/gitops-operations/curator-capabilities/' },
                        { label: 'Agente Curador Autónomo (ACA)', translations: { en: 'Autonomous Curator Agent' }, link: '/gitops-operations/aca/' },
                        { label: 'Motor Seed & Bloom', translations: { en: 'Seed & Bloom Engine' }, link: '/gitops-operations/seed-and-bloom/' },
                        { label: 'Ciclo de Vida Curricular', translations: { en: 'Curriculum Lifecycle' }, link: '/gitops-operations/curriculum-lifecycle/' },
                    ]
                },
                {
                    label: 'Integraciones y Servicios',
                    translations: { en: 'Integrations and Services' },
                    items: [
                        { label: 'Integración LMS y LTI', translations: { en: 'LMS and LTI Integration' }, link: '/gitops-operations/lms-integration/' },
                        { label: 'Roles y Arquitectura de UX', translations: { en: 'Roles and UX Architecture' }, link: '/oas-spec/architecture/roles-ux-architecture/' },
                    ]
                },
                {
                    label: 'Operaciones GitOps y CLI',
                    translations: { en: 'GitOps Operations and CLI' },
                    items: [
                        { label: 'Tutorial del CLI', translations: { en: 'CLI Tutorial' }, link: '/gitops-operations/cli-tutorial/' },
                        { label: 'Estrategia de Content Factory', translations: { en: 'Content Factory Strategy' }, link: '/gitops-operations/content-factory-strategy/' },
                        { label: 'Federación de Repositorios', translations: { en: 'Repository Federation' }, link: '/gitops-operations/repo-federation/' },
                        { label: 'Pipelines de Ingesta', translations: { en: 'Ingestion Pipelines' }, link: '/gitops-operations/ingestion-pipelines/' },
                    ]
                },
                {
                    label: 'Casos de Uso',
                    translations: { en: 'Use Cases' },
                    autogenerate: { directory: 'use-cases' },
                },
                {
                    label: 'Noticias y Novedades',
                    translations: { en: 'News & Updates' },
                    autogenerate: { directory: 'news' },
                },
            ],
            // Starlight i18n config
            defaultLocale: 'es',
            locales: {
                es: {
                    label: 'Español (España)',
                    lang: 'es',
                },
                en: {
                    label: 'English (US)',
                    lang: 'en',
                },
            },
        }),
        react(),
        icon(),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
