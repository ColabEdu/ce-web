import os

filepath = '/home/jmolmo/git/colabedu/ce-web/apps/colabedu-net/src/pages/en/editorial.astro'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Soluciones Estratégicas para Editoriales': 'Strategic Solutions for Publishers',
    'Activación de Fondo Editorial': 'Editorial Backlist Activation',
    'Revitalice su <br/><span class="gradient-text italic">IP Editorial.</span>': 'Revitalize your <br/><span class="gradient-text italic">Editorial IP.</span>',
    'Deje de entregar archivos estáticos. Transforme su catálogo en una red de inteligencia pedagógica que guía al alumno y ahorra tiempo al docente mediante el modelo de <strong>Referencialidad Ciega</strong>.': 'Stop delivering static files. Transform your catalog into a pedagogical intelligence network that guides the student and saves teacher time through the <strong>Blind Referentiality</strong> model.',
    'Modernizar mi Catálogo': 'Modernize my Catalog',
    'Ver White Paper': 'View White Paper',
    'Estado: Transformación en curso': 'Status: Transformation in progress',
    'El Retorno del Engagement': 'The Return on Engagement',
    'Los manuales tradicionales pierden el 80% de la retención tras la primera semana de uso. ColabEdu mantiene al estudiante activo mediante un bucle de interacción constante con su IP.': 'Traditional manuals lose 80% of retention after the first week of use. ColabEdu keeps the student active through a constant interaction loop with your IP.',
    'Uso Diario': 'Daily Use',
    'Lucro Cesante': 'Lost Revenue',
    'Retención en el Catálogo: PDFs vs. Tutoría Socrática Activa': 'Catalog Retention: PDFs vs. Active Socratic Tutoring',
    'La Factoría de Contenidos.': 'The Content Factory.',
    'De material inerte a grafos de conocimiento estructurados mediante tres capas de inteligencia.': 'From inert material to structured knowledge graphs through three intelligence layers.',
    'Atomización RAG': 'RAG Atomization',
    'Nuestro <strong>Curator Agent</strong> segmenta sus libros en bloques lógicos inmutables: fragmentos de lectura, criterios de rúbrica e instrucciones de evaluación.': 'Our <strong>Curator Agent</strong> segments your books into immutable logical blocks: reading fragments, rubric criteria, and evaluation instructions.',
    'Mutación Instruccional': 'Instructional Mutation',
    'Transformamos sus textos en desafíos interactivos. La IA genera debates, ensayos y simulaciones basados exclusivamente en su IP propietaria.': 'We transform your texts into interactive challenges. AI generates debates, essays, and simulations based exclusively on your proprietary IP.',
    'Tagging Curricular': 'Curricular Tagging',
    'Alineación automática con LOMLOE, TEKS y AP. Su contenido se vuelve compatible con los requisitos estatales instantáneamente.': 'Automatic alignment with LOMLOE, TEKS, and AP. Your content becomes compatible with state requirements instantly.',
    'Consola del Editor Editorial': 'Editorial Editor Console',
    'Unidad 4: Bioquímica.pdf': 'Unit 4: Biochemistry.pdf',
    'PROCESADO': 'PROCESSED',
    'Historia S.XX - Cap 1.pdf': '20th Century History - Chap 1.pdf',
    'VALIDANDO RÚBRICA': 'VALIDATING RUBRIC',
    'Escalabilidad Industrial para sus Editores.': 'Industrial Scalability for your Editors.',
    'No sustituimos a sus editores; les damos superpoderes. Una sola persona puede supervisar la digitalización de miles de páginas diarias, validando el tono pedagógico final.': 'We do not replace your editors; we give them superpowers. A single person can oversee the digitization of thousands of pages daily, validating the final pedagogical tone.',
    'Calidad Garantizada': 'Guaranteed Quality',
    '15 Días': '15 Days',
    'Time-to-market total': 'Total Time-to-Market',
    'Su catálogo, <span class="gradient-text">en 60 idiomas.</span>': 'Your catalog, <span class="gradient-text">in 60 languages.</span>',
    'Nuestra arquitectura multilingüe permite que su IP de alta calidad se localice dinámicamente para mercados internacionales, respetando el rigor pedagógico original.': 'Our multilingual architecture allows your high-quality IP to be dynamically localized for international markets, respecting the original pedagogical rigor.',
    'Scaffolding Newcomers': 'Scaffolding Newcomers',
    'Permite que estudiantes inmigrantes interactúen con su contenido en su lengua materna mientras aprenden el idioma local. Inclusión real sin duplicar costes.': 'Allows immigrant students to interact with your content in their native language while learning the local language. Real inclusion without duplicating costs.',
    'Cobertura Multilingüe': 'Multilingual Coverage',
    'ESPAÑOL': 'SPANISH',
    'INGLÉS': 'ENGLISH',
    'FRANCÉS': 'FRENCH',
    'CATALÁN': 'CATALAN',
    'MANDARÍN': 'MANDARIN',
    '+55 MÁS': '+55 MORE',
    'Referencialidad Ciega: <br/><span class="text-publisher italic">Blindaje de su IP.</span>': 'Blind Referentiality: <br/><span class="text-publisher italic">Shielding your IP.</span>',
    'Entendemos que su contenido es su mayor valor. ColabEdu no reproduce el libro; lo utiliza como fuente de verdad. La IA guía al alumno, pero éste debe poseer el material original para resolver los retos, validando su modelo de negocio tradicional.': 'We understand that your content is your greatest value. ColabEdu does not reproduce the book; it uses it as a source of truth. AI guides the student, but they must possess the original material to solve the challenges, validating your traditional business model.',
    '"Incentiva y valida la compra del libro original, eliminando el riesgo de piratería digital total."': '"Incentivizes and validates the purchase of the original book, eliminating the risk of total digital piracy."',
    '"Transforma un centro de costes (almacenamiento) en un activo de entrenamiento pedagógico."': '"Transforms a cost center (storage) into a pedagogical training asset."',
    'Ejemplo de Interacción Socrática': 'Socratic Interaction Example',
    '"Analiza el gráfico de la página 142 de tu manual. ¿Cómo se relaciona la tasa de natalidad con el crecimiento económico mencionado en el texto fuente?"': '"Analyze the graph on page 142 of your manual. How does the birth rate relate to the economic growth mentioned in the source text?"',
    'La IP permanece protegida en el entorno físico del alumno.': 'The IP remains protected in the student\'s physical environment.',
    'Omnicanalidad Pedagógica.': 'Pedagogical Omnichannel.',
    'Su contenido llega a donde están los usuarios, nativamente.': 'Your content reaches where users are, natively.',
    'Caso de Éxito: Proyecto "Remaster"': 'Success Story: Project "Remaster"',
    'Digitalizando 10 años de Selectividad en <span class="text-publisher">15 días.</span>': 'Digitizing 10 years of University Entrance Exams in <span class="text-publisher">15 days.</span>',
    'Vea cómo un grupo editorial líder transformó su banco de 12,000 preguntas de examen y lecturas literarias en una plataforma de entrenamiento dinámico que hoy usan 50,000 alumnos en España.': 'See how a leading publishing group transformed its bank of 12,000 exam questions and literary readings into a dynamic training platform used today by 50,000 students in Spain.',
    'Bloques RAG': 'RAG Blocks',
    'Precisión IA': 'AI Accuracy',
    'Idiomas': 'Languages',
    'Leer Informe Técnico': 'Read Technical Report',
    'No permita que otros <br/><span class="text-primary italic">programen su contenido.</span>': 'Don\'t let others <br/><span class="text-primary italic">program your content.</span>',
    'ColabEdu le ofrece la infraestructura para liderar la era de la IA generativa sin ceder su soberanía de datos ni su valor estratégico.': 'ColabEdu offers you the infrastructure to lead the generative AI era without compromising your data sovereignty or strategic value.',
    'Hablar con Alianzas': 'Talk to Partnerships',
    'Tour Tecnológico': 'Tech Tour',
    'Protección de Propiedad Intelectual bajo estándares IEEE-AI.': 'Intellectual Property Protection under IEEE-AI standards.',
    "'Semana 1', 'Semana 2', 'Semana 4', 'Semana 8', 'Semana 12'": "'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'",
    "'Libro Estático (PDF)'": "'Static Book (PDF)'",
    "'Libro IA Socrático (ColabEdu)'": "'Socratic AI Book (ColabEdu)'",
    "'Digitalización Manual', 'Curator Agent IA'": "'Manual Digitization', 'Curator Agent AI'",
    "'Días por catálogo (100 títulos)'": "'Days per catalog (100 titles)'",
    "'Español', 'Inglés', 'Francés', 'Alemán', 'Otros (60+)'": "'Spanish', 'English', 'French', 'German', 'Others (60+)'"
}

for es_text, en_text in replacements.items():
    content = content.replace(es_text, en_text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Translated {filepath}")
