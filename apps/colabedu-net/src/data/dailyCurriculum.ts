// src/data/dailyCurriculum.ts
// Datos estructurados del curso escolar cotidiano por zona, etapa y asignatura.
// Fuente única de verdad para la Home, Asignaturas por Zona y Día a Día (es/en).

export type ZoneId = 'es' | 'us' | 'mx' | 'intl';
export type StageId = 'primary' | 'middle' | 'high';

export interface LocalizedText {
    es: string;
    en: string;
}

export interface DailySubjectItem {
    id: string;
    icon: string;
    color: 'blue' | 'teal' | 'amber' | 'purple' | 'emerald' | 'indigo';
    name: LocalizedText;
    topicToday: LocalizedText;
    samplePrompt: LocalizedText;
    socraticHint: LocalizedText;
    catalogPath: string;
}

export interface ZoneStageConfig {
    id: StageId;
    label: LocalizedText;
    grades: LocalizedText;
    subjects: DailySubjectItem[];
}

export interface ZoneConfig {
    id: ZoneId;
    flag: string;
    name: LocalizedText;
    standardLabel: LocalizedText;
    catalogBase: string;
    stages: Record<StageId, ZoneStageConfig>;
}

export const DAILY_ZONES: Record<ZoneId, ZoneConfig> = {
    es: {
        id: 'es',
        flag: '🇪🇸',
        name: { es: 'España', en: 'Spain' },
        standardLabel: { es: 'LOMLOE · Primaria, ESO y Bachillerato', en: 'LOMLOE · Primary, ESO & Bachillerato' },
        catalogBase: '/es',
        stages: {
            primary: {
                id: 'primary',
                label: { es: 'Primaria', en: 'Primary (Grades 1-6)' },
                grades: { es: '4º - 6º Primaria', en: '4th - 6th Grade' },
                subjects: [
                    {
                        id: 'es-pri-math',
                        icon: 'fa-calculator',
                        color: 'blue',
                        name: { es: 'Matemáticas', en: 'Mathematics' },
                        topicToday: { es: 'Fracciones equivalentes y problemas de la compra', en: 'Equivalent fractions & everyday word problems' },
                        samplePrompt: { es: 'Si repartimos 3/4 de pizza entre 3 amigos, ¿qué fracción le toca a cada uno?', en: 'If we share 3/4 of a pizza among 3 friends, what fraction does each get?' },
                        socraticHint: { es: 'Visualiza la pizza dividida en 4 porciones iguales: si tienes 3 de esas porciones, ¿cuántas recibe cada persona?', en: 'Picture the pizza cut into 4 equal slices: if you have 3 slices, how many does each person get?' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-pri-lang',
                        icon: 'fa-book-open',
                        color: 'amber',
                        name: { es: 'Lengua Castellana', en: 'Spanish Language Arts' },
                        topicToday: { es: 'Comprensión lectora, acentuación y dictado guiado', en: 'Reading comprehension, accents & guided dictation' },
                        samplePrompt: { es: '¿Por qué "árbol" lleva tilde y "reloj" no, si las dos terminan en consonante?', en: 'Why does "árbol" have an accent mark while "reloj" does not?' },
                        socraticHint: { es: 'Separa las sílabas y marca cuál suena más fuerte en cada palabra antes de mirar la última letra.', en: 'Split each word into syllables and find the stressed syllable first.' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-pri-sci',
                        icon: 'fa-seedling',
                        color: 'emerald',
                        name: { es: 'Conocimiento del Medio', en: 'Natural & Social Science' },
                        topicToday: { es: 'Ecosistemas, ciclo del agua y energía', en: 'Ecosystems, water cycle & energy' },
                        samplePrompt: { es: '¿Qué ocurriría en un bosque si desaparecieran los descomponedores?', en: 'What would happen in a forest if decomposers disappeared?' },
                        socraticHint: { es: 'Piensa en qué ocurre con las hojas caídas y los nutrientes que necesitan las raíces.', en: 'Think about fallen leaves and where plant roots get their nutrients.' },
                        catalogPath: '/es'
                    }
                ]
            },
            middle: {
                id: 'middle',
                label: { es: 'ESO', en: 'Secondary (ESO)' },
                grades: { es: '1º - 4º ESO', en: 'Grades 7 - 10 (ESO)' },
                subjects: [
                    {
                        id: 'es-eso-math',
                        icon: 'fa-square-root-variable',
                        color: 'blue',
                        name: { es: 'Matemáticas', en: 'Mathematics' },
                        topicToday: { es: 'Ecuaciones de 1º y 2º grado y proporcionalidad', en: 'Linear & quadratic equations, proportions' },
                        samplePrompt: { es: 'Resuelve: 3(x - 2) = 2x + 5. Explica qué haces con el paréntesis.', en: 'Solve: 3(x - 2) = 2x + 5. Explain your first step.' },
                        socraticHint: { es: 'Ojo: el 3 multiplica a todo lo que está dentro del paréntesis, no solo a la x.', en: 'Watch out: the 3 multiplies everything inside the parentheses, not just x.' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-eso-lang',
                        icon: 'fa-pen-nib',
                        color: 'amber',
                        name: { es: 'Lengua y Literatura', en: 'Language & Literature' },
                        topicToday: { es: 'Sintaxis de la oración simple y comentario de texto', en: 'Sentence syntax & text analysis' },
                        samplePrompt: { es: 'Localiza el sujeto y el complemento directo en: "Ayer entregó Lucía el trabajo".', en: 'Find the subject and direct object in: "Ayer entregó Lucía el trabajo".' },
                        socraticHint: { es: 'Prueba a cambiar el verbo a plural ("entregaron"): ¿qué palabra del texto cambia obligatoriamente?', en: 'Try changing the verb to plural: which noun in the sentence must change with it?' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-eso-fq',
                        icon: 'fa-flask',
                        color: 'teal',
                        name: { es: 'Física y Química', en: 'Physics & Chemistry' },
                        topicToday: { es: 'Movimiento rectilíneo, densidad y ajuste de reacciones', en: 'Motion, density & balancing equations' },
                        samplePrompt: { es: 'Un coche pasa de 0 a 72 km/h en 5 segundos. ¿Cuál es su aceleración en m/s²?', en: 'A car goes from 0 to 72 km/h in 5 seconds. What is its acceleration in m/s²?' },
                        socraticHint: { es: 'Antes de dividir entre 5 s, ¿en qué unidades están los 72 km/h?', en: 'Before dividing by 5 s, check the units of 72 km/h.' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-eso-hist',
                        icon: 'fa-landmark',
                        color: 'purple',
                        name: { es: 'Geografía e Historia', en: 'Geography & History' },
                        topicToday: { es: 'Revolución Industrial, Edad Moderna y mapas', en: 'Industrial Revolution & historical sources' },
                        samplePrompt: { es: '¿Por qué la máquina de vapor transformó primero el sector textil y el transporte?', en: 'Why did the steam engine transform textiles and transport first?' },
                        socraticHint: { es: 'Compara dónde podían instalarse las fábricas antes (junto a ríos) y después del carbón.', en: 'Compare where factories had to be built before (near rivers) and after coal.' },
                        catalogPath: '/es'
                    }
                ]
            },
            high: {
                id: 'high',
                label: { es: 'Bachillerato', en: 'Bachillerato (Grades 11-12)' },
                grades: { es: '1º - 2º Bachillerato · PAU', en: '11th - 12th Grade · PAU' },
                subjects: [
                    {
                        id: 'es-bach-math',
                        icon: 'fa-chart-line',
                        color: 'blue',
                        name: { es: 'Matemáticas II / CCSS', en: 'Calculus & Linear Algebra' },
                        topicToday: { es: 'Derivadas, optimización y matrices', en: 'Derivatives, optimization & matrices' },
                        samplePrompt: { es: 'Halla el punto de la curva f(x) = x² - 4x + 5 donde la tangente es horizontal.', en: 'Find where the tangent to f(x) = x² - 4x + 5 is horizontal.' },
                        socraticHint: { es: '¿Qué valor tiene la pendiente (derivada) de una recta completamente horizontal?', en: 'What is the slope (derivative) of a horizontal line?' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-bach-phys',
                        icon: 'fa-atom',
                        color: 'teal',
                        name: { es: 'Física y Química', en: 'Physics & Chemistry' },
                        topicToday: { es: 'Tiro parabólico, equilibrio químico y pH', en: 'Projectile motion, equilibrium & pH' },
                        samplePrompt: { es: 'En un tiro parabólico, ¿cuánto vale la velocidad vertical en el punto más alto?', en: 'In projectile motion, what is the vertical velocity at the highest point?' },
                        socraticHint: { es: 'Distingue entre la componente horizontal (vx) y la vertical (vy) justo cuando deja de subir.', en: 'Separate vx and vy at the exact instant it stops rising.' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'es-bach-hist',
                        icon: 'fa-scroll',
                        color: 'amber',
                        name: { es: 'Historia de España', en: 'History of Spain' },
                        topicToday: { es: 'Comentario de fuentes históricas y Constitución de 1812', en: 'Primary source analysis & 1812 Constitution' },
                        samplePrompt: { es: 'Identifica dos ideas clave de soberanía nacional en el texto de las Cortes de Cádiz.', en: 'Identify two key ideas of national sovereignty in the Cádiz text.' },
                        socraticHint: { es: 'Subraya quién ostenta el poder según el artículo 3 frente al Antiguo Régimen.', en: 'Compare who holds sovereignty in Article 3 versus the Old Regime.' },
                        catalogPath: '/es'
                    }
                ]
            }
        }
    },
    us: {
        id: 'us',
        flag: '🇺🇸',
        name: { es: 'Estados Unidos', en: 'United States' },
        standardLabel: { es: 'Common Core · Texas TEKS · College Board AP', en: 'Common Core · Texas TEKS · College Board AP' },
        catalogBase: '/us',
        stages: {
            primary: {
                id: 'primary',
                label: { es: 'Elementary', en: 'Elementary (K-5)' },
                grades: { es: 'Grades 3 - 5', en: 'Grades 3 - 5' },
                subjects: [
                    {
                        id: 'us-elem-math',
                        icon: 'fa-calculator',
                        color: 'blue',
                        name: { es: 'Matemáticas (CCSS / TEKS)', en: 'Math (CCSS / TEKS)' },
                        topicToday: { es: 'Fracciones, área y problemas de varios pasos', en: 'Fractions, area & multi-step word problems' },
                        samplePrompt: { es: 'Un jardín mide 3/4 de yarda por 2/3 de yarda. ¿Cuál es su área?', en: 'A garden is 3/4 yard by 2/3 yard. What is its area?' },
                        socraticHint: { es: 'Dibuja un rectángulo y divide un lado en 4 partes y el otro en 3.', en: 'Draw a rectangle: split one side into 4 parts and the other into 3.' },
                        catalogPath: '/us'
                    },
                    {
                        id: 'us-elem-ela',
                        icon: 'fa-book-open',
                        color: 'amber',
                        name: { es: 'English Language Arts', en: 'English Language Arts' },
                        topicToday: { es: 'Idea principal y evidencia textual', en: 'Main idea & citing text evidence' },
                        samplePrompt: { es: '¿Qué frase del párrafo 2 demuestra por qué migraron las mariposas?', en: 'Which sentence in paragraph 2 proves why the butterflies migrated?' },
                        socraticHint: { es: 'Busca pistas sobre temperatura o alimento en ese párrafo.', en: 'Look for clues about temperature or food in that paragraph.' },
                        catalogPath: '/us'
                    }
                ]
            },
            middle: {
                id: 'middle',
                label: { es: 'Middle School', en: 'Middle School (6-8)' },
                grades: { es: 'Grades 6 - 8', en: 'Grades 6 - 8' },
                subjects: [
                    {
                        id: 'us-mid-alg',
                        icon: 'fa-square-root-variable',
                        color: 'blue',
                        name: { es: 'Pre-Álgebra y Razones', en: 'Pre-Algebra & Ratios' },
                        topicToday: { es: 'Tasas unitarias, pendientes y ecuaciones lineales', en: 'Unit rates, slope & linear equations' },
                        samplePrompt: { es: 'Si 4 cuadernos cuestan $10.40, ¿cuánto cuestan 7 al mismo ritmo?', en: 'If 4 notebooks cost $10.40, how much do 7 cost at the same rate?' },
                        socraticHint: { es: 'Calcula primero cuánto cuesta 1 solo cuaderno.', en: 'Find the cost of 1 notebook first.' },
                        catalogPath: '/us'
                    },
                    {
                        id: 'us-mid-sci',
                        icon: 'fa-flask',
                        color: 'teal',
                        name: { es: 'Ciencias NGSS', en: 'NGSS Integrated Science' },
                        topicToday: { es: 'Fuerzas, energía térmica y estructura celular', en: 'Forces, thermal energy & cell structure' },
                        samplePrompt: { es: '¿Por qué una cuchara metálica se calienta más rápido que una de madera?', en: 'Why does a metal spoon heat up faster than a wooden one?' },
                        socraticHint: { es: 'Piensa en cómo se transfieren las vibraciones entre partículas en un conductor.', en: 'Think about how particle vibrations transfer in a conductor.' },
                        catalogPath: '/us'
                    }
                ]
            },
            high: {
                id: 'high',
                label: { es: 'High School & AP', en: 'High School & AP' },
                grades: { es: 'Grades 9 - 12', en: 'Grades 9 - 12' },
                subjects: [
                    {
                        id: 'us-hs-chem',
                        icon: 'fa-atom',
                        color: 'teal',
                        name: { es: 'Química / AP Chemistry', en: 'Chemistry / AP Chemistry' },
                        topicToday: { es: 'Estequiometría y reactivo limitante (FRQ)', en: 'Stoichiometry & limiting reactant (FRQ)' },
                        samplePrompt: { es: 'Con 2 mol de H₂ y 2 mol de O₂, ¿cuántos moles de H₂O se forman?', en: 'With 2 mol H₂ and 2 mol O₂, how many moles of H₂O form?' },
                        socraticHint: { es: 'Escribe primero la reacción ajustada: 2H₂ + O₂ → 2H₂O.', en: 'Write the balanced equation first: 2H₂ + O₂ → 2H₂O.' },
                        catalogPath: '/us'
                    },
                    {
                        id: 'us-hs-span',
                        icon: 'fa-comments',
                        color: 'indigo',
                        name: { es: 'AP Spanish & Dual Language', en: 'AP Spanish & Dual Language' },
                        topicToday: { es: 'Conversación simulada y ensayo argumentativo', en: 'Simulated conversation & argumentative essay' },
                        samplePrompt: { es: 'Responde en 20 segundos manteniendo el registro formal y conectores.', en: 'Respond in 20 seconds using formal register and transitions.' },
                        socraticHint: { es: 'Incluye un saludo adecuado y responde directamente a la pregunta del interlocutor.', en: 'Open with an appropriate greeting and answer the prompt directly.' },
                        catalogPath: '/us'
                    }
                ]
            }
        }
    },
    mx: {
        id: 'mx',
        flag: '🇲🇽',
        name: { es: 'México', en: 'Mexico' },
        standardLabel: { es: 'SEP · Nueva Escuela Mexicana (NEM)', en: 'SEP · Nueva Escuela Mexicana (NEM)' },
        catalogBase: '/es',
        stages: {
            primary: {
                id: 'primary',
                label: { es: 'Primaria', en: 'Primary (Fases 3-5)' },
                grades: { es: 'Fase 4 y 5 (3º - 6º)', en: 'Grades 3 - 6' },
                subjects: [
                    {
                        id: 'mx-pri-mat',
                        icon: 'fa-calculator',
                        color: 'emerald',
                        name: { es: 'Saberes y Pensamiento Científico', en: 'Math & Scientific Thinking' },
                        topicToday: { es: 'Fracciones, porcentajes y tablas de variación', en: 'Fractions, percentages & variation tables' },
                        samplePrompt: { es: 'Un producto cuesta $240 y tiene 15% de descuento. ¿Cuánto pagas al final?', en: 'An item costs $240 with a 15% discount. What is the final price?' },
                        socraticHint: { es: 'Calcula primero el 10% (24) y la mitad de eso (5%). Súmalos antes de restar.', en: 'Find 10% first, then half of that (5%), and add them.' },
                        catalogPath: '/es'
                    }
                ]
            },
            middle: {
                id: 'middle',
                label: { es: 'Secundaria', en: 'Secundaria (Fase 6)' },
                grades: { es: '1º - 3º Secundaria (Fase 6)', en: 'Grades 7 - 9 (Fase 6)' },
                subjects: [
                    {
                        id: 'mx-sec-fis',
                        icon: 'fa-flask',
                        color: 'emerald',
                        name: { es: 'Ciencias y Física', en: 'Science & Physics' },
                        topicToday: { es: 'Leyes de Newton, velocidad y conservación de energía', en: 'Newton laws, speed & energy conservation' },
                        samplePrompt: { es: 'Si empujas dos cajas con la misma fuerza y una pesa el doble, ¿cuál acelera más?', en: 'If you push two boxes with the same force and one has double the mass, which accelerates more?' },
                        socraticHint: { es: 'Recuerda la relación F = m · a: si F no cambia y m sube, ¿qué pasa con a?', en: 'Recall F = m · a: if F stays constant and m increases, what happens to a?' },
                        catalogPath: '/es'
                    },
                    {
                        id: 'mx-sec-mat',
                        icon: 'fa-square-root-variable',
                        color: 'blue',
                        name: { es: 'Matemáticas Secundaria', en: 'Secondary Math' },
                        topicToday: { es: 'Sistemas de ecuaciones y teorema de Pitágoras', en: 'Systems of equations & Pythagorean theorem' },
                        samplePrompt: { es: 'Una escalera de 5 m se apoya a 3 m de la pared. ¿A qué altura llega?', en: 'A 5 m ladder sits 3 m from a wall. How high does it reach?' },
                        socraticHint: { es: 'Identifica cuál lado es la hipotenusa (la escalera) antes de despejar.', en: 'Identify the hypotenuse (the ladder) before solving.' },
                        catalogPath: '/es'
                    }
                ]
            },
            high: {
                id: 'high',
                label: { es: 'Preparatoria', en: 'High School (EMS)' },
                grades: { es: 'Bachillerato · Preparatoria', en: 'Grades 10 - 12' },
                subjects: [
                    {
                        id: 'mx-ems-calc',
                        icon: 'fa-chart-line',
                        color: 'blue',
                        name: { es: 'Cálculo y Funciones', en: 'Calculus & Functions' },
                        topicToday: { es: 'Límites, razón de cambio y funciones', en: 'Limits, rate of change & functions' },
                        samplePrompt: { es: '¿Qué significa gráficamente que el límite por la izquierda sea distinto al de la derecha?', en: 'Graphically, what does it mean when left and right limits differ?' },
                        socraticHint: { es: 'Imagina seguir la gráfica con el dedo desde ambos lados hasta el punto x.', en: 'Trace the graph from both sides toward x.' },
                        catalogPath: '/es'
                    }
                ]
            }
        }
    },
    intl: {
        id: 'intl',
        flag: '🌐',
        name: { es: 'Internacional (IB)', en: 'International (IB)' },
        standardLabel: { es: 'Bachillerato Internacional (MYP & DP)', en: 'International Baccalaureate (MYP & DP)' },
        catalogBase: '/intl',
        stages: {
            primary: {
                id: 'primary',
                label: { es: 'PYP', en: 'IB PYP' },
                grades: { es: 'Primary Years', en: 'Primary Years' },
                subjects: [
                    {
                        id: 'ib-pyp-inq',
                        icon: 'fa-compass',
                        color: 'teal',
                        name: { es: 'Indagación y Matemáticas', en: 'Inquiry & Math' },
                        topicToday: { es: 'Patrones numéricos y resolución contextual', en: 'Number patterns & contextual inquiry' },
                        samplePrompt: { es: 'Explica qué patrón sigue la serie 2, 6, 12, 20, ...', en: 'Explain the pattern in 2, 6, 12, 20, ...' },
                        socraticHint: { es: 'Calcula la diferencia entre cada pareja de números consecutivos.', en: 'Find the difference between each pair of consecutive numbers.' },
                        catalogPath: '/intl'
                    }
                ]
            },
            middle: {
                id: 'middle',
                label: { es: 'MYP', en: 'IB MYP' },
                grades: { es: 'Middle Years (1-5)', en: 'Middle Years (1-5)' },
                subjects: [
                    {
                        id: 'ib-myp-sci',
                        icon: 'fa-microscope',
                        color: 'purple',
                        name: { es: 'Ciencias MYP (Criterios A-D)', en: 'MYP Sciences (Criteria A-D)' },
                        topicToday: { es: 'Diseño experimental e hipótesis variables', en: 'Experimental design & variables' },
                        samplePrompt: { es: 'Identifica la variable independiente, dependiente y de control en el experimento.', en: 'Identify the independent, dependent, and control variables.' },
                        socraticHint: { es: 'Pregúntate: ¿qué cambia el investigador a propósito y qué mide al final?', en: 'Ask: what does the researcher change on purpose, and what is measured?' },
                        catalogPath: '/intl'
                    }
                ]
            },
            high: {
                id: 'high',
                label: { es: 'IB Diploma', en: 'IB Diploma (DP)' },
                grades: { es: 'SL & HL', en: 'SL & HL' },
                subjects: [
                    {
                        id: 'ib-dp-span',
                        icon: 'fa-globe',
                        color: 'purple',
                        name: { es: 'IB Spanish B (SL / HL)', en: 'IB Spanish B (SL / HL)' },
                        topicToday: { es: 'Paper 1, comprensión y oral individual (IO)', en: 'Paper 1, reading & Individual Oral (IO)' },
                        samplePrompt: { es: 'Elige el tipo de texto adecuado para dirigirte al ayuntamiento sobre reciclaje.', en: 'Choose the right text type to address the city council about recycling.' },
                        socraticHint: { es: 'Fíjate en la relación emisor-receptor: ¿es una carta formal, un blog o un artículo?', en: 'Consider audience and purpose: formal letter, blog, or article?' },
                        catalogPath: '/intl'
                    }
                ]
            }
        }
    }
};
