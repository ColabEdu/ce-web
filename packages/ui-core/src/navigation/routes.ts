/**
 * ColabEdu Multi-App Navigation & Routing Helper
 *
 * Resolves canonical inter-app URLs transparently across:
 * - Local development (localhost / Tailscale local.colabedu.org)
 * - Demo / Staging (multi-tenant app.<tenant>.demo.colabedu.net / Firebase Hosting)
 * - Production (canonical sovereign domains *.colabedu.org / *.colabedu.net)
 */

export type AppTarget = 'org' | 'catalog' | 'net' | 'support' | 'app' | 'api';

export type ColabEduEnv = 'local' | 'demo' | 'prod';

export interface AppConfigMeta {
  target: AppTarget;
  name: string;
  devPort: number;
  devBaseUrl: string;
  demoBaseUrl: string | ((tenant?: string) => string);
  prodBaseUrl: string;
  description: string;
}

export interface AppBaseUrlOptions {
  env?: ColabEduEnv;
  tenant?: string;
}

export const APP_REGISTRY: Record<AppTarget, AppConfigMeta> = {
  org: {
    target: 'org',
    name: 'ColabEdu.org',
    devPort: 4321,
    devBaseUrl: 'http://local.colabedu.org:4321',
    demoBaseUrl: 'https://colabedu-org-demo.web.app',
    prodBaseUrl: 'https://colabedu.org',
    description: 'Landing institucional, Especificaciones OPS y Laboratorio de Demos',
  },
  catalog: {
    target: 'catalog',
    name: 'Catálogo Curricular OPS',
    devPort: 4323,
    devBaseUrl: 'http://local.colabedu.org:4321/catalog', // Acceso preferido vía proxy en dev
    demoBaseUrl: 'https://colabedu-org-demo.web.app/catalog',
    prodBaseUrl: 'https://colabedu.org/catalog',
    description: 'Catálogo Curricular Soberano SSG y lecciones interactivas',
  },
  net: {
    target: 'net',
    name: 'ColabEdu.net LMS',
    devPort: 8082,
    devBaseUrl: 'http://local.colabedu.org:8082',
    demoBaseUrl: 'https://colabedu-net-demo.web.app',
    prodBaseUrl: 'https://colabedu.net',
    description: 'Plataforma web LMS, matriculación y gestión de cursos',
  },
  support: {
    target: 'support',
    name: 'Soporte y Ayuda',
    devPort: 4322,
    devBaseUrl: 'http://local.colabedu.org:4322',
    demoBaseUrl: 'https://support.colabedu.net',
    prodBaseUrl: 'https://support.colabedu.net',
    description: 'Centro de ayuda, guías docentes y tickets de soporte',
  },
  app: {
    target: 'app',
    name: 'ColabEdu Interactive App (Flutter Web)',
    devPort: 8080,
    devBaseUrl: 'http://local.colabedu.org:8080',
    demoBaseUrl: (tenant?: string) => `https://app.${tenant || 'intef'}.demo.colabedu.net`,
    prodBaseUrl: 'https://app.colabedu.org',
    description: 'Motor de ejecución Flutter Web A2UI y tutor socrático',
  },
  api: {
    target: 'api',
    name: 'ColabEdu Backend Services',
    devPort: 8081,
    devBaseUrl: 'http://local.colabedu.org:8081',
    demoBaseUrl: (tenant?: string) => `https://api.${tenant || 'intef'}.demo.colabedu.net`,
    prodBaseUrl: 'https://api.colabedu.org',
    description: 'Backend Spring Boot / SpecManager / Grading V2 REST API',
  },
};

/**
 * Obtiene el entorno activo del sistema (local, demo o prod).
 * Prioriza variables de entorno públicas y realiza autodetección
 * por hostname si se ejecuta en el navegador.
 */
export function getAppEnvironment(): ColabEduEnv {
  const envVars = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as Record<string, string | undefined>) : {};
  const explicit = envVars.PUBLIC_COLABEDU_ENV || envVars.PUBLIC_ENV;
  if (explicit) {
    const norm = explicit.trim().toLowerCase();
    if (norm === 'local' || norm === 'dev' || norm === 'development') return 'local';
    if (norm === 'demo' || norm === 'staging' || norm === 'stage' || norm === 'preview') return 'demo';
    if (norm === 'prod' || norm === 'production') return 'prod';
  }

  // Detección en navegador en tiempo de ejecución
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.includes('local.colabedu.org')
    ) {
      return 'local';
    }
    if (
      host.includes('.demo.colabedu.net') ||
      host.includes('-demo.web.app') ||
      host.includes('-demo.firebaseapp.com')
    ) {
      return 'demo';
    }
    if (host.includes('colabedu.org') || host.includes('colabedu.net') || host.includes('colabedu.ai')) {
      return 'prod';
    }
  }

  // Fallback para SSG / compilación según flag DEV de Astro/Vite
  const isDev = typeof import.meta !== 'undefined' && import.meta.env ? Boolean(import.meta.env.DEV) : false;
  return isDev ? 'local' : 'prod';
}

/**
 * Obtiene el tenant activo para entornos demo (por defecto: 'intef').
 */
export function getAppTenant(): string {
  const envVars = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as Record<string, string | undefined>) : {};
  if (envVars.PUBLIC_TENANT && envVars.PUBLIC_TENANT.trim().length > 0) {
    return envVars.PUBLIC_TENANT.trim().toLowerCase();
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname.toLowerCase();
    // 1. Dominio personalizado: app.<tenant>.demo.colabedu.net o <tenant>.demo.colabedu.net
    const customMatch = host.match(/^(?:app\.)?([a-z0-9-]+)\.demo\.colabedu\.net$/);
    if (customMatch && customMatch[1]) {
      return customMatch[1];
    }
    // 2. Firebase Hosting: colabedu-<tenant>-demo.web.app
    const fbMatch = host.match(/^colabedu-([a-z0-9-]+)-demo\.(?:web\.app|firebaseapp\.com)$/);
    if (fbMatch && fbMatch[1]) {
      return fbMatch[1];
    }
  }

  return 'intef';
}

/**
 * Obtiene la URL base de una aplicación de forma agnóstica al entorno.
 * Consulta primero las variables de entorno PUBLIC_*_URL y aplica
 * la resolución canónica según el entorno (local, demo, prod).
 */
export function getAppBaseUrl(target: AppTarget, options?: AppBaseUrlOptions): string {
  const envVars = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as Record<string, string | undefined>) : {};

  // 1. Precedencia absoluta: variable de entorno explícita para la app
  const envKeyMap: Record<AppTarget, string | undefined> = {
    org: envVars.PUBLIC_ORG_URL,
    catalog: envVars.PUBLIC_CATALOG_URL,
    net: envVars.PUBLIC_NET_URL,
    support: envVars.PUBLIC_SUPPORT_URL,
    app: envVars.PUBLIC_APP_URL || envVars.PUBLIC_COLABEDU_APP_URL,
    api: envVars.PUBLIC_API_URL || envVars.PUBLIC_EDU_API_URL,
  };

  const configured = envKeyMap[target];
  let resolved = '';
  if (configured && configured.trim().length > 0) {
    resolved = configured.trim();
  } else {
    // 2. Resolución de entorno activo y tenant
    const activeEnv = options?.env || getAppEnvironment();
    const activeTenant = options?.tenant || getAppTenant();
    const appMeta = APP_REGISTRY[target];

    if (activeEnv === 'local') {
      resolved = appMeta.devBaseUrl;
    } else if (activeEnv === 'demo') {
      const demoBase = appMeta.demoBaseUrl;
      resolved = typeof demoBase === 'function' ? demoBase(activeTenant) : demoBase;
    } else {
      resolved = appMeta.prodBaseUrl;
    }
  }

  // 3. Adaptación dinámica para Tailscale / LAN en navegador:
  // Si el usuario accede a la web desde local.colabedu.org, una IP o host de Tailscale,
  // asegurar que cualquier URL 'localhost' o '127.0.0.1' apunte al host activo (local.colabedu.org).
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      if (resolved.includes('localhost')) {
        resolved = resolved.replaceAll('localhost', currentHost);
      } else if (resolved.includes('127.0.0.1')) {
        resolved = resolved.replaceAll('127.0.0.1', currentHost);
      }
    }
  }

  return resolved;
}

/**
 * Construye una URL hacia una ruta dentro de la aplicación destino.
 * Soporta parámetros de consulta (querystring), opciones de entorno y normaliza barras.
 */
export function appLink(
  target: AppTarget,
  path: string = '',
  params?: Record<string, string | number | boolean | undefined | null>,
  options?: AppBaseUrlOptions
): string {
  const base = getAppBaseUrl(target, options).replace(/\/$/, '');
  let cleanPath = path.trim();

  // En la aplicación Flutter Web, soportar tanto URLs de ruta limpia (Path URL Strategy) como hash routing
  if (target === 'app') {
    // Si la ruta ya tiene formato de ruta limpia con barra o hash, normalizar respetando el modo
    if (cleanPath.startsWith('#') || cleanPath.startsWith('/#')) {
      cleanPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    } else {
      if (!cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
      }
      // Si explícitamente se pide hash por flag o entorno, se puede inyectar; de lo contrario usar ruta limpia nativa
      const forceHash = typeof import.meta !== 'undefined' && (import.meta.env?.PUBLIC_FLUTTER_HASH_ROUTING === 'true');
      if (forceHash) {
        cleanPath = `/#${cleanPath}`;
      }
    }
  } else {
    if (cleanPath.length > 0 && !cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`;
    }
  }

  let finalUrl = `${base}${cleanPath}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        searchParams.append(k, String(v));
      }
    }
    const qs = searchParams.toString();
    if (qs.length > 0) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
    }
  }

  return finalUrl;
}
