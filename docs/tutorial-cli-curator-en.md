# Tutorial: Curator and CLI in ColabEdu (colabedu.org)

Welcome to the official step-by-step guide on using the CLI (`ce-cli.sh`) and Autonomous Curator Agent (ACA) tools in ColabEdu. This guide explains how to orchestrate OER source discovery, forensic quality certification with LLM-as-a-Judge, normative legal framework grounding, and course readiness auditing (L0 to L5).

---

## 1. Introduction to the CLI Command Ecosystem

The ColabEdu curriculum pipeline is driven through `./ce-cli.sh` (backed by `ce-svc-cli`). It supports two primary modes:
1. **Direct Audit & Discovery Commands** (`oer`, `normative`, `course readiness`).
2. **Declarative Batch Pipelines** (`spec batch run`, `aca plan`).

### Key Commands Summary:
- **`oer discover`**: Performs hybrid federated semantic discovery across OpenStax, LibreTexts, Minnesota Open Textbook Library, and public repositories.
- **`oer evaluate`**: Audits an OER candidate against the 100-point rubric with an automatic veto for raster/photocopy scans.
- **`normative bootstrap`**: Ingests, validates, and registers official legal/curriculum frameworks (BOE, CDE, LOMLOE) with SHA-256 fingerprinting.
- **`course readiness`**: Radar tool auditing the certification of all 6 layers (L0 to L5) before course assembly.
- **`spec batch run`**: Executes end-to-end declarative YAML batches (`discover`, `fetch`, `parse`, `validate`, `compose_bundle`, `ingest`).

---

## 2. Essential Discovery & Verification Commands

### 2.1 Semantic OER Discovery (`oer discover`)
Scan for canonical open-access textbooks by subject, standard, and search query:

```bash
# Discover OERs for California World Languages
./ce-cli.sh oer discover \
  --subject="Spanish" \
  --framework="California WLS / ACTFL" \
  --query="Beginning Spanish Middle School Novice"

# Discover OERs for Spain EBAU / University Access
./ce-cli.sh oer discover \
  --subject="Lengua Castellana y Literatura" \
  --framework="LOMLOE / EBAU" \
  --query="Comentario de texto sintaxis oracion compleja bachillerato"
```

### 2.2 Forensic Quality Certification (`oer evaluate`)
Apply the LLM-as-a-Judge multimodal evaluation engine to any registered OER candidate:

```bash
# Evaluate Minnesota Open Textbook for Spanish Novice
./ce-cli.sh oer evaluate --candidate-id="cand-umn-beginning-spanish"

# Evaluate Marea Verde textbooks for ESO / Bachillerato
./ce-cli.sh oer evaluate --candidate-id="cand-marea-verde-lcl-1eso"
./ce-cli.sh oer evaluate --candidate-id="cand-marea-verde-lcl-2bach"
```
*Evaluation Rubric*: Curricular Alignment (35%), Vector/Visual Quality (25%), Institutional Authority (20%), Open License (20%). Flat scans without structured text receive an **immediate veto (0.0 pts)**.

### 2.3 Legal Framework Grounding (`normative bootstrap`)
Ensure immutable L0 grounding with cryptographic SHA-256 validation:

```bash
# Ingest official Spain frameworks (LOMLOE and RD 534/2024 EBAU)
./ce-cli.sh normative bootstrap --jurisdiction="loc.es" --standard="std.es.lomloe"

# Ingest California frameworks (CDE WLS 2019/2020)
./ce-cli.sh normative bootstrap --jurisdiction="loc.us.ca" --standard="std.us.ca.wls"
```

### 2.4 Course Readiness Radar (`course readiness`)
Inspect whether all 6 pedagogical layers are certified prior to lesson slide generation:

```bash
# Check California Middle School Spanish
./ce-cli.sh course readiness --standard="std.us.ca.wl" --level="MS" --country="us"

# Check Spain ESO (RD 217/2022)
./ce-cli.sh course readiness --standard="std.es.lomloe" --level="ESO" --country="es"

# Check Spain Bachillerato / EBAU
./ce-cli.sh course readiness --standard="std.es.ebau" --level="BACH" --country="es"
```

---

## 3. Running Declarative Pipelines (`spec batch run`)

For mass content generation, use YAML batch definitions located in `ce-specs/batches/`:

```bash
# Execute complete batch pipeline
./ce-cli.sh spec batch run --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml

# Resume from a specific phase (e.g. pedagogical audit)
./ce-cli.sh spec batch run \
  --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml \
  --from validate \
  --overwrite false
```

### Batch Configuration Sample:
```yaml
batch:
  id: ap-spanish-intensive-discovery
  name: "AP Spanish Language — Intensive Discovery & Generate"

context:
  standard: AP_SPANISH
  locale: es
  subject: spanish_language_and_culture
  level: "HL"

# Pipeline stage execution order
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

## 4. State Management and Fault Recovery

- Progress is continuously persisted to `.ce-batch-state.json`.
- If interrupted, re-run with `--from <stage>` (`discover`, `fetch`, `parse`, `validate`, `compose_bundle`, `ingest`).
- Any lesson scoring below `minimumScore` is renamed to `.invalid` and withheld from final bundle compilation.

---
- For the complete reference across all CLI domains (Grading V2, LMS, Org, Billing, Testing), see: [`cli-complete-reference-en.md`](file:///home/jmolmo/git/colabedu/ce-web/docs/cli-complete-reference-en.md).
- For Curator Agent architecture and OER discovery, see: [`guia_usuario_aca_descubrimiento_oer_ensamblado.md`](file:///home/jmolmo/git/colabedu/ce-docs/guia_usuario_aca_descubrimiento_oer_ensamblado.md).
