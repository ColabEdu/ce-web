import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPunnettWidgetType,
  extractGametes,
  combineGametes,
  buildPunnettModel,
  evaluatePunnettSubmission,
} from '../src/lib/punnett.ts';

describe('punnett.ts - Mendelian Punnett Square logic for Astro SSG', () => {
  it('recognizes all punnett_square widget aliases', () => {
    assert.equal(isPunnettWidgetType('punnett_square_interactive'), true);
    assert.equal(isPunnettWidgetType('punnett_square_widget'), true);
    assert.equal(isPunnettWidgetType('punnett_square'), true);
    assert.equal(isPunnettWidgetType('core.etype.punnett_square_interactive.v1'), true);
    assert.equal(isPunnettWidgetType('mendel_punnett'), true);
    assert.equal(isPunnettWidgetType('quiz_widget'), false);
  });

  it('builds a 2x2 monohybrid Aa x Aa model with 1:2:1 genotypic ratios', () => {
    const model = buildPunnettModel({
      maternalGenotype: 'Aa',
      paternalGenotype: 'Aa',
      mode: 'exercise',
      maxScore: 2.0,
    });
    assert.equal(model.crossType, 'MONOHYBRID');
    assert.deepEqual(model.matGametes, ['A', 'a']);
    assert.deepEqual(model.patGametes, ['A', 'a']);
    assert.deepEqual(model.expectedGrid, [
      ['AA', 'Aa'],
      ['Aa', 'aa'],
    ]);
    assert.deepEqual(model.genotypeCounts, { AA: 1, Aa: 2, aa: 1 });
  });

  it('builds a 4x4 dihybrid AaBb x AaBb model with 16 zygotes', () => {
    assert.deepEqual(extractGametes('AaBb'), ['AB', 'Ab', 'aB', 'ab']);
    assert.equal(combineGametes('ab', 'AB'), 'AaBb');
    const model = buildPunnettModel({
      crossType: 'DIHYBRID',
      maternalGenotype: 'AaBb',
      paternalGenotype: 'AaBb',
      mode: 'lesson',
    });
    assert.equal(model.crossType, 'DIHYBRID');
    assert.equal(model.expectedGrid.length, 4);
    assert.equal(model.expectedGrid[0].length, 4);
    assert.equal(model.expectedGrid[0][0], 'AABB');
    assert.equal(model.expectedGrid[3][3], 'aabb');
  });

  it('evaluates student submissions deterministically (case-sensitive)', () => {
    const model = buildPunnettModel({
      maternalGenotype: 'Aa',
      paternalGenotype: 'Aa',
      maxScore: 2.0,
    });
    const ok = evaluatePunnettSubmission(
      model,
      ['A', 'a'],
      ['A', 'a'],
      [
        ['AA', 'Aa'],
        ['Aa', 'aa'],
      ],
    );
    assert.equal(ok.correct, true);
    assert.equal(ok.score, 2.0);
    assert.equal(ok.correctCells, 4);

    const partial = evaluatePunnettSubmission(
      model,
      ['A', 'a'],
      ['A', 'a'],
      [
        ['AA', 'aa'],
        ['Aa', 'aa'],
      ],
    );
    assert.equal(partial.correct, false);
    assert.equal(partial.correctCells, 3);
    assert.equal(partial.score, 1.5);
  });
});
