export interface Patient {
  id: number;
  name: string; // first_name + last_name from AddPatientSerializer
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date; // ISO date string (e.g., "1990-01-01")
  age?: number;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  city?: string;
  pincode?: string;
  aadhaar?: string;
  remarks?: string;
  category?: "General" | "Emergency" | "OPD" | "VIP";
  emergencyContact?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patient: Patient;
  date: string; // ISO date string (e.g., "2025-08-22")
  time: string; // HH:MM format (e.g., "14:00")
  duration: number; // minutes
  type: "Consultation" | "Follow-up" | "Emergency" | "Routine Check" | "Surgery" | "Lab Test";
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  doctorName: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreateData {
  patient_id: number;
  date: string;
  time: string;
  duration: number;
  type: "Consultation" | "Follow-up" | "Emergency" | "Routine Check" | "Surgery" | "Lab Test";
  status?: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  symptoms?: string;
  notes?: string;
  diagnosis?: string;
}
export interface Diagnostic {
  id: number
  patient_id: number
  patient_name: string
  test_type: string
  result: string
  date: string
  notes: string
  status: 'pending' | 'completed' | 'abnormal'
  created_by: number | null
  created_by_name: string
  created_at: string
  updated_at: string
}

export interface DiagnosticCreateData {
  patient: number
  test_type: string
  result: string
  date: string
  notes: string
  status: 'pending' | 'completed' | 'abnormal'
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  appointmentId?: number;
}

export interface DaySchedule {
  date: string;
  appointments: Appointment[];
  availableSlots: AppointmentSlot[];
}

export interface InvitationStatus {
  id: number;
  patientId: number;
  patient: Patient;
  invitedDate: string;
  preferredDates: string[];
  status: "Pending" | "Accepted" | "Declined" | "Expired";
  invitedBy: string;
  createdAt: string;
}

export interface InvitationCreateData {
  patient_id: number;
  preferredDates: string[];
}
export interface PatientCreateData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  dob?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  city?: string;
  pincode?: string;
  aadhaar?: string;
  remarks?: string;
  category?: "General" | "Emergency" | "OPD" | "VIP";
  emergency_contact?: string;
}