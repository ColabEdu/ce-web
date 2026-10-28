// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const GA_MEASUREMENT_ID = process.env.PUBLIC_GA_MEASUREMENT_ID || 'G-NP3RNJE5BF';

// https://astro.build/config
export default defineConfig({
	server: {
		allowedHosts: true,
	},
	integrations: [
		starlight({
			title: 'Centro de Ayuda - ColabEdu',
			components: {
				Footer: './src/components/Footer.astro',
			},
			customCss: [
				'../../packages/ui-core/src/styles/starlight-overrides.css',
			],
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español (España)', lang: 'es' },
				en: { label: 'English (US)', lang: 'en' },
			},
			head: [
				...(GA_MEASUREMENT_ID ? [
					{
						tag: 'script',
						attrs: {
							async: true,
							src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
						}
					},
					{
						tag: 'script',
						content: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('consent', 'default', {
								'analytics_storage': 'granted',
								'ad_storage': 'denied',
								'ad_user_data': 'denied',
								'ad_personalization': 'denied'
							});
							gtag('config', '${GA_MEASUREMENT_ID}', {
								cookie_domain: 'colabedu.org',
								cookie_flags: 'SameSite=None;Secure',
								anonymize_ip: true,
								send_page_view: true
							});
						`
					}
				] : []),
				{
					tag: 'script',
					content: `
						(function() {
							var path = window.location.pathname;
							var isEn = path.startsWith('/en');

							// En la raíz '/', detectar si debe redirigir a /en/ según la preferencia guardada o navegador
							if (path === '/' || path === '') {
								var urlParams = new URLSearchParams(window.location.search);
								var urlLang = urlParams.get('lang') || urlParams.get('locale');
								var cookieMatch = document.cookie.match(/(^|;\\s*)colabedu_preferred_locale=([^;]*)/);
								var cookieLang = cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;
								var saved = localStorage.getItem('colabedu_preferred_locale')
									|| localStorage.getItem('colabedu_locale')
									|| localStorage.getItem('colabedu_lang');

								var navLangs = navigator.languages || (navigator.language ? [navigator.language] : []);
								var browserLang = null;
								for (var i = 0; i < navLangs.length; i++) {
									if (!navLangs[i]) continue;
									var code = navLangs[i].toLowerCase().split(/[-_]/)[0];
									if (code === 'en' || code === 'es') {
										browserLang = code;
										break;
									}
								}

								var wantEn = (urlLang === 'en')
									|| (cookieLang === 'en')
									|| (saved === 'en')
									|| (!cookieLang && !saved && browserLang === 'en');

								if (wantEn) {
									window.location.replace('/en/' + window.location.search);
									return;
								}
							}

							// Sincronizar preferencia en cookie de raíz y localStorage
							var currentLang = isEn ? 'en' : 'es';
							try {
								localStorage.setItem('colabedu_preferred_locale', currentLang);
								var domainAttr = window.location.hostname.endsWith('colabedu.org') ? '; domain=.colabedu.org' : '';
								document.cookie = 'colabedu_preferred_locale=' + currentLang + domainAttr + '; path=/; max-age=31536000; SameSite=Lax';
							} catch(e) {}
						})();
					`
				}
			],
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
	vite: {
		server: {
			allowedHosts: true,
		},
	},
});
