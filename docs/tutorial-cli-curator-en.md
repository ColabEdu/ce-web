# Tutorial: Curator and CLI in ColabEdu

Welcome to the step-by-step tutorial on how to use the CLI and Curation tools in ColabEdu. This guide will teach you how to orchestrate content generation batches, integrating web search, parsing, and the new automated pedagogical validation.

## 1. Introduction to the Ecosystem

The curation process in ColabEdu relies on automating workflows (pipelines) using YAML files (`Batches`). The core engine is executed via the `ce-svc-cli`.

The main operations you can orchestrate are:
- **`discover`**: Searches the web for sources based on pedagogical criteria.
- **`fetch`**: Downloads documents and caches them locally.
- **`parse`**: Converts unstructured documents into structured curricular specifications (OAS YAML).
- **`validate`**: (New!) Checks the YAML structure and pedagogically audits the generated content using LangChain4j and Gemini.
- **`compose_bundle`**: Assembles individual curricular units into full courses.
- **`classify`** and **`ingest`**: Taxonomy tagging and storage in the production database.

## 2. Running your first Batch

To start a workflow, create or select a YAML file inside the `ce-specs/batches/` folder. For example:

```bash
# Navigate to the CLI directory
cd ce-svc-parent/ce-svc-cli

# Run a discovery and generation batch
java -jar target/ce-svc-cli-0.7.3.jar spec batch run --batch ../../ce-specs/batches/ap-spanish-intensive-discovery.yaml
```

## 3. Example of a Batch File with Validation

The YAML file defines the pipeline. Below is an example with the `validate` phase integrated:

```yaml
batch:
  id: ap-spanish-intensive-discovery
  name: "AP Spanish Language — Intensive Discovery & Generate"

context:
  standard: AP_SPANISH
  locale: es
  subject: spanish_language_and_culture
  level: "HL"

# Pipeline stage order
operations: [discover, fetch, parse, validate, compose_bundle]

# Web search configuration
discover:
  types: [open_books, exams]
  keywords:
    - "AP Spanish Language exam prep practice"
  maxResults: 50

# Pedagogical auditor configuration
validate:
  syntacticCheck: true
  pedagogicalAudit: true
  minimumScore: 8.0
```

## 4. Resuming from a previous stage

Sometimes the web fetch fails or a `parse` phase is interrupted. The CLI saves progress in `.ce-batch-state.json`. You can continue the process using the `--from` argument:

```bash
# If the batch failed at 'validate', fix the issue and resume from that stage
java -jar target/ce-svc-cli-0.7.3.jar spec batch run --batch ../../ce-specs/batches/ap-spanish-intensive-discovery.yaml --from validate
```

## 5. Pedagogical Validation (`validate`)

The validation phase automatically rejects any generated lesson that does not meet a minimum level of pedagogical quality (`minimumScore`).

- Uses a "Pedagogical Auditor" **System Prompt**.
- Verifies tone, curricular alignment, and prevents "hallucinations".
- Files that score below the threshold will be renamed to `.invalid` and excluded from the packaging phase (`compose_bundle`).

---
Thank you for contributing to ColabEdu's curriculum automation!
