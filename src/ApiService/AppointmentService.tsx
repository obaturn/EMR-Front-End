
import api from './Api';
import type { Appointment, Patient, AppointmentCreateData, PatientCreateData, InvitationStatus, InvitationCreateData } from '../types/appointment';

export interface AvailableSlotsResponse {
  available_slots: string[];
}

export const appointmentService = {
  // Fetch all appointments, optionally filtered by date
  getAppointments: async (date?: string): Promise<Appointment[]> => {
    try {
      const params = date ? { date } : {};
      const response = await api.get('/appointments/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Fetch a single appointment by ID
  getAppointment: async (id: number): Promise<Appointment> => {
    try {
      const response = await api.get(`/appointments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData: AppointmentCreateData): Promise<Appointment> => {
    try {
      const response = await api.post('/appointments/create/', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update an existing appointment
  updateAppointment: async (id: number, appointmentData: Partial<AppointmentCreateData>): Promise<Appointment> => {
    try {
      const response = await api.patch(`/appointments/${id}/update/`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete an appointment
  deleteAppointment: async (id: number): Promise<void> => {
    try {
      await api.delete(`/appointments/${id}/delete/`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Fetch available time slots for a given date
  getAvailableSlots: async (date: string): Promise<AvailableSlotsResponse> => {
    try {
      const response = await api.get('/available-slots/', { params: { date } });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Fetch all patients
  getPatients: async (searchTerm?: string): Promise<Patient[]> => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await api.get('/patients/', { params });
      return response.data.map((p: any) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        phone: p.phone,
        dateOfBirth: p.dob,
        age: p.age || null,
        gender: p.gender,
        address: p.address,
        city: p.city || null,
        pincode: p.pincode || null,
        aadhaar: p.aadhaar || null,
        remarks: p.remarks || null,
        category: p.category || 'General',
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Create a new patient
  createPatient: async (patientData: PatientCreateData): Promise<Patient> => {
    try {
      const response = await api.post('/add-patient/', patientData);
      const p = response.data;
      return {
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        phone: p.phone,
        dateOfBirth: p.dob,
        age: p.age || null,
        gender: p.gender,
        address: p.address,
        city: p.city || null,
        pincode: p.pincode || null,
        aadhaar: p.aadhaar || null,
        remarks: p.remarks || null,
        category: p.category || 'General',
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Fetch all invitations
  getInvitations: async (): Promise<InvitationStatus[]> => {
    try {
      const response = await api.get('/invitations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
  },

  // Create a new invitation
  createInvitation: async (invitationData: InvitationCreateData): Promise<InvitationStatus> => {
    try {
      const response = await api.post('/invitations/create/', invitationData);
      return response.data;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  },
};
