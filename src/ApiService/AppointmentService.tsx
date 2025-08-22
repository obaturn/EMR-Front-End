import api from './Api';
import type { Appointment, Patient, AppointmentCreateData, PatientCreateData, InvitationStatus, InvitationCreateData } from '../types/appointment';

export interface AvailableSlotsResponse {
  available_slots: string[];
}

export const appointmentService = {
  // Fetch all appointments, optionally filtered by date or patient_id
  getAppointments: async (date?: string, patientId?: number): Promise<Appointment[]> => {
    try {
      const params: { date?: string; patient_id?: number } = {};
      if (date) params.date = date;
      if (patientId) params.patient_id = patientId;
      const response = await api.get('/appointments/', { params });
      return response.data.map((apt: any) => ({
        id: Number(apt.id),
        patientId: Number(apt.patient_id),
        patient: {
          id: Number(apt.patient.id),
          name: apt.patient_name || `${apt.patient.first_name} ${apt.patient.last_name}`,
          first_name: apt.patient.first_name,
          last_name: apt.patient.last_name,
          email: apt.patient.email || undefined,
          phone: apt.patient.phone || undefined,
          dateOfBirth: apt.patient.dob || undefined,
          age: apt.patient.age || undefined,
          gender: apt.patient.gender || undefined,
          address: apt.patient.address || undefined,
          city: apt.patient.city || undefined,
          pincode: apt.patient.pincode || undefined,
          aadhaar: apt.patient.aadhaar || undefined,
          remarks: apt.patient.remarks || undefined,
          category: apt.patient.category || 'General',
          createdAt: apt.patient.created_at,
          updatedAt: apt.patient.updated_at,
        },
        date: apt.date,
        time: apt.time,
        duration: Number(apt.duration),
        type: apt.type,
        status: apt.status,
        doctorName: apt.doctor_name || 'Unknown',
        symptoms: apt.symptoms || undefined,
        notes: apt.notes || undefined,
        diagnosis: apt.diagnosis || undefined,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Fetch appointments for a specific patient
  getPatientAppointments: async (patientId: number): Promise<Appointment[]> => {
    try {
      return await appointmentService.getAppointments(undefined, patientId);
    } catch (error) {
      console.error(`Error fetching appointments for patient ${patientId}:`, error);
      throw error;
    }
  },

  // Fetch a single appointment by ID
  getAppointment: async (id: number): Promise<Appointment> => {
    try {
      const response = await api.get(`/appointments/${id}/`);
      const apt = response.data;
      return {
        id: Number(apt.id),
        patientId: Number(apt.patient_id),
        patient: {
          id: Number(apt.patient.id),
          name: apt.patient_name || `${apt.patient.first_name} ${apt.patient.last_name}`,
          first_name: apt.patient.first_name,
          last_name: apt.patient.last_name,
          email: apt.patient.email || undefined,
          phone: apt.patient.phone || undefined,
          dateOfBirth: apt.patient.dob || undefined,
          age: apt.patient.age || undefined,
          gender: apt.patient.gender || undefined,
          address: apt.patient.address || undefined,
          city: apt.patient.city || undefined,
          pincode: apt.patient.pincode || undefined,
          aadhaar: apt.patient.aadhaar || undefined,
          remarks: apt.patient.remarks || undefined,
          category: apt.patient.category || 'General',
          created_at: apt.patient.created_at,
          updated_at: apt.patient.updated_at,
        },
        date: apt.date,
        time: apt.time,
        duration: Number(apt.duration),
        type: apt.type,
        status: apt.status,
        doctorName: apt.doctor_name || 'Unknown',
        symptoms: apt.symptoms || undefined,
        notes: apt.notes || undefined,
        diagnosis: apt.diagnosis || undefined,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData: AppointmentCreateData): Promise<Appointment> => {
    try {
      const response = await api.post('/appointments/create/', appointmentData);
      const apt = response.data;
      return {
        id: Number(apt.id),
        patientId: Number(apt.patient_id),
        patient: {
          id: Number(apt.patient.id),
          name: apt.patient_name || `${apt.patient.first_name} ${apt.patient.last_name}`,
          first_name: apt.patient.first_name,
          last_name: apt.patient.last_name,
          email: apt.patient.email || undefined,
          phone: apt.patient.phone || undefined,
          dateOfBirth: apt.patient.dob || undefined,
          age: apt.patient.age || undefined,
          gender: apt.patient.gender || undefined,
          address: apt.patient.address || undefined,
          city: apt.patient.city || undefined,
          pincode: apt.patient.pincode || undefined,
          aadhaar: apt.patient.aadhaar || undefined,
          remarks: apt.patient.remarks || undefined,
          category: apt.patient.category || 'General',
          created_at: apt.patient.created_at,
          updated_at: apt.patient.updated_at,
        },
        date: apt.date,
        time: apt.time,
        duration: Number(apt.duration),
        type: apt.type,
        status: apt.status,
        doctorName: apt.doctor_name || 'Unknown',
        symptoms: apt.symptoms || undefined,
        notes: apt.notes || undefined,
        diagnosis: apt.diagnosis || undefined,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update an existing appointment
  updateAppointment: async (id: number, appointmentData: Partial<AppointmentCreateData>): Promise<Appointment> => {
    try {
      const response = await api.patch(`/appointments/${id}/update/`, appointmentData);
      const apt = response.data;
      return {
        id: Number(apt.id),
        patientId: Number(apt.patient_id),
        patient: {
          id: Number(apt.patient.id),
          name: apt.patient_name || `${apt.patient.first_name} ${apt.patient.last_name}`,
          first_name: apt.patient.first_name,
          last_name: apt.patient.last_name,
          email: apt.patient.email || undefined,
          phone: apt.patient.phone || undefined,
          dateOfBirth: apt.patient.dob || undefined,
          age: apt.patient.age || undefined,
          gender: apt.patient.gender || undefined,
          address: apt.patient.address || undefined,
          city: apt.patient.city || undefined,
          pincode: apt.patient.pincode || undefined,
          aadhaar: apt.patient.aadhaar || undefined,
          remarks: apt.patient.remarks || undefined,
          category: apt.patient.category || 'General',
          created_at: apt.patient.created_at,
          updated_at: apt.patient.updated_at,
        },
        date: apt.date,
        time: apt.time,
        duration: Number(apt.duration),
        type: apt.type,
        status: apt.status,
        doctorName: apt.doctor_name || 'Unknown',
        symptoms: apt.symptoms || undefined,
        notes: apt.notes || undefined,
        diagnosis: apt.diagnosis || undefined,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      };
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
        id: Number(p.id),
        name: p.name || `${p.first_name} ${p.last_name}`,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email || undefined,
        phone: p.phone || undefined,
        dateOfBirth: p.dob || undefined,
        age: p.age || undefined,
        gender: p.gender || undefined,
        address: p.address || undefined,
        city: p.city || undefined,
        pincode: p.pincode || undefined,
        aadhaar: p.aadhaar || undefined,
        remarks: p.remarks || undefined,
        category: p.category || 'General',
        created_at: p.created_at,
        updated_at: p.updated_at,
        emergencyContact: p.emergency_contact || undefined,
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
      const p = response.data.patient; // Adjusted to match AddPatientsView response
      return {
        id: Number(p.id),
        name: p.name || `${p.first_name} ${p.last_name}`,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email || undefined,
        phone: p.phone || undefined,
        dateOfBirth: p.dob || undefined,
        age: p.age || undefined,
        gender: p.gender || undefined,
        address: p.address || undefined,
        city: p.city || undefined,
        pincode: p.pincode || undefined,
        aadhaar: p.aadhaar || undefined,
        remarks: p.remarks || undefined,
        category: p.category || 'General',
        created_at: p.created_at,
        updated_at: p.updated_at,
        emergencyContact: p.emergency_contact || undefined,
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
      return response.data.map((inv: any) => ({
        id: Number(inv.id),
        patientId: Number(inv.patient_id),
        patient: {
          id: Number(inv.patient.id),
          name: inv.patient.name || `${inv.patient.first_name} ${inv.patient.last_name}`,
          first_name: inv.patient.first_name,
          last_name: inv.patient.last_name,
          email: inv.patient.email || undefined,
          phone: inv.patient.phone || undefined,
          dateOfBirth: inv.patient.dob || undefined,
          age: inv.patient.age || undefined,
          gender: inv.patient.gender || undefined,
          address: inv.patient.address || undefined,
          city: inv.patient.city || undefined,
          pincode: inv.patient.pincode || undefined,
          aadhaar: inv.patient.aadhaar || undefined,
          remarks: inv.patient.remarks || undefined,
          category: inv.patient.category || 'General',
          created_at: inv.patient.created_at,
          updated_at: inv.patient.updated_at,
          emergencyContact: inv.patient.emergency_contact || undefined,
        },
        invitedDate: inv.invitedDate,
        preferredDates: inv.preferredDates,
        status: inv.status,
        invitedBy: inv.invitedBy || 'Unknown',
        createdAt: inv.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
  },

  // Create a new invitation
  createInvitation: async (invitationData: InvitationCreateData): Promise<InvitationStatus> => {
    try {
      const response = await api.post('/invitations/create/', invitationData);
      const inv = response.data;
      return {
        id: Number(inv.id),
        patientId: Number(inv.patient_id),
        patient: {
          id: Number(inv.patient.id),
          name: inv.patient.name || `${inv.patient.first_name} ${inv.patient.last_name}`,
          first_name: inv.patient.first_name,
          last_name: inv.patient.last_name,
          email: inv.patient.email || undefined,
          phone: inv.phone || undefined,
          dateOfBirth: inv.dob || undefined,
          age: inv.age || undefined,
          gender: inv.gender || undefined,
          address: inv.address || undefined,
          city: inv.city || undefined,
          pincode: inv.pincode || undefined,
          aadhaar: inv.aadhaar || undefined,
          remarks: inv.remarks || undefined,
          category: inv.category || 'General',
          created_at: inv.created_at,
          updated_at: inv.updated_at,
          emergencyContact: inv.emergency_contact || undefined,
        },
        invitedDate: inv.invitedDate,
        preferredDates: inv.preferredDates,
        status: inv.status,
        invitedBy: inv.invitedBy || 'Unknown',
        createdAt: inv.createdAt,
      };
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  },
}