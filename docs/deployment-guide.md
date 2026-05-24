# Guía de Despliegue de ColabEdu Web (`ce-web`)

El ecosistema de portales de marketing de ColabEdu (Astro) utiliza **Skaffold** en combinación con **Firebase Hosting** para gestionar el ciclo de vida de desarrollo local y los despliegues a la nube. Esta guía documenta los flujos de trabajo principales.

## Requisitos Previos
1. **Node.js y pnpm** instalados.
2. **Skaffold** (versión `v2.19` o superior recomendada, soporte para `v4beta13`).
3. **Firebase CLI** (`npm install -g firebase-tools`).
4. Autenticación en Firebase: Asegúrate de tener permisos ejecutando `firebase login`.

## 1. Desarrollo Local (Nativo)

El desarrollo local de los portales se realiza directamente en el sistema operativo anfitrión, sin utilizar contenedores Docker ni MicroK8s. Skaffold utiliza los *Deploy Hooks* para orquestar la ejecución de los scripts de Node.

### Levantar Todos los Portales
Para arrancar el servidor de desarrollo en caliente para **todos los portales** simultáneamente (`colabedu-net`, `colabedu-org`, y subportales de soporte):

```bash
cd ce-web

# Método 1: Usando Skaffold (Recomendado)
skaffold run -p local-all

# Método 2: Usando pnpm directamente
pnpm run dev:all
```

**¿Cómo visualizarlo?**
Al ejecutar este comando, Astro asignará puertos consecutivos. Podrás ver los portales en tu navegador abriendo las siguientes URLs:
* `http://localhost:4321` (Normalmente el primer portal en levantar, ej. colabedu.net)
* `http://localhost:4322` (Segundo portal, ej. colabedu.org)
* `http://localhost:4323` (Portal de soporte)

*(Nota: Mientras este comando esté corriendo en tu terminal, cualquier cambio que hagas en el código fuente (Astro, CSS) se reflejará instantáneamente en tu navegador gracias al Hot Reload).*

### Levantar Portales Individuales
Si solo necesitas trabajar en un portal específico, puedes usar los perfiles individuales de Skaffold para levantar únicamente ese proceso:

* **Marketing comercial (.net):** `skaffold run -p local-net`
* **Marketing open/partners (.org):** `skaffold run -p local-org`
* **Portal de soporte:** `skaffold run -p local-support`

*(Nota: En modo local, Astro reconstruirá dinámicamente las páginas al guardar cambios).*

## 2. Despliegues en Firebase Hosting (Nube)

La infraestructura en la nube para el frontend se basa en **Firebase Hosting (Multisite)**. Skaffold orquesta el empaquetado (Build) y el envío a los servidores de la CDN de Google.

Los proyectos de destino están mapeados en el archivo `.firebaserc`:
* Entorno **Demo**: `colabedu-demo`
* Entorno **Stage**: `colabedu-stage`
* Entorno **Producción**: `colabedu-prod`

### Pasos Generales para Desplegar

Skaffold ejecuta automáticamente los siguientes pasos:
1. `pnpm run build` para generar los estáticos optimizados en `dist/`.
2. `firebase deploy --only hosting -P <entorno>` para sincronizar los archivos estáticos a los alias de Firebase correspondientes configurados en `firebase.json`.

#### Desplegar a DEMO
Ideal para mostrar avances a stakeholders internos o pruebas finales antes de staging.
```bash
cd ce-web
skaffold run -p firebase-demo
```
**¿Cómo visualizarlo en la nube?**
Al terminar la ejecución, la consola de Firebase te imprimirá la URL pública generada. Por ejemplo:
`Hosting URL: https://colabedu-demo.web.app`
Solo tienes que hacer clic en esa URL para acceder al sitio público.

#### Desplegar a STAGE
Entorno de pre-producción exacto a producción para realizar QA.
```bash
cd ce-web
skaffold run -p firebase-stage
```

#### Desplegar a PRODUCCIÓN
Despliega la versión final comercial orientada a los dominios principales.
```bash
cd ce-web
skaffold run -p firebase-prod
```

## Solución de Problemas Frecuentes
* **Error de permisos en Firebase:** Si el hook de Firebase falla, verifica que tengas acceso a los proyectos de GCP/Firebase ejecutando `firebase projects:list`.
* **Problemas de versión de Skaffold:** Si ves errores de `hooks not found in type...`, asegúrate de utilizar un Skaffold que soporte la API `skaffold/v4beta13`.
* **Archivos desactualizados en producción:** Recuerda que Firebase tiene caché de CDN. Verifica las políticas de Headers en `firebase.json` si los JS/CSS no se refrescan tras un despliegue exitoso.
