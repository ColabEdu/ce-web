# Manual de Referencia Completo: ColabEdu CLI (`ce-cli.sh`)

Bienvenido a la guía completa de referencia de la herramienta de línea de comandos de ColabEdu (`ce-cli.sh`). Este documento detalla todos los grupos de comandos disponibles para la gestión de la plataforma: curación e inteligencia OER, evaluación con Grading V2, integración LMS, administración de organizaciones, facturación SaaS y testing unificado.

---

## 1. Modos de Ejecución y Entornos (`--env`)

El comando `./ce-cli.sh` admite el parámetro `--env` para direccionar las operaciones al entorno deseado:

```bash
./ce-cli.sh --env local <comando>     # Local (http://localhost:8081)
./ce-cli.sh --env curator <comando>   # Servidor de Curación (http://localhost:8082)
./ce-cli.sh --env dev <comando>       # Desarrollo Cloud (Tailscale)
./ce-cli.sh --env demo <comando>      # Demostración Cloud
./ce-cli.sh --env stage <comando>     # Staging / Preproducción
./ce-cli.sh --env prod <comando>      # Producción
```

---

## 2. Curación e Inteligencia OER

- **`oer discover`**: Búsqueda semántica híbrida de fuentes abiertas canónicas (OpenStax, LibreTexts, Minnesota OTL, Marea Verde).
  ```bash
  ./ce-cli.sh oer discover --subject="Spanish" --framework="California WLS" --query="Beginning Spanish Novice"
  ```
- **`oer evaluate`**: Certificación forense con LLM-as-a-Judge (100 puntos y veto automático a fotocopias y escaneos raster).
  ```bash
  ./ce-cli.sh oer evaluate --candidate-id="cand-umn-beginning-spanish"
  ```
- **`normative bootstrap`**: Registro y cálculo de huella SHA-256 de marcos legales oficiales (BOE, LOMLOE, CDE).
  ```bash
  ./ce-cli.sh normative bootstrap --jurisdiction="loc.es" --standard="std.es.lomloe"
  ```
- **`curator load` & `curator edit`**: Carga de cursos en Context Cache y mutaciones en lenguaje natural.
  ```bash
  ./ce-cli.sh curator load --course es.lit.bac2 --unit U01 --referenceCode es.lomloe.bach.2.lcl.c2.01
  ./ce-cli.sh curator edit --course es.lit.bac2 --unit U01 --spec es.lomloe.bach.2.lcl.c2.01 --prompt "Ajusta a DUA"
  ```

---

## 3. Preparación Curricular y Lotes

- **`course readiness`**: Radar de madurez que audita la certificación de las 6 capas (L0 a L5).
  ```bash
  ./ce-cli.sh course readiness --standard="std.us.ca.wl" --level="MS" --country="us"
  ./ce-cli.sh course readiness --standard="std.es.lomloe" --level="ESO" --country="es"
  ```
- **`spec batch run`**: Pipeline declarativo por lotes con checkpoints (`.ce-batch-state.json`).
  ```bash
  ./ce-cli.sh spec batch run --batch ce-specs/batches/ap-spanish-intensive-discovery.yaml --from validate
  ```

---

## 4. Evaluación y Exámenes (Grading V2)

- **`grading grade`**: Calificación individual automática con micro-rúbricas.
  ```bash
  ./ce-cli.sh grading grade --assignment "sub-2026-09-12-001"
  ```
- **`grading batch`**: Calificación masiva con sondeo de estado (`--poll`).
  ```bash
  ./ce-cli.sh grading batch --assignments "sub-01,sub-02,sub-03" --poll
  ```
- **`exam simulate`**: Simulacro oficial cronometrado con auto-envío al agotar el tiempo.
  ```bash
  ./ce-cli.sh exam simulate --student-id="stu-1042" --spec="es.ebau.madrid.ensayo.lorca.v1" --duration=90
  ```
- **`exercise create`**: Asistente de creación de ejercicios interactivos en formato OPS.
  ```bash
  ./ce-cli.sh exercise create --name="Comentario de Texto" --framework="std.es.ebau" --timed --duration=90
  ```

---

## 5. Integración LMS (Canvas & Moodle LTI 1.3)

- **`org lms-credential set|list`**: Configuración de tokens y credenciales API por organización.
  ```bash
  ./ce-cli.sh org lms-credential set --org-id 12 --platform canvas --url "https://canvas.colegio.edu" --token "7~xxx"
  ```
- **`lms provision` & `lms teardown`**: Despliegue y limpieza segura de escenarios de prueba.
  ```bash
  ./ce-cli.sh lms provision --file lms-test-seed.yaml --suffix "ci-412"
  ./ce-cli.sh lms teardown --suffix "ci-412"
  ```
- **`lms register-link`**: Registro de enlaces LTI Deep Linking con tareas del LMS.

---

## 6. Gestión de Organizaciones y Usuarios

- **`org create|list|get`**: Administración de colegios, institutos y distritos educativos.
  ```bash
  ./ce-cli.sh org create --name "IES Severo Ochoa" --type SCHOOL --country ES
  ```
- **`course create` & `classroom create|enroll|assign-teacher`**: Gestión de aulas y matriculaciones.
  ```bash
  ./ce-cli.sh classroom create --name "Grupo 2º Bach A" --course-id 5 --org-id 12
  ./ce-cli.sh classroom enroll-bulk --classroom-id 3 --file "roster.csv"
  ```
- **`user provision|lookup|roles|assign-role|set-roles`**: Gestión de usuarios y sincronización con Firebase Claims.
  ```bash
  ./ce-cli.sh user provision --email "docente@colegio.org" --name "Ana Pérez" --role teacher --orgId 12
  ./ce-cli.sh user lookup --email "docente@colegio.org"
  ./ce-cli.sh user assign-role --email "docente@colegio.org" --role school_admin
  ```

---

## 7. Academia 24/7 y Portal Familiar (`academy`)

- **`academy status`**: Consulta de nivel de suscripción y estado de acceso de un alumno.
  ```bash
  ./ce-cli.sh academy status --student-id "stu-1042"
  ```
- **`academy grant-pro`**: Asignación de pases Pro temporales.
- **`academy request-consent`**: Flujo digital de consentimiento parental para menores.

---

## 8. Facturación SaaS y Recompensas (`billing` & `rewards`)

- **`billing setup-catalog`**: Aprovisionamiento de planes y add-ons en Chargebee.
- **`billing entitlements` & `quota-reset`**: Consulta y reinicio de cuotas mensuales de tokens.
  ```bash
  ./ce-cli.sh billing entitlements --email "director@colegio.org"
  ./ce-cli.sh billing quota-reset --email "director@colegio.org"
  ```

---

## 9. Testing Unificado y Auditoría Visual

- **`test <pilar> [--visual]`**: Ejecución de suites de prueba con captura opcional de snapshots en Chrome Headless:
  - `editorial`: Creación curricular y wizards (42 tests).
  - `grading`: Grading V2 y micro-rúbricas (21 tests).
  - `navigation`: DAG adaptativo y remediation (12 tests).
  - `teacher` / `student`: Flujos de rol y radar metacognitivo.
  - `academy`: Tutoría 24/7 y portal familiar (14 tests).
  - `admin`: Permisos jerárquicos y membresías (16 tests).
  - `lms`: Integración LTI 1.3 Canvas y Moodle.
  - `interactive-lesson`: A2UI Live Monitor y telemetría.
  - `all`: Batería completa de 9 pilares (178 tests).
- **`audit visual|demo`**: Captura masiva de regresión visual (214 snapshots).
