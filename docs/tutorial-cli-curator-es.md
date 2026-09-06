# Tutorial: Curator y CLI en ColabEdu

Bienvenido al tutorial paso a paso sobre cómo utilizar el CLI y las herramientas de Curación en ColabEdu. Esta guía te enseñará cómo orquestar batches de generación de contenido, integrando búsqueda en la web, parseo, y la nueva validación pedagógica automatizada.

## 1. Introducción al Ecosistema

El proceso de curación en ColabEdu se basa en la automatización de flujos de trabajo (pipelines) usando archivos YAML (`Batches`). El motor principal se ejecuta a través del `ce-svc-cli`. 

Las operaciones principales que puedes orquestar son:
- **`discover`**: Busca fuentes en internet basadas en criterios pedagógicos.
- **`fetch`**: Descarga los documentos y los cachea localmente.
- **`parse`**: Convierte documentos sin formato a especificaciones curriculares estructuradas (OAS YAML).
- **`validate`**: (¡Nuevo!) Verifica la estructura YAML y audita pedagógicamente el contenido generado utilizando LangChain4j y Gemini.
- **`compose_bundle`**: Ensambla las unidades curriculares individuales en cursos completos.
- **`classify`** e **`ingest`**: Taxonomía y almacenamiento en la base de datos de producción.

## 2. Ejecutar tu primer Batch

Para iniciar un flujo de trabajo, crea o selecciona un archivo YAML dentro de la carpeta `ce-specs/batches/`. Por ejemplo:

```bash
# Navega al directorio del CLI
cd ce-svc-parent/ce-svc-cli

# Ejecuta un batch de descubrimiento y generación
java -jar target/ce-svc-cli-0.7.3.jar spec batch run --batch ../../ce-specs/batches/ap-spanish-intensive-discovery.yaml
```

## 3. Ejemplo de Archivo Batch con Validación

El archivo YAML define el pipeline. A continuación se muestra un ejemplo con la fase `validate` integrada:

```yaml
batch:
  id: ap-spanish-intensive-discovery
  name: "AP Spanish Language — Intensive Discovery & Generate"

context:
  standard: AP_SPANISH
  locale: es
  subject: spanish_language_and_culture
  level: "HL"

# Orden de las etapas del pipeline
operations: [discover, fetch, parse, validate, compose_bundle]

# Configuración de búsqueda en internet
discover:
  types: [open_books, exams]
  keywords:
    - "AP Spanish Language exam prep practice"
  maxResults: 50

# Configuración del auditor pedagógico
validate:
  syntacticCheck: true
  pedagogicalAudit: true
  minimumScore: 8.0
```

## 4. Retomar desde una etapa anterior

A veces la web falla o una fase de `parse` se interrumpe. El CLI guarda el progreso en `.ce-batch-state.json`. Puedes continuar el proceso usando el argumento `--from`:

```bash
# Si el batch falló en 'validate', corrígelo y continúa desde esa etapa
java -jar target/ce-svc-cli-0.7.3.jar spec batch run --batch ../../ce-specs/batches/ap-spanish-intensive-discovery.yaml --from validate
```

## 5. Validación Pedagógica (`validate`)

La fase de validación rechaza automáticamente cualquier lección generada que no cumpla con un nivel mínimo de calidad pedagógica (`minimumScore`).

- Utiliza un **System Prompt** de "Auditor Pedagógico".
- Verifica el tono, alineación curricular, y evita "alucinaciones".
- Archivos que obtengan un *score* por debajo del límite serán renombrados a `.invalid` y excluidos de la fase de empaquetado (`compose_bundle`).

---
¡Gracias por contribuir a la automatización curricular de ColabEdu!
