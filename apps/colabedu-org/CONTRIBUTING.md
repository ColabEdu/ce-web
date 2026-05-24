---
title: Embebidos (Iframes, Demos y Slides)
description: Guía para insertar contenido externo y demostraciones interactivas en la documentación de ColabEdu.
---

import FlutterDemo from '../../../../components/FlutterDemo.astro';
import GoogleSlides from '../../../../components/GoogleSlides.astro';

Dado que la documentación de ColabEdu se basa en MDX (Astro + Starlight), es completamente compatible con etiquetas HTML interactivas, como los `iframes`. 

Para mantener la consistencia visual y facilitar el mantenimiento, hemos creado una serie de componentes nativos de Astro que puedes importar y utilizar en cualquier página de la documentación.

## 1. Demos de la App en Flutter (`<FlutterDemo />`)

El componente `FlutterDemo` permite incrustar de manera segura e integrada flujos completos de la aplicación B2B/B2C (como *Grading V2*, la creación de ejercicios, etc.) directamente en la documentación, para que el usuario pueda interactuar con ellos sin abandonar la lectura.

### ¿Cómo usarlo?

1. Al inicio de tu archivo `.mdx`, importa el componente:
```mdx
import FlutterDemo from '../../../../components/FlutterDemo.astro';
```

2. En el lugar del documento donde quieras el embebido, utiliza el componente pasando los parámetros necesarios:
```mdx
<FlutterDemo 
  route="/demo/grading-v2" 
  height="600px" 
  authMode="static" 
/>
```

### Propiedades disponibles (Props)

| Propiedad | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `route` | `string` | **Requerido** | La ruta de la aplicación a mostrar (ej. `/demo/grading-v2`). |
| `height` | `string` | `600px` | Altura del iframe. |
| `authMode`| `string` | `none` | Si se pasa `static`, inyecta el token de demo (`?token=demo_auth_readonly_123`) a la URL. |
| `appBaseUrl`| `string` | `https://app.colabedu.net` | La URL base. Modificable para entornos de *staging*. |

---

## 2. Presentaciones de Google Slides (`<GoogleSlides />`)

Si se necesita presentar un material visual (como arquitecturas o flujos de producto diseñados en diapositivas), puedes incrustar un Google Slide para evitar tener que subir y actualizar capturas de pantalla manualmente.

### ¿Cómo usarlo?

1. Al inicio de tu archivo `.mdx`, importa el componente:
```mdx
import GoogleSlides from '../../../../components/GoogleSlides.astro';
```

2. Ve a Google Slides > Archivo > Compartir > Publicar en la web > Incorporar, y copia el enlace (`src`) del iframe generado.

3. Pégalo en el componente:
```mdx
<GoogleSlides 
  src="https://docs.google.com/presentation/d/e/tu_id_aqui/embed?start=false&loop=false&delayms=3000" 
/>
```

---

## 3. Iframes Genéricos (Vía Directa)

Si necesitas incrustar un recurso temporal o algo que no requiera estilos corporativos, siempre puedes utilizar etiquetas `<iframe>` nativas directamente en el Markdown:

```html
<iframe src="https://example.com" width="100%" height="500"></iframe>
```

> **Consejo:** Intenta usar los componentes predefinidos de Astro siempre que sea posible para garantizar que los bordes, márgenes y la compatibilidad con el modo oscuro (Dark Mode) del portal se mantengan intactos.
