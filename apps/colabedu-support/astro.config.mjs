// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Centro de Ayuda - ColabEdu',
			customCss: [
				'../../packages/ui-core/src/styles/starlight-overrides.css',
			],
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español (España)', lang: 'es' },
				en: { label: 'English (US)', lang: 'en' },
			},
			sidebar: [
				{ 
					label: '👩‍🏫 Para Docentes', 
					translations: { en: '👩‍🏫 For Teachers' },
					items: [{ autogenerate: { directory: 'teachers' } }] 
				},
				{ 
					label: '👨‍🎓 Para Estudiantes', 
					translations: { en: '👨‍🎓 For Students' },
					items: [{ autogenerate: { directory: 'students' } }] 
				},
				{ 
					label: '🏫 Para Colegios y Distritos', 
					translations: { en: '🏫 For Schools and Districts' },
					items: [{ autogenerate: { directory: 'admin' } }] 
				},
				{ 
					label: '⚙️ Facturación y Cuentas', 
					translations: { en: '⚙️ Billing and Accounts' },
					items: [{ autogenerate: { directory: 'billing' } }] 
				}
			],
		}),
	],
});
