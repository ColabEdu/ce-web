import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
    redirects: {
        '/docs': '/es/',
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
                    label: 'OAS Specification',
                    items: [
                        {
                            label: 'Overview',
                            autogenerate: { directory: 'oas-spec' },
                        },
                        {
                            label: 'Specs Repository',
                            items: [
                                { label: 'Specifications Repository (OAS YAML)', translations: { es: 'Repositorio de Especificaciones (OAS YAML)' }, link: '/specs-repository/' },
                                { label: 'OAS YAML Reference', translations: { es: 'Referencia YAML OAS' }, link: '/specs-repository/oas-yaml-reference/' },
                                {
                                    label: 'Schemas & Models',
                                    translations: { es: 'Esquemas y Modelos' },
                                    autogenerate: { directory: 'reference' },
                                },
                                { label: 'exercise-catalog', autogenerate: { directory: 'specs-repository/exercise-catalog' } }
                            ]
                        }
                    ]
                },
                {
                    label: 'Educational Standards',
                    autogenerate: { directory: 'standards' },
                },
                {
                    label: 'Taxonomies',
                    autogenerate: { directory: 'taxonomies' },
                },
                {
                    label: 'Use Cases',
                    autogenerate: { directory: 'use-cases' },
                },
                {
                    label: 'GitOps Operations',
                    autogenerate: { directory: 'gitops-operations' },
                },
                {
                    label: 'News & Updates',
                    translations: { es: 'Noticias y Novedades' },
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
