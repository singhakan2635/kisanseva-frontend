import { apiClient } from './api';
import i18n from '@/i18n';
import type { ApiResponse } from '@/types';

// ─── Types matching backend DiagnosisResult ──────────────────────────────────

export interface ChemicalTreatmentInfo {
  name: string;
  dosage: string;
  applicationMethod: string;
  frequency: string;
}

export interface RecommendedPesticide {
  name: string;
  tradeName: string[];
  dosage: { perLiter: string; perAcre: string };
  safetyPrecautions: string[];
}

export interface DiagnosisResult {
  primaryDiagnosis: {
    name: string;
    nameHi: string;
    scientificName: string;
    type: 'fungal' | 'bacterial' | 'viral' | 'deficiency' | 'pest' | 'unknown';
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe' | 'critical' | 'healthy';
  };
  isHealthy: boolean;
  isPlantImage: boolean;
  healthyMessage?: string;
  differentialDiagnoses: Array<{ name: string; confidence: number }>;
  visibleSymptoms: string[];
  affectedPart: string;
  treatments: {
    mechanical: string[];
    physical: string[];
    chemical: ChemicalTreatmentInfo[];
    biological: string[];
  };
  recommendedPesticides: RecommendedPesticide[];
  preventionTips: string[];
  farmerSummary?: string;
  sampleImages: Array<{ url: string; caption: string }>;
  disclaimer: string;
}

// ─── LocalStorage history ────────────────────────────────────────────────────

const HISTORY_KEY = 'fasalrakshak_diagnosis_history';
const MAX_HISTORY = 50;

export interface DiagnosisHistoryItem {
  id: string;
  diseaseName: string;
  diseaseNameHi: string;
  severity: string;
  confidence: number;
  type: string;
  imageThumbnail: string; // base64 data URL
  createdAt: string;
  result: DiagnosisResult;
}

export function getHistory(): DiagnosisHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDiagnosis(
  result: DiagnosisResult,
  imageThumbnail: string
): DiagnosisHistoryItem {
  const item: DiagnosisHistoryItem = {
    id: `diag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    diseaseName: result.primaryDiagnosis.name,
    diseaseNameHi: result.primaryDiagnosis.nameHi,
    severity: result.primaryDiagnosis.severity,
    confidence: result.primaryDiagnosis.confidence,
    type: result.primaryDiagnosis.type,
    imageThumbnail,
    createdAt: new Date().toISOString(),
    result,
  };

  const history = getHistory();
  history.unshift(item);
  // Keep only the latest entries
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return item;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ─── Create a thumbnail from an image file ───────────────────────────────────

export function createThumbnail(
  file: File,
  maxSize = 120
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string); // fallback to full image
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── API calls ───────────────────────────────────────────────────────────────

/** Upload image for AI diagnosis */
export async function analyzePlantImage(
  imageFile: File,
  cropName?: string
): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (cropName) formData.append('cropName', cropName);
  formData.append('language', i18n.language || 'en');

  const res = await apiClient<ApiResponse<DiagnosisResult>>(
    '/diagnosis/analyze',
    {
      method: 'POST',
      body: formData,
      // Don't set Content-Type — browser sets it with boundary for FormData
    }
  );

  if (!res.success) throw new Error(res.message || 'Diagnosis failed');
  return res.data;
}

/** Get diseases by crop name */
export async function getDiseasesByCrop(crop: string) {
  return apiClient<ApiResponse<unknown[]>>(
    `/diagnosis/diseases?crop=${encodeURIComponent(crop)}`
  );
}

/** Search diseases */
export async function searchDiseases(query: string) {
  return apiClient<ApiResponse<unknown[]>>(
    `/diagnosis/search?q=${encodeURIComponent(query)}`
  );
}
