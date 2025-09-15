import api from './Api';
import type {
  MedicalHistory,
  VitalSigns,
  Allergy,
  Immunization,
  FamilyHistory,
  SocialHistory,
  MedicalHistoryCreate,
  VitalSignsCreate,
  AllergyCreate,
  ImmunizationCreate,
  FamilyHistoryCreate,
  SocialHistoryCreate,
} from '../types/ehr';

export const ehrService = {
  // Medical History
  getMedicalHistories: async (patientId?: number): Promise<MedicalHistory[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/medical-history/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching medical histories:', error);
      throw error;
    }
  },

  getMedicalHistory: async (id: number): Promise<MedicalHistory> => {
    try {
      const response = await api.get(`/ehr/medical-history/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error;
    }
  },

  createMedicalHistory: async (data: MedicalHistoryCreate): Promise<MedicalHistory> => {
    try {
      const response = await api.post('/ehr/medical-history/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating medical history:', error);
      throw error;
    }
  },

  updateMedicalHistory: async (id: number, data: Partial<MedicalHistoryCreate>): Promise<MedicalHistory> => {
    try {
      const response = await api.put(`/ehr/medical-history/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error;
    }
  },

  deleteMedicalHistory: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/medical-history/${id}/`);
    } catch (error) {
      console.error('Error deleting medical history:', error);
      throw error;
    }
  },

  // Vital Signs
  getVitalSigns: async (patientId?: number): Promise<VitalSigns[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/vital-signs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      throw error;
    }
  },

  getVitalSign: async (id: number): Promise<VitalSigns> => {
    try {
      const response = await api.get(`/ehr/vital-signs/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vital sign:', error);
      throw error;
    }
  },

  createVitalSigns: async (data: VitalSignsCreate): Promise<VitalSigns> => {
    try {
      const response = await api.post('/ehr/vital-signs/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating vital signs:', error);
      throw error;
    }
  },

  updateVitalSigns: async (id: number, data: Partial<VitalSignsCreate>): Promise<VitalSigns> => {
    try {
      const response = await api.put(`/ehr/vital-signs/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating vital signs:', error);
      throw error;
    }
  },

  deleteVitalSigns: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/vital-signs/${id}/`);
    } catch (error) {
      console.error('Error deleting vital signs:', error);
      throw error;
    }
  },

  // Allergies
  getAllergies: async (patientId?: number): Promise<Allergy[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/allergies/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching allergies:', error);
      throw error;
    }
  },

  getAllergy: async (id: number): Promise<Allergy> => {
    try {
      const response = await api.get(`/ehr/allergies/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching allergy:', error);
      throw error;
    }
  },

  createAllergy: async (data: AllergyCreate): Promise<Allergy> => {
    try {
      const response = await api.post('/ehr/allergies/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating allergy:', error);
      throw error;
    }
  },

  updateAllergy: async (id: number, data: Partial<AllergyCreate>): Promise<Allergy> => {
    try {
      const response = await api.put(`/ehr/allergies/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating allergy:', error);
      throw error;
    }
  },

  deleteAllergy: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/allergies/${id}/`);
    } catch (error) {
      console.error('Error deleting allergy:', error);
      throw error;
    }
  },

  // Immunizations
  getImmunizations: async (patientId?: number): Promise<Immunization[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/immunizations/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching immunizations:', error);
      throw error;
    }
  },

  getImmunization: async (id: number): Promise<Immunization> => {
    try {
      const response = await api.get(`/ehr/immunizations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching immunization:', error);
      throw error;
    }
  },

  createImmunization: async (data: ImmunizationCreate): Promise<Immunization> => {
    try {
      const response = await api.post('/ehr/immunizations/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating immunization:', error);
      throw error;
    }
  },

  updateImmunization: async (id: number, data: Partial<ImmunizationCreate>): Promise<Immunization> => {
    try {
      const response = await api.put(`/ehr/immunizations/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating immunization:', error);
      throw error;
    }
  },

  deleteImmunization: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/immunizations/${id}/`);
    } catch (error) {
      console.error('Error deleting immunization:', error);
      throw error;
    }
  },

  // Family History
  getFamilyHistories: async (patientId?: number): Promise<FamilyHistory[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/family-history/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching family histories:', error);
      throw error;
    }
  },

  getFamilyHistory: async (id: number): Promise<FamilyHistory> => {
    try {
      const response = await api.get(`/ehr/family-history/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching family history:', error);
      throw error;
    }
  },

  createFamilyHistory: async (data: FamilyHistoryCreate): Promise<FamilyHistory> => {
    try {
      const response = await api.post('/ehr/family-history/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating family history:', error);
      throw error;
    }
  },

  updateFamilyHistory: async (id: number, data: Partial<FamilyHistoryCreate>): Promise<FamilyHistory> => {
    try {
      const response = await api.put(`/ehr/family-history/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating family history:', error);
      throw error;
    }
  },

  deleteFamilyHistory: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/family-history/${id}/`);
    } catch (error) {
      console.error('Error deleting family history:', error);
      throw error;
    }
  },

  // Social History
  getSocialHistories: async (patientId?: number): Promise<SocialHistory[]> => {
    try {
      const params = patientId ? { patient_id: patientId } : {};
      const response = await api.get('/ehr/social-history/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching social histories:', error);
      throw error;
    }
  },

  getSocialHistory: async (id: number): Promise<SocialHistory> => {
    try {
      const response = await api.get(`/ehr/social-history/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching social history:', error);
      throw error;
    }
  },

  createSocialHistory: async (data: SocialHistoryCreate): Promise<SocialHistory> => {
    try {
      const response = await api.post('/ehr/social-history/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating social history:', error);
      throw error;
    }
  },

  updateSocialHistory: async (id: number, data: Partial<SocialHistoryCreate>): Promise<SocialHistory> => {
    try {
      const response = await api.put(`/ehr/social-history/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating social history:', error);
      throw error;
    }
  },

  deleteSocialHistory: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ehr/social-history/${id}/`);
    } catch (error) {
      console.error('Error deleting social history:', error);
      throw error;
    }
  },
};