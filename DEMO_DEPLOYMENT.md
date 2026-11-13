# Guía de Despliegue de Portales Web (`ce-web` y `colabedu-catalog`) en Entornos Demo Aislados (Multi-Tenant)

Este documento describe el procedimiento canónico para compilar y publicar todas las aplicaciones web del monorepo `ce-web` (`colabedu-net`, `colabedu-org`, `colabedu-catalog`, `colabedu-support`, `colabedu-ai`) en un entorno **Demo** (por ejemplo, para el tenant `intef` o pruebas de catálogo) **totalmente aislado del entorno de Producción**.

De este modo, los dominios públicos de producción (`colabedu.net`, `colabedu.org`, `support.colabedu.net`, `app.colabedu.org`) permanecen intactos mientras se validan cambios o se realizan demostraciones institucionales.

---

## 1. Matriz de URLs del Entorno Demo vs. Producción

Según la configuración en `ce-web/.firebaserc` y el sistema de enrutamiento `ce-web/packages/ui-core/src/navigation/routes.ts`, el entorno Demo utiliza el proyecto de Firebase **`colabedu-demo`** (separado de `colabedu-prod`) y resuelve automáticamente todos los enlaces transversales hacia el tenant configurado (p. ej. `intef`):

| Aplicación | Site ID en Firebase (`colabedu-demo`) | URL en Entorno Demo (Aislada de Prod) | URL de Producción (Intacta) |
| :--- | :--- | :--- | :--- |
| **Portal Comercial (`colabedu-net`)** | `colabedu-net-demo` | **`https://colabedu-net-demo.web.app`** | `https://colabedu.net` |
| **Portal Open Source (`colabedu-org`)** | `colabedu-org-demo` | **`https://colabedu-org-demo.web.app`** | `https://colabedu.org` |
| **Catálogo SSG (`colabedu-catalog`)** | *(Integrado en `colabedu-org-demo`)* | **`https://colabedu-org-demo.web.app/catalog`** | `https://colabedu.org/catalog` |
| **Centro de Soporte (`colabedu-support`)** | `colabedu-support-demo` | **`https://colabedu-support-demo.web.app`** | `https://support.colabedu.net` |
| **Portal IA (`colabedu-ai`)** | `colabedu-ai-demo` | **`https://colabedu-ai-demo.web.app`** | `https://colabedu.ai` |
| **App Interactiva Flutter (`ib_conversations`)** | `colabedu-intef-demo` | **`https://app.intef.demo.colabedu.net`** <br>*(o `https://colabedu-intef-demo.web.app`)* | `https://app.colabedu.org` / `.net` |
| **Backend API (`ce-svc-parent`)** | *(Cluster K8s / Cloud)* | **`https://api.intef.demo.colabedu.net`** | `https://api.colabedu.org` |

### Enrutamiento Dinámico (`appLink`)
Cuando las aplicaciones de `ce-web` se compilan con `PUBLIC_COLABEDU_ENV=demo` y `PUBLIC_TENANT=intef` (o cuando se abren en un navegador bajo un dominio `*-demo.web.app`), el helper `appLink()` de `@colabedu/ui-core/navigation` dirige automáticamente todos los botones de *"Entrar a la App"*, *"Explorar Catálogo OER"* y *"Probar lección interactiva"* hacia las instancias Demo (`https://app.intef.demo.colabedu.net` y `https://colabedu-org-demo.web.app/catalog`), sin cruzar tráfico con Producción.

---

## 2. Procedimiento de Despliegue Paso a Paso

### Opción A: Despliegue Completo de Todos los Portales (`ce-web` + `colabedu-catalog`) en Demo

Para compilar y publicar todos los portales web apuntando al tenant `intef` en el proyecto `colabedu-demo`:

```bash
# 1. Compilar todas las aplicaciones del monorepo con variables de entorno DEMO e INTEF
cd /home/jmolmo/git/colabedu/ce-web
PUBLIC_COLABEDU_ENV=demo PUBLIC_TENANT=intef pnpm run build

# 2. Integrar el build estático del catálogo dentro del bundle de colabedu-org (/catalog)
mkdir -p apps/colabedu-org/dist/catalog
cp -r apps/colabedu-catalog/dist/* apps/colabedu-org/dist/catalog/

# 3. Publicar EXCLUSIVAMENTE en el proyecto Firebase de DEMO (-P demo)
firebase deploy --only hosting -P demo
```

> **Alternativa con Skaffold**: También está configurado el perfil `firebase-demo` en `ce-web/skaffold.yaml`:
> ```bash
> cd /home/jmolmo/git/colabedu/ce-web
> PUBLIC_COLABEDU_ENV=demo PUBLIC_TENANT=intef skaffold run -p firebase-demo
> ```

---

### Opción B: Actualizar Únicamente el Catálogo SSG (`colabedu-catalog`) en Demo

Si solo se han modificado especificaciones curriculares en `ce-specs` o la interfaz del catálogo:

```bash
cd /home/jmolmo/git/colabedu
./ce-cli.sh catalog publish --env=demo --tenant=intef
```

Este comando ejecuta `ce-specs/scripts/publish_catalog_seo.sh`, compilando `colabedu-catalog` con `PUBLIC_COLABEDU_ENV=demo` y `PUBLIC_TENANT=intef`, sincronizando los artefactos en `apps/colabedu-org/dist/catalog` y desplegando el sitio `colabedu-org-demo`.

---

### Opción C: Canales de Previsualización Efímeros (Preview Channels)

Si se desea generar una URL temporal privada (con caducidad automática) sin sobreescribir el entorno `demo` principal:

```bash
cd /home/jmolmo/git/colabedu/ce-web
PUBLIC_COLABEDU_ENV=demo PUBLIC_TENANT=intef pnpm run build
mkdir -p apps/colabedu-org/dist/catalog
cp -r apps/colabedu-catalog/dist/* apps/colabedu-org/dist/catalog/

firebase hosting:channel:deploy preview-intef --expires 7d -P demo
```

Firebase Hosting generará URLs dedicadas con el formato `https://colabedu-net-demo--preview-intef-<hash>.web.app`.
