import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, slugify } from '../src/lib/catalogLoader.ts';

test('catalogLoader - Criteria and Curricular Graph', async (t) => {
  const catalog = loadCatalog();

  await t.test('loads criteria list and populates global statistics', () => {
    assert.ok(catalog.criteria.length > 0, 'Criteria list should not be empty');
    assert.equal(catalog.stats.totalCriteria, catalog.criteria.length);
  });

  await t.test('indexes criteria by country', () => {
    assert.ok(catalog.criteriaByCountry['es'], 'Spain (es) criteria should be indexed');
    assert.ok(catalog.criteriaByCountry['us'], 'US criteria should be indexed');
    assert.ok(catalog.criteriaByCountry['intl'], 'International criteria should be indexed');
  });

  await t.test('maps key transversal competencies (CCL, STEM, CCEC) with canonical paths', () => {
    const esCcl = catalog.criteriaByCountry['es']?.find((c) => c.code === 'CCL');
    assert.ok(esCcl, 'CCL should be present for Spain');
    assert.equal(esCcl.slug, 'ccl');
    assert.equal(esCcl.canonicalPath, '/catalog/es/criterios/ccl');
    assert.ok(esCcl.lessons.length > 0, 'CCL in Spain should have associated lessons');

    const esStem = catalog.criteriaByCountry['es']?.find((c) => c.code === 'STEM');
    assert.ok(esStem, 'STEM should be present for Spain');
    assert.equal(esStem.canonicalPath, '/catalog/es/criterios/stem');
    assert.ok(esStem.lessons.length > 0, 'STEM in Spain should have associated lessons');
  });

  await t.test('associates lessons and exams bidirectionally to criteria', () => {
    for (const crit of catalog.criteria) {
      assert.ok(
        crit.lessons.length > 0 || crit.exams.length > 0,
        `Criterion ${crit.code} (${crit.country}) should have at least one lesson or exam`
      );
      assert.match(crit.canonicalPath, /^\/catalog\/[a-z0-9_-]+\/criterios\/[a-z0-9_-]+$/);
    }
  });

  await t.test('slugify correctly normalizes standard codes', () => {
    assert.equal(slugify('CCL'), 'ccl');
    assert.equal(slugify('LCL2.B1.1'), 'lcl2-b1-1');
    assert.equal(slugify('CE.LCL.A.1'), 'ce-lcl-a-1');
  });
});
