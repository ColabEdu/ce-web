import os

filepath = '/home/jmolmo/git/colabedu/ce-web/apps/colabedu-net/src/pages/en/school.astro'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Centro de Inteligencia Institucional': 'Institutional Intelligence Center',
    'Para Profesores': 'For Teachers',
    'Para Instituciones': 'For Institutions',
    'Evaluación que devuelve <span class="text-primary">tiempo.</span>': 'Grading that gives back <span class="text-primary">time.</span>',
    'La carga administrativa consume el 80% del tiempo docente. Nuestra IA automatiza el procesamiento multimodal para que puedas volver a lo que importa: inspirar.': 'Administrative tasks consume 80% of teachers\' time. Our AI automates multimodal processing so you can get back to what matters: inspiring.',
    'Manuscritos a Datos': 'Handwriting to Data',
    'OCR avanzado con 99% de precisión que interpreta incluso la caligrafía más compleja.': 'Advanced OCR with 99% accuracy that interprets even the most complex handwriting.',
    'Voz e Interacción': 'Voice and Interaction',
    'Evaluación en tiempo real de fluidez y contenido en presentaciones orales de idiomas.': 'Real-time assessment of fluency and content in language oral presentations.',
    'Rúbricas Dinámicas': 'Dynamic Rubrics',
    'Generación automática de descriptores alineados a estándares internacionales.': 'Automatic generation of descriptors aligned to international standards.',
    'Ahorro de Tiempo Semanal': 'Weekly Time Savings',
    'Visualiza la transformación operativa. El tiempo ganado se traduce en una reducción directa del burnout docente.': 'Visualize operational transformation. Time saved translates to a direct reduction in teacher burnout.',
    '17 minutos ahorrados por cada ensayo evaluado.': '17 minutes saved per evaluated essay.',
    'Sincronización automática con el Gradebook del LMS.': 'Automatic sync with LMS Gradebook.',
    'Estandarización y <span class="text-primary">Equidad Académica.</span>': 'Standardization and <span class="text-primary">Academic Equity.</span>',
    'Esta sección detalla cómo ColabEdu escala la excelencia pedagógica desde un solo aula hasta todo un sistema educativo regional, resolviendo el desafío de la consistencia en la evaluación.': 'This section details how ColabEdu scales pedagogical excellence from a single classroom to a whole regional education system, solving the challenge of grading consistency.',
    'Elimina la Deriva Pedagógica': 'Eliminate Pedagogical Drift',
    'Asegura que cada profesor, en cada escuela, evalúe bajo los mismos criterios de éxito. Las Recetas Maestras garantizan la equidad para cada estudiante.': 'Ensure every teacher, in every school, grades under the same success criteria. Master Recipes guarantee equity for every student.',
    'Beneficio: Reducción del 45% en discrepancias de calificación entre docentes.': 'Benefit: 45% reduction in grading discrepancies between teachers.',
    'Consistencia en Tiempo Real': 'Real-Time Consistency',
    'Analítica Masiva': 'Massive Analytics',
    'Detección de brechas por competencia en todo el distrito.': 'District-wide competency gap detection.',
    'Seguridad de grado institucional y sincronización profunda.': 'Institutional-grade security and deep synchronization.',
    'Retención Docente': 'Teacher Retention',
    'Tecnología "Anti-Burnout" para retener a los mejores maestros.': 'Anti-Burnout technology to retain the best teachers.',
    'Soberanía de Datos': 'Data Sovereignty',
    'Control total sobre la IP pedagógica de la institución.': 'Total control over the institution\'s pedagogical IP.',
    'Mapa de Brechas por Competencia': 'Competency Gap Map',
    'Este reporte visual permite a los directores identificar qué departamentos necesitan refuerzo. Los datos fluyen directamente de las evaluaciones diarias, eliminando la necesidad de reportes manuales.': 'This visual report allows principals to identify which departments need reinforcement. Data flows directly from daily assessments, eliminating the need for manual reports.',
    'Para Escuelas y Departamentos': 'For Schools and Departments',
    'Implementa un banco compartido de rúbricas. El "Curator Agent" ingiere tus programas actuales y los convierte en evaluadores inteligentes en minutos.': 'Implement a shared bank of rubrics. The Curator Agent ingests your current syllabi and turns them into intelligent evaluators in minutes.',
    'Para Gobiernos y Ministerios': 'For Governments and Ministries',
    'Monitorea el cumplimiento de estándares nacionales (LOMLOE, SEP, Common Core) sin burocracia. Genera reportes de nivel nacional con un clic.': 'Monitor compliance with national standards (LOMLOE, SEP, Common Core) without bureaucracy. Generate national-level reports with one click.',
    'Para Editoriales': 'For Publishers',
    'Revitaliza tu catálogo estático. Convierte tus libros de texto en "Tutores Socráticos" interactivos que evalúan y guían al estudiante.': 'Revitalize your static catalog. Turn your textbooks into interactive Socratic Tutors that evaluate and guide the student.',
    'El futuro de la evaluación es <span class="text-primary">colaborativo.</span>': 'The future of assessment is <span class="text-primary">collaborative.</span>',
    'Solicitar Demo Institucional': 'Request Institutional Demo',
    'Consultar Precios': 'Check Pricing',
    'Potenciando la enseñanza con Inteligencia Pedagógica. Sin compromiso de IP.': 'Powering teaching with Pedagogical Intelligence. No IP compromise.',
    "'Corrección Manual', 'Corrección ColabEdu'": "'Manual Grading', 'ColabEdu Grading'",
    "'Horas Semanales'": "'Weekly Hours'",
    "'Gramática', 'Contenido', 'Vocabulario', 'Tono', 'Estructura'": "'Grammar', 'Content', 'Vocabulary', 'Tone', 'Structure'",
    "'Varianza Humana'": "'Human Variance'",
    "'Estandarización ColabEdu'": "'ColabEdu Standardization'",
    "'Pensamiento Crítico', 'Uso de Evidencias', 'Concordancia', 'Fluidez Oral', 'Análisis Literario'": "'Critical Thinking', 'Use of Evidence', 'Agreement', 'Oral Fluency', 'Literary Analysis'",
    "'Nivel de Dominio Distrital (%)'": "'District Mastery Level (%)'"
}

for es_text, en_text in replacements.items():
    content = content.replace(es_text, en_text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Translated {filepath}")
