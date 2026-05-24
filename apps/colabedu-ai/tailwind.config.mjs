/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', '../../packages/ui-core/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo 600
                secondary: '#10B981', // Emerald 500
                accent: '#10B981', // Emerald 500 (same as secondary)
                dark: '#0F172A', // Slate 900
                neutral: '#F8FAFC', // Slate 50
                publisher: '#F59E0B', // Amber 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
