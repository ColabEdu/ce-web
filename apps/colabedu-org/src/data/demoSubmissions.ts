// ce-web/apps/colabedu-org/src/data/demoSubmissions.ts
//
// frente a rúbricas canónicas (LOMLOE 1º ESO, EBAU, IB Diploma).

export interface DemoSubmission {
    id: string;
    title: string;
    shortTitle: string;
    badge: string;
    badgeColor: 'emerald' | 'amber' | 'rose' | 'indigo';
    icon: string;
    author: string;
    targetLesson: string;
    lessonTitle: string;
    rubricStandard: string;
    expectedScore: string;
    expectedLevel: string;
    slideIndex: number;
    slideId: string;
    activityType: 'essay' | 'oral';
    type: 'text' | 'manuscript_ocr' | 'remediation' | 'oral';
    previewDescription: string;
    content: string;
    educationalNotes: string;
    imageUrl?: string;
    audioUrl?: string;
}

export const DEMO_SUBMISSIONS: DemoSubmission[] = [
    {
        id: 'manuscrito_ocr_laboratorio',
        title: 'Foto de Manuscrito con Borrones y OCR (Guerra Civil y Consecuencias)',
        shortTitle: '✍️ Foto Manuscrito OCR',
        badge: 'OCR con Errores · 6.8/10',
        badgeColor: 'indigo',
        icon: '📷',
        author: 'Mateo N. (Cuaderno Pautado / Gemini OCR)',
        targetLesson: 'es.lomloe.eso1.lcl.unidad_3.socratic.v1',
        lessonTitle: 'Unidad 3 · Taller de Ensayo Escrito e Histórico',
        rubricStandard: 'standard.lomloe.es:lcl.eso1.escritura_formal.v1 (Criterio 5.1 & 5.2)',
        expectedScore: '6.8 / 10',
        expectedLevel: 'Nivel 2-3 · Bien / Notable en Progreso',
        slideIndex: 5,
        slideId: 'slide_06_carta_formal',
        activityType: 'essay',
        type: 'manuscript_ocr',
        imageUrl: '/demos/samples/manuscrito_ensayo_guerra_civil.jpg',
        previewDescription: 'Fotografía cenital de un cuaderno con renglones manuscrito en bolígrafo azul. Contiene tachaduras, autocorrecciones ortográficas ("tubo / tuvo") y deslices sintácticos capturados fielmente por el motor OCR.',
        content: `Martes 14 de Noviembre - Historia España
Ensayo: La Guerra Civil y sus Consecuencias

En este ensayo voy a hablar sobre la Guerra Civil Española (1936-1939), un conflicto que cambió radicalmente el país y que tubo y que tuvo consecuencias devastadoras que aún hoy se sienten.
Las causas fueron complejas, marcadas por la inestabilidad política, las tensiones sociales entre ricos propietarios y trabajadores, y la polarización ideológica.
Fue una lucha entre el bando republicano, que defendía la democracia y el gobierno electo, y el bando sublevado, liderado por el general Franco, que representaba a las fuerzas conservadoras y la iglesia.
La guerra duró tres años y fue muy extremadamente sanguinaria, provocando millones de muertes y un gran exilio. Muchas personas tuvieron que huir al extranjero para escapar de la represión.
Tras la victoria franquista en 1939, España entró en una larga dictadura que duró casi 40 años. Las consecuencias fueron terribles: aislamiento internacional, represión cultural (especialmente en Cataluña y País Vasco) y la supresión de derechos básicos. Fue una época oscura de nuestra historia.
La transición a la democracia tras la muerte de Franco en 1975 fue un paso crucial, pero las heridas de la guerra y la dictadura nunca se aún persisten en la sociedad española.`,
        educationalNotes: 'Permite comprobar cómo la IA no solo extrae el texto de la imagen del cuaderno sino que identifica correcciones sobre la marcha ("tubo / tuvo"), palabras tachadas ("propietancios") y construcciones truncadas ("nunca se aún persisten"), asignando un 6.8 formativo.',
    },
    {
        id: 'oral_alocucion_formal',
        title: 'Audio Oral Sintético con Vacilaciones y Jerga Juvenil (Voz Joven)',
        shortTitle: '🎙️ Audio Oral con Fallos',
        badge: 'Oralidad Remedial · 5.6/10',
        badgeColor: 'amber',
        icon: '🎧',
        author: 'Álvaro S. (1º ESO · Voz Sintética)',
        targetLesson: 'es.lomloe.eso1.lcl.unidad_3.socratic.v1',
        lessonTitle: 'Unidad 3 · Creación oral: Presentación ante el auditorio',
        rubricStandard: 'standard.lomloe.es:lcl.eso1.oratoria_formal.v1 (Criterio 3.1 & 3.2)',
        expectedScore: '5.6 / 10',
        expectedLevel: 'Banda 2 · Suficiente / Requiere Remediación',
        slideIndex: 11,
        slideId: 'slide_12_creacion_oral_tutankamon',
        activityType: 'oral',
        type: 'oral',
        audioUrl: '/demos/samples/audio_oral_joven_tecnologia.mp3',
        previewDescription: 'Grabación de voz de un estudiante joven con vacilaciones ("eh...", "o sea"), muletillas de relleno ("¿sabes?", "pues") y léxico coloquial ("postureo", "chavales") evaluada bajo Criterios 3.1 y 3.2 LOMLOE.',
        content: `Bueno, eh... voy a hablar sobre el impacto de la tecnología en los jóvenes de hoy.
O sea, yo creo que las redes sociales... bueno, tienen cosas buenas, como que puedes hablar con tus amigos y ver vídeos graciosos. Pero también, o sea, la gente se pasa demasiadas horas pegada a la pantalla y eso hace que no estudien y tengan más problemas para concentrarse, ¿sabes?
Además, eh... en mi opinión personal, se ve mucho postureo y cosas falsas que hacen que algunos chavales se sientan mal con su físico. 
Entonces, como conclusión final, yo diría que la tecnología no es que sea mala en sí, pero deberíamos usarla con más cabeza y que los padres o los profesores nos enseñaran a controlar los tiempos, porque si no, pues te enganchas muy fácil.`,
        educationalNotes: 'El motor detecta titubeos fonéticos, muletillas ("o sea", "¿sabes?") y vocabulario informal ("postureo", "chavales"), otorgando 5.6 y desplegando un plan socrático con tarjetas de sustitución léxica para elevar el registro.',
    },
    {
        id: 'sobresaliente_instancia',
        title: 'Instancia Formal Administrativa (Sobresaliente Canónico · 9.2/10)',
        shortTitle: '📄 Instancia Formal',
        badge: 'Sobresaliente (9.2 / 10)',
        badgeColor: 'emerald',
        icon: '📄',
        author: 'Sofía Alarcón (1º ESO)',
        targetLesson: 'es.lomloe.eso1.lcl.unidad_3.socratic.v1',
        lessonTitle: 'Unidad 3 · Textos Formales: La correspondencia oficial',
        rubricStandard: 'standard.lomloe.es:lcl.eso1.escritura_formal.v1 (Criterio 5.1 & 5.2)',
        expectedScore: '9.2 / 10',
        expectedLevel: 'Nivel 4 · Excelente',
        slideIndex: 5,
        slideId: 'slide_06_carta_formal',
        activityType: 'essay',
        type: 'text',
        previewDescription: 'Redacción canónica con estructura en tres bloques reglamentarios (Identificación, EXPONE y SOLICITA), fórmulas de cortesía y subordinación sintáctica rigurosa.',
        content: `D./Dña. Sofía Alarcón, alumna de 1.º de ESO del IES Rosalía de Castro, con domicilio a efectos de notificaciones en el centro educativo, ante doña Julia Álvarez, Directora de la Biblioteca Municipal García Lorca, comparece y respetuosamente EXPONE:

Que con motivo de la conmemoración de la Semana del Libro, el grupo de teatro escolar de nuestro instituto ha preparado una adaptación respetuosa de una selección de entremeses de Miguel de Cervantes ("El retablo de las maravillas" y "La cueva de Salamanca").

Que el salón de actos de la Biblioteca Municipal reúne las condiciones acústicas e institucionales idóneas para abrir dicha manifestación cultural a las familias del municipio y fomentar el gusto por los clásicos del Siglo de Oro entre la comunidad escolar.

Por todo lo anterior, SOLICITA:

Que se admita a trámite el presente escrito y se autorice la cesión temporal del espacio escénico durante la tarde del 23 de abril, facilitando el acceso técnico necesario para el montaje teatral.

En Madrid, a 26 de octubre de 2026.
Atentamente,
Sofía Alarcón`,
        educationalNotes: 'Demuestra dominio pleno del registro formal, delimitación nítida de hechos en el EXPONE y petición unívoca en el SOLICITA. La IA le otorga 4.6/5.0 en Criterio 5.1 y 4.6/5.0 en Criterio 5.2.',
    },
    {
        id: 'remediacion_coloquial',
        title: 'Ensayo con Deficiencias de Registro (Necesita Remediación)',
        shortTitle: '⚠️ Requiere Remediación',
        badge: 'Feedback Formativo · 4.8/10',
        badgeColor: 'rose',
        icon: '⚠️',
        author: 'Lucas P. (Caso de Estudio Remedial)',
        targetLesson: 'es.lomloe.eso1.lcl.unidad_3.socratic.v1',
        lessonTitle: 'Unidad 3 · Textos Formales: La correspondencia oficial',
        rubricStandard: 'standard.lomloe.es:lcl.eso1.escritura_formal.v1 (Criterio 5.1 & 5.2)',
        expectedScore: '4.8 / 10',
        expectedLevel: 'Nivel 2 · Básico / Requiere Reescritura',
        slideIndex: 5,
        slideId: 'slide_06_carta_formal',
        activityType: 'essay',
        type: 'remediation',
        previewDescription: 'Redacción que mezcla registro informal ("a ver si nos ponen", "hace un calor insoportable") y carece de fórmulas protocolarias en la petición, activando el plan de vuelo.',
        content: `Hola doña Julia directora de la biblioteca,
Soy Lucas del instituto y le escribo esta carta formal para pedirle que nos deje el salón de actos para hacer teatro con los entremeses de Cervantes el día del libro.

Es que en el instituto no tenemos sitio y además los bancos del patio están rotos y no se puede ensayar porque hace mucho calor y las persianas están estropeadas. Mis compañeros de clase y yo queremos actuar porque nos hemos aprendido los papeles muy bien y el profe de lengua nos dijo que habláramos con usted a ver si nos puede dejar la biblioteca una tarde.

A ver si nos puede responder pronto y nos dice qué día podemos ir a ensayar.
Adiós y gracias.
Lucas`,
        educationalNotes: 'Demuestra la potencia del motor para detectar oscilaciones coloquiales ("a ver si", "hola doña Julia", "adiós y gracias") sin limitarse a corregir la ortografía: activa preguntas socráticas y un plan de reescritura guiado.',
    },
];

export function getDemoSubmissionById(id: string): DemoSubmission | undefined {
    return DEMO_SUBMISSIONS.find((s) => s.id === id);
}
