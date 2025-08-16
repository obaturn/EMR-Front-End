export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "Male" | "Female" | "Other"
  address: string
  emergencyContact: string
  medicalHistory?: string
  allergies?: string
  currentMedications?: string
  insuranceProvider?: string
  insuranceNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  patientId: string
  patient: Patient
  date: string // ISO date string
  time: string // HH:MM format
  duration: number // minutes
  type: "Consultation" | "Follow-up" | "Emergency" | "Routine Check" | "Surgery" | "Lab Test"
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "No Show"
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
  appointmentId?: string
}

export interface DaySchedule {
  date: string
  appointments: Appointment[]
  availableSlots: AppointmentSlot[]
}

export interface InvitationStatus {
  id: string
  patientId: string
  patient: Patient
  invitedDate: string
  preferredDates: string[]
  status: "Pending" | "Accepted" | "Declined" | "Expired"
  invitedBy: string
  createdAt: string
}
