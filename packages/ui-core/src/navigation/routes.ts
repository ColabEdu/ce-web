/**
 * ColabEdu Multi-App Navigation & Routing Helper
 *
 * Resolves canonical inter-app URLs transparently across:
 * - Local development (different ports / local proxies)
 * - Staging (preview domains)
 * - Production (canonical sovereign domains)
 */

export type AppTarget = 'org' | 'catalog' | 'net' | 'support' | 'app' | 'api';

export interface AppConfigMeta {
  target: AppTarget;
  name: string;
  devPort: number;
  devBaseUrl: string;
  prodBaseUrl: string;
  description: string;
}

export const APP_REGISTRY: Record<AppTarget, AppConfigMeta> = {
  org: {
    target: 'org',
    name: 'ColabEdu.org',
    devPort: 4321,
    devBaseUrl: 'http://localhost:4321',
    prodBaseUrl: 'https://colabedu.org',
    description: 'Landing institucional, Especificaciones OPS y Laboratorio de Demos',
  },
  catalog: {
    target: 'catalog',
    name: 'Catálogo Curricular OPS',
    devPort: 4323,
    devBaseUrl: 'http://localhost:4321/catalog', // Acceso preferido vía proxy en dev
    prodBaseUrl: 'https://colabedu.org/catalog',
    description: 'Catálogo Curricular Soberano SSG y lecciones interactivas',
  },
  net: {
    target: 'net',
    name: 'ColabEdu.net LMS',
    devPort: 8082,
    devBaseUrl: 'http://localhost:8082',
    prodBaseUrl: 'https://colabedu.net',
    description: 'Plataforma web LMS, matriculación y gestión de cursos',
  },
  support: {
    target: 'support',
    name: 'Soporte y Ayuda',
    devPort: 4322,
    devBaseUrl: 'http://localhost:4322',
    prodBaseUrl: 'https://support.colabedu.org',
    description: 'Centro de ayuda, guías docentes y tickets de soporte',
  },
  app: {
    target: 'app',
    name: 'ColabEdu Interactive App (Flutter Web)',
    devPort: 8080,
    devBaseUrl: 'http://localhost:8080',
    prodBaseUrl: 'https://app.colabedu.org',
    description: 'Motor de ejecución Flutter Web A2UI y tutor socrático',
  },
  api: {
    target: 'api',
    name: 'ColabEdu Backend Services',
    devPort: 8081,
    devBaseUrl: 'http://localhost:8081',
    prodBaseUrl: 'https://api.colabedu.org',
    description: 'Backend Spring Boot / SpecManager / Grading V2 REST API',
  },
};

/**
 * Obtiene la URL base de una aplicación de forma agnóstica al entorno.
 * Consulta primero las variables de entorno PUBLIC_*_URL y aplica
 * los fallbacks canónicos de desarrollo o producción.
 */
export function getAppBaseUrl(target: AppTarget): string {
  const isDev = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.DEV : true;
  const env = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env as Record<string, string | undefined>) : {};

  const envKeyMap: Record<AppTarget, string | undefined> = {
    org: env.PUBLIC_ORG_URL,
    catalog: env.PUBLIC_CATALOG_URL,
    net: env.PUBLIC_NET_URL,
    support: env.PUBLIC_SUPPORT_URL,
    app: env.PUBLIC_APP_URL || env.PUBLIC_COLABEDU_APP_URL,
    api: env.PUBLIC_API_URL || env.PUBLIC_EDU_API_URL,
  };

  const configured = envKeyMap[target];
  if (configured && configured.trim().length > 0) {
    return configured.trim();
  }

  const appMeta = APP_REGISTRY[target];
  return isDev ? appMeta.devBaseUrl : appMeta.prodBaseUrl;
}

/**
 * Construye una URL hacia una ruta dentro de la aplicación destino.
 * Soporta parámetros de consulta (querystring) y normaliza barras.
 */
export function appLink(
  target: AppTarget,
  path: string = '',
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const base = getAppBaseUrl(target).replace(/\/$/, '');
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
