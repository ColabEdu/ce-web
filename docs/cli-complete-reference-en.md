# Complete CLI Reference Guide: ColabEdu CLI (`ce-cli.sh`)

Welcome to the comprehensive reference manual for the ColabEdu Command Line Interface (`ce-cli.sh`). This document details all command groups available for platform governance: OER intelligence & curation, Grading V2 evaluations, LMS integrations, multi-tenant organization administration, SaaS billing, and unified testing.

---

## 1. Execution Modes and Environments (`--env`)

Use the `--env` parameter with `./ce-cli.sh` to route requests to specific environments:

```bash
./ce-cli.sh --env local <command>     # Local (http://localhost:8081)
./ce-cli.sh --env curator <command>   # Local Curation Server (http://localhost:8082)
./ce-cli.sh --env dev <command>       # Cloud Development (Tailscale mesh)
./ce-cli.sh --env demo <command>      # Cloud Demo Environment
./ce-cli.sh --env stage <command>     # Staging Environment
./ce-cli.sh --env prod <command>      # Production Environment
```

---

## 2. OER Intelligence & Curation

- **`oer discover`**: Hybrid federated semantic search across OpenStax, LibreTexts, Minnesota Open Textbook Library, and open repositories.
  ```bash
  ./ce-cli.sh oer discover --subject="Spanish" --framework="California WLS" --query="Beginning Spanish Novice"
  ```
- **`oer evaluate`**: Forensic LLM-as-a-Judge quality certification (100-point rubric and automatic veto for raster/photocopy scans).
  ```bash
  ./ce-cli.sh oer evaluate --candidate-id="cand-umn-beginning-spanish"
  ```
- **`normative bootstrap`**: Ingest and compute SHA-256 fingerprints for official legal gazettes and frameworks (BOE, LOMLOE, CDE).
  ```bash
  ./ce-cli.sh normative bootstrap --jurisdiction="loc.es" --standard="std.es.lomloe"
  ```
- **`curator load` & `curator edit`**: In-memory course DAG manipulation via Vertex AI Context Cache with natural language prompts.

---

## 3. Curriculum Readiness & Batch Pipelines

- **`course readiness`**: Holistic radar auditing the certification of all 6 OPS layers (L0 to L5) before lesson generation.
  ```bash
  ./ce-cli.sh course readiness --standard="std.us.ca.wl" --level="MS" --country="us"
  ./ce-cli.sh course readiness --standard="std.es.lomloe" --level="ESO" --country="es"
  ```
- **`spec batch run`**: Industrial declarative YAML batch transformation with automatic checkpoints (`.ce-batch-state.json`).
  ```bash
  ./ce-cli.sh spec batch run --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml --from validate
  ```

---

## 4. Grading V2 & Timed Exam Simulators

- **`grading grade`**: Automated evaluation of a single student submission against C0 micro-rubrics.
  ```bash
  ./ce-cli.sh grading grade --assignment "sub-2026-09-12-001"
  ```
- **`grading batch`**: Batch grading with asynchronous status polling (`--poll`).
  ```bash
  ./ce-cli.sh grading batch --assignments "sub-01,sub-02,sub-03" --poll
  ```
- **`exam simulate`**: Official timed mock exam with auto-submit countdown in A2UI.
  ```bash
  ./ce-cli.sh exam simulate --student-id="stu-1042" --spec="es.ebau.madrid.ensayo.lorca.v1" --duration=90
  ```
- **`exercise create`**: Interactive wizard for generating OPS ExerciseSpec v0.9.5 files.

---

## 5. LMS Integration (Canvas & Moodle LTI 1.3)

- **`org lms-credential set|list`**: Configure multi-tenant LTI and REST API tokens per organization.
  ```bash
  ./ce-cli.sh org lms-credential set --org-id 12 --platform canvas --url "https://canvas.school.edu" --token "7~xxx"
  ```
- **`lms provision` & `lms teardown`**: Automated testbed seeding and clean-up by test run suffix.
  ```bash
  ./ce-cli.sh lms provision --file lms-test-seed.yaml --suffix "ci-412"
  ./ce-cli.sh lms teardown --suffix "ci-412"
  ```
- **`lms register-link`**: Bind LTI Deep Linking launch targets to ColabEdu specification references.

---

## 6. Organizations, Classrooms & User Management

- **`org create|list|get`**: Manage educational institutions, school districts, and campuses.
  ```bash
  ./ce-cli.sh org create --name "Severo Ochoa High School" --type SCHOOL --country ES
  ```
- **`classroom create|enroll|assign-teacher`**: Classroom provisioning and bulk student roster enrollment.
  ```bash
  ./ce-cli.sh classroom enroll-bulk --classroom-id 3 --file "roster.csv"
  ```
- **`user provision|lookup|roles|assign-role|set-roles`**: User provisioning, Firebase Custom Claims sync, and role lifecycle.
  ```bash
  ./ce-cli.sh user provision --email "teacher@school.org" --name "Ana Pérez" --role teacher --orgId 12
  ./ce-cli.sh user assign-role --email "teacher@school.org" --role school_admin
  ```

---

## 7. Academy 24/7 & Family Portal (`academy`)

- **`academy status`**: Check student subscription tier, pricing, and unlocked A2UI features.
- **`academy grant-pro`**: Issue temporary promotional Pro passes.
- **`academy request-consent`**: Initiate parental digital consent workflows for COPPA/GDPR compliance.

---

## 8. SaaS Billing & Rewards (`billing` & `rewards`)

- **`billing setup-catalog`**: Provision subscription plans, add-ons, and coupon codes in Chargebee.
- **`billing entitlements` & `quota-reset`**: Inspect and reset monthly token and evaluation quotas.
  ```bash
  ./ce-cli.sh billing entitlements --email "principal@school.org"
  ./ce-cli.sh billing quota-reset --email "principal@school.org"
  ```

---

## 9. Unified 9-Pillar Testing & Headless Visual Audits

- **`test <pillar> [--visual]`**: Run Java integration test batteries with optional Chrome Headless regression snapshots:
  - `editorial`: Curriculum creation and wizards (42 tests).
  - `grading`: Grading V2 and micro-rubrics (21 tests).
  - `navigation`: Adaptive DAG graph routing and remediation (12 tests).
  - `teacher` / `student`: Role journeys and metacognitive radar.
  - `academy`: 24/7 AI tutor and family portal (14 tests).
  - `admin`: Hierarchical scopes and role access (16 tests).
  - `lms`: End-to-end LTI 1.3 Canvas and Moodle pathways.
  - `interactive-lesson`: A2UI Live Monitor and real-time telemetry.
  - `all`: Full 9-pillar master test suite (178 tests).
- **`audit visual|demo`**: Full visual regression capture (214 high-density snapshots).
