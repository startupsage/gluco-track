export type ReadingType = 'fasting' | 'post-prandial' | 'random';

export interface GlucoseLog {
  id?: number;
  value: number;
  type: ReadingType;
  timestamp: Date;
  source: 'manual' | 'scan';
  notes?: string;
}

export interface UserProfile {
  id?: number;
  name: string;
  diabetesType: 'Type 1' | 'Type 2' | 'Pre-diabetic' | 'Gestational';
  targetFastingMin: number;
  targetFastingMax: number;
  targetPostPrandialMin: number;
  targetPostPrandialMax: number;
  unit: 'mg/dL' | 'mmol/L';
  photo?: string; // Base64 string
}
