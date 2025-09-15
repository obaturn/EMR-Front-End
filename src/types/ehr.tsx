// EHR Types
export interface MedicalHistory {
  id: number;
  patient: number;
  condition: string;
  diagnosis_date: string;
  status: 'active' | 'resolved' | 'chronic';
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
  created_by_name: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface VitalSigns {
  id: number;
  patient: number;
  recorded_at: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  temperature_unit: string;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recorded_by_name: string;
  recorded_by: number;
  notes: string;
}

export interface Allergy {
  id: number;
  patient: number;
  allergen: string;
  allergy_type: 'drug' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reaction: string;
  diagnosed_date?: string;
  status: 'active' | 'resolved';
  created_by_name: string;
  created_by: number;
  created_at: string;
}

export interface Immunization {
  id: number;
  patient: number;
  vaccine_name: string;
  vaccine_code?: string;
  administered_date: string;
  administered_by_name: string;
  administered_by: number;
  dose_number?: number;
  total_doses?: number;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  site?: string;
  notes?: string;
  created_at: string;
}

export interface FamilyHistory {
  id: number;
  patient: number;
  relationship: 'father' | 'mother' | 'brother' | 'sister' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt' | 'other';
  condition: string;
  age_at_diagnosis?: number;
  status: 'living' | 'deceased';
  notes: string;
  created_by_name: string;
  created_by: number;
  created_at: string;
}

export interface SocialHistory {
  id: number;
  patient: number;
  occupation?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
  education_level?: string;
  smoking_status?: 'never' | 'former' | 'current';
  alcohol_use?: 'none' | 'occasional' | 'moderate' | 'heavy';
  exercise_frequency?: 'none' | 'rare' | 'weekly' | 'daily';
  diet_type?: string;
  living_arrangements?: string;
  support_system?: string;
  updated_by_name: string;
  updated_by: number;
  updated_at: string;
  created_at: string;
}

// Create/Update interfaces
export interface MedicalHistoryCreate {
  patient: number;
  condition: string;
  diagnosis_date: string;
  status: 'active' | 'resolved' | 'chronic';
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface VitalSignsCreate {
  patient: number;
  recorded_at: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  temperature_unit?: string;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

export interface AllergyCreate {
  patient: number;
  allergen: string;
  allergy_type: 'drug' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reaction: string;
  diagnosed_date?: string;
  status?: 'active' | 'resolved';
}

export interface ImmunizationCreate {
  patient: number;
  vaccine_name: string;
  vaccine_code?: string;
  administered_date: string;
  dose_number?: number;
  total_doses?: number;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  site?: string;
  notes?: string;
}

export interface FamilyHistoryCreate {
  patient: number;
  relationship: 'father' | 'mother' | 'brother' | 'sister' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt' | 'other';
  condition: string;
  age_at_diagnosis?: number;
  status: 'living' | 'deceased';
  notes?: string;
}

export interface SocialHistoryCreate {
  patient: number;
  occupation?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
  education_level?: string;
  smoking_status?: 'never' | 'former' | 'current';
  alcohol_use?: 'none' | 'occasional' | 'moderate' | 'heavy';
  exercise_frequency?: 'none' | 'rare' | 'weekly' | 'daily';
  diet_type?: string;
  living_arrangements?: string;
  support_system?: string;
}