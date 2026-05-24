# Estrategia de Despliegue de Frontends: Firebase vs Kubernetes

Este documento detalla el cambio arquitectónico adoptado para el despliegue de los frontends del ecosistema ColabEdu (webs de marketing y la app Flutter `ib_conversations`).

## Decisión Arquitectónica
**Ya NO desplegaremos los frontends en los namespaces de Kubernetes (MicroK8s)** para los entornos remotos (`demo`, `stage`, `prod`). En su lugar, hemos adoptado **Firebase Hosting** como la plataforma estándar para el servicio de todas las interfaces de usuario.

Con el cambio estratégico hacia Firebase Hosting, la arquitectura se define de la siguiente manera:

### Arquitectura Anterior (Enfoque 100% Kubernetes)
* Las webs (Astro) y la app (Flutter) se compilaban.
* Se empaquetaban dentro de imágenes Docker (generalmente como contenedores Nginx).
* Esos contenedores se desplegaban en los distintos namespaces del clúster Kubernetes local/MicroK8s (`demo`, `stage`, `prod`).
* **Desventaja:** Consumían memoria RAM y CPU en el servidor constantemente, requiriendo mantenimiento y configuración de balanceadores de carga y certificados.

### Nueva Arquitectura Híbrida (Frontends en Firebase + Backend en K8s/Cloud Run)
* **Frontend:** Skaffold orquesta la compilación de las webs y la app Flutter para generar únicamente los archivos estáticos (HTML, JS, CSS, WASM).
* En lugar de empaquetarlos en Docker, los activos estáticos se suben directamente a la CDN global de Google (**Firebase Hosting**).
* **Backend:** El API Java (Spring Boot), Redis, PostgreSQL y los servicios de LLM **SÍ continuarán desplegándose en los namespaces de Kubernetes** (durante la fase transicional) y posteriormente en Google Cloud Run.

## Ventajas para el Ecosistema ColabEdu

1. **Rendimiento Insuperable (Edge CDN):** Las webs y la SPA de Flutter estarán alojadas en los servidores "Edge" de Google repartidos por todo el mundo, cargando casi instantáneamente para los usuarios, partners y colegios, sin importar su ubicación geográfica.
2. **Cero Mantenimiento y Escalabilidad Infinita:** Al ser estáticos en una CDN, desaparece la necesidad de gestionar contenedores Nginx, reiniciar Pods o monitorizar el consumo de RAM del frontend. Firebase Hosting escala a millones de visitas automáticamente.
3. **Liberación de Recursos en MicroK8s:** Al externalizar el tráfico web, se libera una cantidad significativa de memoria y CPU en la estación de trabajo/clúster. El servidor local ahora puede dedicar el 100% de su potencia computacional a la ejecución del Backend Java, bases de datos y la inferencia de Inteligencia Artificial.
4. **SSL y Gestión de Dominios Nativa:** El mapeo de los dominios `colabedu.org` (transicional) y `colabedu.net` (comercial final) junto con sus certificados HTTPS automáticos es nativo en Firebase Hosting, simplificando drásticamente el enrutamiento que antes dependía de Ingress Controllers.

## Implementación en CI/CD y Skaffold
Los archivos `skaffold.yaml` de `ce-web` e `ib_conversations` han sido actualizados con perfiles específicos (`firebase-demo`, `firebase-stage`, `firebase-prod`). Estos perfiles configuran Skaffold para omitir el empaquetado en contenedores y la orquestación en Kubernetes, ejecutando en su lugar comandos nativos (`flutter build web`, `pnpm run build`) seguidos de la subida a Firebase (`firebase deploy --only hosting`).
