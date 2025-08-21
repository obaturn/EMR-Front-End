import type { Patient, Appointment, InvitationStatus } from "../types/appointment"


// lib/appointment-data.ts
export function getInvitationStatusColor(status: "Pending" | "Accepted" | "Declined" | "Expired") {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Accepted":
      return "bg-green-100 text-green-800";
    case "Declined":
      return "bg-red-100 text-red-800";
    case "Expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Mock patients data
export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Doe - +1234567891",
    medicalHistory: "Hypertension, Diabetes Type 2",
    allergies: "Penicillin",
    currentMedications: "Metformin, Lisinopril",
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1234567892",
    dateOfBirth: "1990-03-22",
    gender: "Female",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "Mike Johnson - +1234567893",
    medicalHistory: "Asthma",
    allergies: "Shellfish",
    currentMedications: "Albuterol inhaler",
    insuranceProvider: "Aetna",
    insuranceNumber: "AE987654321",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1234567894",
    dateOfBirth: "1978-11-08",
    gender: "Male",
    address: "789 Pine St, City, State 12345",
    emergencyContact: "Lisa Brown - +1234567895",
    medicalHistory: "High cholesterol",
    allergies: "None known",
    currentMedications: "Atorvastatin",
    insuranceProvider: "United Healthcare",
    insuranceNumber: "UH456789123",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1234567896",
    dateOfBirth: "1995-07-12",
    gender: "Female",
    address: "321 Elm St, City, State 12345",
    emergencyContact: "Robert Davis - +1234567897",
    medicalHistory: "Migraine headaches",
    allergies: "Latex",
    currentMedications: "Sumatriptan as needed",
    insuranceProvider: "Cigna",
    insuranceNumber: "CG789123456",
    createdAt: "2024-01-18T11:45:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
  },
]

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "1",
    patient: mockPatients[0],
    date: "2024-01-22",
    time: "09:00",
    duration: 30,
    type: "Routine Check",
    status: "Scheduled",
    doctorName: "Dr. Akintoye",
    notes: "Regular checkup for diabetes management",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "apt-2",
    patientId: "2",
    patient: mockPatients[1],
    date: "2024-01-22",
    time: "10:30",
    duration: 45,
    type: "Consultation",
    status: "Confirmed",
    doctorName: "Dr. Akintoye",
    notes: "Follow-up for asthma symptoms",
    symptoms: "Shortness of breath, wheezing",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-21T09:15:00Z",
  },
  {
    id: "apt-3",
    patientId: "3",
    patient: mockPatients[2],
    date: "2024-01-23",
    time: "14:00",
    duration: 30,
    type: "Follow-up",
    status: "Scheduled",
    doctorName: "Dr. Akintoye",
    notes: "Review cholesterol levels and medication effectiveness",
    createdAt: "2024-01-21T08:00:00Z",
    updatedAt: "2024-01-21T08:00:00Z",
  },
  {
    id: "apt-4",
    patientId: "4",
    patient: mockPatients[3],
    date: "2024-01-24",
    time: "11:15",
    duration: 60,
    type: "Consultation",
    status: "Scheduled",
    doctorName: "Dr. Akintoye",
    notes: "Initial consultation for recurring migraines",
    symptoms: "Severe headaches, light sensitivity",
    createdAt: "2024-01-21T16:20:00Z",
    updatedAt: "2024-01-21T16:20:00Z",
  },
]

// Mock invitation data
export const mockInvitations: InvitationStatus[] = [
  {
    id: "inv-1",
    patientId: "1",
    patient: mockPatients[0],
    invitedDate: "2024-01-21T10:00:00Z",
    preferredDates: ["2024-01-25", "2024-01-26", "2024-01-29"],
    status: "Pending",
    invitedBy: "Dr. Akintoye",
    createdAt: "2024-01-21T10:00:00Z",
  },
]

// Utility functions
export const getAppointmentsByDate = (date: string): Appointment[] => {
  return mockAppointments.filter((apt) => apt.date === date)
}

export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  return mockAppointments.filter((apt) => apt.patientId === patientId)
}

export const getAvailableTimeSlots = (date: string): string[] => {
  const workingHours = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  const bookedTimes = getAppointmentsByDate(date).map((apt) => apt.time)
  return workingHours.filter((time) => !bookedTimes.includes(time))
}

export const formatAppointmentTime = (time: string): string => {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const getAppointmentStatusColor = (status: Appointment["status"]): string => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800"
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-gray-100 text-gray-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    case "No Show":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
