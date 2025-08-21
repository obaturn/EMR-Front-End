export interface Patient {
  id: number // Changed to number to match AddPatientSerializer
  name: string // first_name + last_name from AddPatientSerializer
  email?: string // Optional, as per AddPatients model
  phone?: string // Optional, as per AddPatients model
  dateOfBirth?: string
  gender?: "Male" | "Female" | "Other"
  address?: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: string
  currentMedications?: string
  insuranceProvider?: string
  insuranceNumber?: string
  createdAt?: string
  updatedAt?: string
}

export interface Appointment {
  id: number
  patientId: number
  patient: Patient
  date: string // ISO date string
  time: string // HH:MM format
  duration: number // minutes
  type: "Consultation" | "Follow-up" | "Emergency" | "Routine Check" | "Surgery" | "Lab Test"
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  doctorName: string
  notes?: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentSlot {
  time: string
  available: boolean
  appointmentId?: number
}

export interface DaySchedule {
  date: string
  appointments: Appointment[]
  availableSlots: AppointmentSlot[]
}

export interface InvitationStatus {
  id: number
  patientId: number
  patient: Patient
  invitedDate: string
  preferredDates: string[]
  status: "Pending" | "Accepted" | "Declined" | "Expired"
  invitedBy: string
  createdAt: string
}