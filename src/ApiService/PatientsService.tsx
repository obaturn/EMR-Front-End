// services/patientService.ts
import api from './Api';

// Define interfaces for your patient data
export interface Patient {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;  // Changed from string to Date
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
   city?: string;

  pincode?: string;
  country?: string;
  remarks?: string;
  category?: string;
  aadhaar?: string;
  age?: number; // Add this field
  created_at?: string; // Add if needed
  updated_at?: string; // Add if needed
  // Add any other fields your patient object has
}

export interface PatientCreateData {
  first_name: string;
  last_name: string;
  date_of_birth: Date;  // Changed from string to Date
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  remarks?: string;
  category?: string;
  aadhaar?: string;
  age?: number; 
  created_at?: string; 
  updated_at?: string; 
}

export interface PatientUpdateData extends Partial<PatientCreateData> {
  id?: number;
}

// Helper function to convert date strings to Date objects
const parsePatientDates = (patient: any): Patient => {
  return {
    ...patient,
    date_of_birth: new Date(patient.date_of_birth),
  };
};

export const patientService = {
  // Get all patients
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get('/patients/');
      return response.data.map(parsePatientDates);
    } catch (error) {
      console.error('Error fetching patients:', error);
      console.log(error)
      throw error;
    }
  },

  // Get single patient
  getPatient: async (id: number): Promise<Patient> => {
    try {
      const response = await api.get(`/patients/${id}/`);
      return parsePatientDates(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  // Create new patient
  createPatient: async (patientData: PatientCreateData): Promise<Patient> => {
    try {
      // Convert Date object to ISO string for API
      const apiData = {
        ...patientData,
        date_of_birth: patientData.date_of_birth.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };
      
      const response = await api.post('/add-patient/', apiData);
      return parsePatientDates(response.data);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (id: number, patientData: PatientUpdateData): Promise<Patient> => {
    try {
      // Convert Date object to ISO string for API if provided
      const apiData = patientData.date_of_birth 
        ? {
            ...patientData,
            date_of_birth: patientData.date_of_birth.toISOString().split('T')[0] // Format as YYYY-MM-DD
          }
        : patientData;
      
      const response = await api.put(`/patients/${id}/update/`, apiData);
      return parsePatientDates(response.data);
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Delete patient
  deletePatient: async (id: number): Promise<void> => {
    try {
      const response = await api.delete(`/patients/${id}/delete/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};