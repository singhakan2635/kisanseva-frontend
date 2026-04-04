import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, saveDiagnosis, clearHistory } from '@/services/diagnosisService';
import type { DiagnosisResult } from '@/services/diagnosisService';

function makeDiagnosisResult(name: string): DiagnosisResult {
  return {
    primaryDiagnosis: {
      name,
      nameHi: `${name}-hi`,
      scientificName: `Scientificus ${name}`,
      type: 'fungal',
      confidence: 0.9,
      severity: 'moderate',
    },
    differentialDiagnoses: [],
    visibleSymptoms: ['spots'],
    affectedPart: 'leaf',
    treatments: {
      mechanical: ['prune'],
      physical: ['remove'],
      chemical: [{ name: 'Fungicide', dosage: '2ml/L', applicationMethod: 'spray', frequency: 'weekly' }],
      biological: ['neem'],
    },
    recommendedPesticides: [],
    preventionTips: ['rotate crops'],
    sampleImages: [],
    disclaimer: 'Consult an expert',
  };
}

describe('diagnosisService - localStorage history', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getHistory returns empty array when no history exists', () => {
    expect(getHistory()).toEqual([]);
  });

  it('saveDiagnosis stores an item and getHistory retrieves it', () => {
    const result = makeDiagnosisResult('Late Blight');
    const saved = saveDiagnosis(result, 'data:image/jpeg;base64,abc');

    expect(saved.diseaseName).toBe('Late Blight');
    expect(saved.id).toMatch(/^diag_/);
    expect(saved.imageThumbnail).toBe('data:image/jpeg;base64,abc');

    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].diseaseName).toBe('Late Blight');
  });

  it('saveDiagnosis prepends new items (most recent first)', () => {
    saveDiagnosis(makeDiagnosisResult('Disease A'), 'thumb-a');
    saveDiagnosis(makeDiagnosisResult('Disease B'), 'thumb-b');

    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].diseaseName).toBe('Disease B');
    expect(history[1].diseaseName).toBe('Disease A');
  });

  it('clearHistory removes all items', () => {
    saveDiagnosis(makeDiagnosisResult('Disease'), 'thumb');
    expect(getHistory()).toHaveLength(1);

    clearHistory();
    expect(getHistory()).toEqual([]);
  });

  it('history respects max limit of 50', () => {
    for (let i = 0; i < 55; i++) {
      saveDiagnosis(makeDiagnosisResult(`Disease ${i}`), `thumb-${i}`);
    }
    const history = getHistory();
    expect(history).toHaveLength(50);
    // Most recent should be first
    expect(history[0].diseaseName).toBe('Disease 54');
  });

  it('getHistory returns empty array on corrupted JSON', () => {
    localStorage.setItem('kisanseva_diagnosis_history', 'not-valid-json');
    expect(getHistory()).toEqual([]);
  });

  it('saveDiagnosis includes all required fields', () => {
    const saved = saveDiagnosis(makeDiagnosisResult('Rust'), 'thumb');
    expect(saved).toHaveProperty('id');
    expect(saved).toHaveProperty('diseaseName', 'Rust');
    expect(saved).toHaveProperty('diseaseNameHi', 'Rust-hi');
    expect(saved).toHaveProperty('severity', 'moderate');
    expect(saved).toHaveProperty('confidence', 0.9);
    expect(saved).toHaveProperty('type', 'fungal');
    expect(saved).toHaveProperty('createdAt');
    expect(saved).toHaveProperty('result');
  });
});
