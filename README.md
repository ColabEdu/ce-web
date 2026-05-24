# ColabEdu Web (ce-web)

Este monorepo contiene los sitios web estáticos (SSG) basados en Astro para la plataforma ColabEdu.
Se compone de dos proyectos principales:
- `colabedu-org`: El sitio web principal / documentación abierta (usando Starlight).
- `colabedu-ai`: La landing / sitio comercial de AI.

## 🚀 Entorno de Desarrollo Local

El proyecto usa `pnpm` y está configurado como un workspace.

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Arrancar servidores de desarrollo**:
   - Para el sitio web principal (Org/Docs):
     ```bash
     pnpm run dev:org
     ```
   - Para el sitio web de AI:
     ```bash
     pnpm run dev:ai
     ```

## ☁️ Despliegue en Firebase Hosting

La infraestructura de `ce-web` está preconfigurada para servir estos sitios ultrarrápidamente a través del CDN global de Firebase Hosting.

### Configuración inicial (Solo la primera vez)
Para vincular los targets (los nombres de los sitios en la configuración) a tu proyecto de Firebase, ejecuta:
```bash
firebase target:apply hosting colabedu-org <tu-firebase-project-id>
firebase target:apply hosting colabedu-ai <tu-firebase-project-id>
```

### Despliegue Manual
1. Compila los sitios a su versión estática:
   ```bash
   pnpm build
   ```
2. Sube a los servidores de Firebase:
   ```bash
   firebase deploy --only hosting
   ```
   *(También puedes desplegar un solo sitio haciendo `firebase deploy --only hosting:colabedu-org`)*

### CI/CD
Se ha configurado un workflow en GitHub Actions (`.github/workflows/deploy-ce-web.yml`) que generará entornos de Preview para cada Pull Request y publicará al canal Live cuando se mergeen cambios a la rama `main`.
Asegúrate de configurar los secretos `FIREBASE_SERVICE_ACCOUNT` correspondientes en GitHub.
