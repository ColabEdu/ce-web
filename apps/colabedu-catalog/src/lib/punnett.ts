export const PUNNETT_WIDGET_TYPES = new Set([
  'punnett_square_interactive',
  'punnett_square',
  'punnett_square_widget',
  'core.etype.punnett_square_interactive.v1',
  'mendel_punnett',
]);

export function isPunnettWidgetType(type?: unknown): boolean {
  return typeof type === 'string' && PUNNETT_WIDGET_TYPES.has(type.trim());
}

export function extractGametes(genotype: string): string[] {
  const g = (genotype || '').replace(/\s+/g, '');
  if (g.length === 4) {
    return [
      `${g[0]}${g[2]}`,
      `${g[0]}${g[3]}`,
      `${g[1]}${g[2]}`,
      `${g[1]}${g[3]}`,
    ];
  }
  if (g.length === 2) {
    return [g[0], g[1]];
  }
  return ['A', 'a'];
}

export function combineGametes(g1: string, g2: string): string {
  const raw = `${g1}${g2}`;
  if (raw.length === 2) {
    if (raw[0].toLowerCase() === raw[0] && raw[1].toUpperCase() === raw[1]) {
      return `${raw[1]}${raw[0]}`;
    }
    return raw;
  }
  if (raw.length === 4) {
    const firstLocus: string[] = [];
    const secondLocus: string[] = [];
    const firstCharLower = raw[0].toLowerCase();
    for (const ch of raw) {
      if (ch.toLowerCase() === firstCharLower) {
        firstLocus.push(ch);
      } else {
        secondLocus.push(ch);
      }
    }
    const sortAlleles = (a: string, b: string) =>
      a.toUpperCase() === a && b.toUpperCase() !== b ? -1 : a.toUpperCase() !== a && b.toUpperCase() === b ? 1 : 0;
    firstLocus.sort(sortAlleles);
    secondLocus.sort(sortAlleles);
    return `${firstLocus.join('')}${secondLocus.join('')}`;
  }
  return raw;
}

export interface PunnettProps {
  title?: string;
  description?: string;
  crossType?: string;
  maternalGenotype?: string;
  paternalGenotype?: string;
  dominantTraitName?: string;
  recessiveTraitName?: string;
  mode?: string;
  maxScore?: number;
}

export interface PunnettModel {
  title: string;
  description: string;
  crossType: 'MONOHYBRID' | 'DIHYBRID';
  maternalGenotype: string;
  paternalGenotype: string;
  dominantTraitName: string;
  recessiveTraitName: string;
  mode: 'lesson' | 'exercise';
  maxScore: number;
  matGametes: string[];
  patGametes: string[];
  expectedGrid: string[][];
  genotypeCounts: Record<string, number>;
}

export function buildPunnettModel(props: PunnettProps = {}): PunnettModel {
  const maternalGenotype = props.maternalGenotype || 'Aa';
  const paternalGenotype = props.paternalGenotype || 'Aa';
  const matGametes = extractGametes(maternalGenotype);
  const patGametes = extractGametes(paternalGenotype);
  const isDihybrid =
    (props.crossType || '').toUpperCase() === 'DIHYBRID' ||
    matGametes.length === 4 ||
    patGametes.length === 4;

  const expectedGrid = matGametes.map((mg) =>
    patGametes.map((pg) => combineGametes(mg, pg)),
  );

  const genotypeCounts: Record<string, number> = {};
  for (const row of expectedGrid) {
    for (const cell of row) {
      genotypeCounts[cell] = (genotypeCounts[cell] || 0) + 1;
    }
  }

  return {
    title: props.title || 'Cuadro de Punnett: Genética Mendeliana',
    description: props.description || '',
    crossType: isDihybrid ? 'DIHYBRID' : 'MONOHYBRID',
    maternalGenotype,
    paternalGenotype,
    dominantTraitName: props.dominantTraitName || 'Fenotipo Dominante',
    recessiveTraitName: props.recessiveTraitName || 'Fenotipo Recesivo',
    mode: props.mode === 'lesson' ? 'lesson' : 'exercise',
    maxScore: typeof props.maxScore === 'number' ? props.maxScore : 1.0,
    matGametes,
    patGametes,
    expectedGrid,
    genotypeCounts,
  };
}

export interface PunnettEvaluation {
  correct: boolean;
  score: number;
  maxScore: number;
  correctCells: number;
  totalCells: number;
  matGametesOk: boolean[];
  patGametesOk: boolean[];
  cellOk: boolean[][];
}

export function evaluatePunnettSubmission(
  model: PunnettModel,
  submittedMatGametes: string[],
  submittedPatGametes: string[],
  submittedGrid: string[][],
): PunnettEvaluation {
  const matGametesOk = model.matGametes.map(
    (g, i) => (submittedMatGametes[i] || '').trim() === g,
  );
  const patGametesOk = model.patGametes.map(
    (g, j) => (submittedPatGametes[j] || '').trim() === g,
  );

  let correctCells = 0;
  const totalCells = model.matGametes.length * model.patGametes.length;
  const cellOk = model.expectedGrid.map((row, r) =>
    row.map((expected, c) => {
      const ok = (submittedGrid[r]?.[c] || '').trim() === expected;
      if (ok) correctCells++;
      return ok;
    }),
  );

  const allGametesOk =
    matGametesOk.every(Boolean) && patGametesOk.every(Boolean);
  const correct = allGametesOk && correctCells === totalCells;

  let score = 0;
  if (totalCells > 0) {
    const ratio = correctCells / totalCells;
    score = Number((ratio * model.maxScore * (allGametesOk ? 1.0 : 0.8)).toFixed(2));
  }

  return {
    correct,
    score,
    maxScore: model.maxScore,
    correctCells,
    totalCells,
    matGametesOk,
    patGametesOk,
    cellOk,
  };
}
