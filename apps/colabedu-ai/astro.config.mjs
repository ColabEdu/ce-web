import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({

    integrations: [
        starlight({
            title: 'ColabEdu.ai',
            social: {
                github: 'https://github.com/colabedu/ce-web',
            },
            sidebar: [
                {
                    label: 'Commercial Platform',
                    items: [
                        // Each item here is one entry in the navigation menu.
                        { label: 'API Reference', link: '/api/reference/' },
                    ],
                },
            ],
            // Starlight i18n config integration
            defaultLocale: 'root', // root means the default locale is at /
            locales: {
                root: {
                    label: 'Español (España)',
                    lang: 'es',
                },
                'en-US': {
                    label: 'English (US)',
                    lang: 'en-US',
                },
                'es-MX': {
                    label: 'Español (México)',
                    lang: 'es-MX',
                },
                'es-US': {
                    label: 'Español (US)',
                    lang: 'es-US',
                },
            }
        }),
        react(),
        icon(),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
