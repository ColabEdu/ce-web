# Tutorial: Curator y CLI en ColabEdu (colabedu.org)

Bienvenido a la guía oficial sobre cómo utilizar el CLI (`ce-cli.sh`) y las herramientas del Agente Curador Autónomo (ACA) en ColabEdu. Esta guía explica cómo orquestar el descubrimiento de fuentes OER, la certificación de calidad forense con LLM-as-a-Judge, la verificación normativa y la auditoría de preparación de cursos (L0 a L5).

---

## 1. Introducción al Ecosistema de Comandos CLI

El pipeline curricular de ColabEdu se orquesta a través del script `./ce-cli.sh` (basado en `ce-svc-cli`). Proporciona dos modos operativos:
1. **Comandos Directos de Auditoría y Descubrimiento** (`oer`, `normative`, `course readiness`).
2. **Pipelines Declarativos por Lotes** (`spec batch run`, `aca plan`).

### Resumen de Comandos Principales de `ce-cli.sh`:
- **`oer discover`**: Ejecuta el descubrimiento semántico híbrido federado en OpenStax, LibreTexts, Minnesota OTL y catálogos abiertos.
- **`oer evaluate`**: Audita un candidato OER con la rúbrica de 100 puntos y veto automático contra escaneos raster.
- **`normative bootstrap`**: Descarga, valida y registra los marcos jurídicos y normativos oficiales (BOE, CDE, LOMLOE) con huella SHA-256.
- **`course readiness`**: Radar de preparación pedagógica que evalúa el estado de las 6 capas (L0 a L5) antes del ensamblaje.
- **`spec batch run`**: Ejecuta el ciclo por lotes declarativo (`discover`, `fetch`, `parse`, `validate`, `compose_bundle`, `ingest`).

---

## 2. Comandos Esenciales de Verificación y Descubrimiento

### 2.1 Descubrimiento Semántico de OERs (`oer discover`)
Permite rastrear fuentes canónicas abiertas según materia, estándar y palabras clave:

```bash
# Descubrimiento de OERs para California World Languages
./ce-cli.sh oer discover \
  --subject="Spanish" \
  --framework="California WLS / ACTFL" \
  --query="Beginning Spanish Middle School Novice"

# Descubrimiento para EBAU / Selectividad España
./ce-cli.sh oer discover \
  --subject="Lengua Castellana y Literatura" \
  --framework="LOMLOE / EBAU" \
  --query="Comentario de texto sintaxis oracion compleja bachillerato"
```

### 2.2 Auditoría y Certificación Forense (`oer evaluate`)
Aplica el juez multimodal LLM-as-a-Judge contra un candidato OER registrado:

```bash
# Evaluar el OER de Minnesota para Spanish Novice
./ce-cli.sh oer evaluate --candidate-id="cand-umn-beginning-spanish"

# Evaluar libros OER de Marea Verde para ESO / Bachillerato
./ce-cli.sh oer evaluate --candidate-id="cand-marea-verde-lcl-1eso"
./ce-cli.sh oer evaluate --candidate-id="cand-marea-verde-lcl-2bach"
```
*Criterios evaluados*: Cobertura curricular (35%), Calidad visual/vectorial (25%), Autoridad institucional (20%), Licencia abierta (20%). Si el recurso es un escaneo plano sin texto estructurado, recibe un **veto inmediato (0 pts)**.

### 2.3 Registro y Verificación Normativa (`normative bootstrap`)
Garantiza el anclaje legal (L0) con hashes criptográficos inmutables:

```bash
# Descargar y auditar marcos de España (LOMLOE y RD 534/2024 EBAU)
./ce-cli.sh normative bootstrap --jurisdiction="loc.es" --standard="std.es.lomloe"

# Descargar y auditar marcos de California (CDE WLS 2019/2020)
./ce-cli.sh normative bootstrap --jurisdiction="loc.us.ca" --standard="std.us.ca.wls"
```

### 2.4 Radar de Preparación de Cursos (`course readiness`)
Audita si un curso cuenta con las 6 capas fundamentales listas antes de generar lecciones:

```bash
# Verificar California Middle School
./ce-cli.sh course readiness --standard="std.us.ca.wl" --level="MS" --country="us"

# Verificar ESO España (RD 217/2022)
./ce-cli.sh course readiness --standard="std.es.lomloe" --level="ESO" --country="es"

# Verificar Bachillerato / EBAU España
./ce-cli.sh course readiness --standard="std.es.ebau" --level="BACH" --country="es"
```

---

## 3. Ejecución de Pipelines Declarativos por Lotes (`spec batch run`)

Para procesar transformaciones masivas, se utilizan manifiestos YAML en `ce-specs/batches/`:

```bash
# Ejecutar pipeline completo
./ce-cli.sh spec batch run --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml

# Reanudar desde una etapa específica (ej. validación pedagógica)
./ce-cli.sh spec batch run \
  --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml \
  --from validate \
  --overwrite false
```

### Estructura de un Archivo Batch:
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

discover:
  types: [open_books, exams]
  keywords:
    - "AP Spanish Language exam prep practice"
  maxResults: 50

validate:
  syntacticCheck: true
  pedagogicalAudit: true
  minimumScore: 8.0
```

---

## 4. Retomar Estados y Recuperación de Fallos

- El CLI persiste automáticamente el progreso en `.ce-batch-state.json`.
- Si un lote falla en una etapa intermedia, corrígelo y ejecuta añadiendo `--from <etapa>` (`discover`, `fetch`, `parse`, `validate`, `compose_bundle`, `ingest`).
- Las lecciones que no superen el `minimumScore` pedagógico son marcadas como `.invalid` para evitar su propagación al LMS.

---
- Para la referencia completa de todos los dominios del CLI (Grading V2, LMS, Org, Billing, Testing), consulta: [`cli-complete-reference-es.md`](file:///home/jmolmo/git/colabedu/ce-web/docs/cli-complete-reference-es.md).
- Para la arquitectura del Agente Curador y descubrimiento OER, consulta: [`guia_usuario_aca_descubrimiento_oer_ensamblado.md`](file:///home/jmolmo/git/colabedu/ce-docs/guia_usuario_aca_descubrimiento_oer_ensamblado.md).
