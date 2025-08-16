"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, FileText, Plus, Search } from "lucide-react"
import { mockPatients, getAvailableTimeSlots, formatAppointmentTime } from "../lib/appointment-data"
import type { Patient, Appointment } from "../types/appointment"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onAppointmentCreated: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => void
}

export default function AppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  onAppointmentCreated,
}: AppointmentModalProps) {
  const [step, setStep] = useState<"patient" | "details">("patient")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)

  // Appointment form data
  const [appointmentData, setAppointmentData] = useState({
    time: "",
    duration: 30,
    type: "Consultation" as Appointment["type"],
    notes: "",
    symptoms: "",
  })

  // New patient form data
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male" as "Male" | "Female" | "Other",
    address: "",
    emergencyContact: "",
  })

  const availableSlots = getAvailableTimeSlots(selectedDate.toISOString().split("T")[0])
  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setStep("patient")
      setSelectedPatient(null)
      setSearchTerm("")
      setShowNewPatientForm(false)
      setAppointmentData({
        time: "",
        duration: 30,
        type: "Consultation",
        notes: "",
        symptoms: "",
      })
      setNewPatientData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "Male",
        address: "",
        emergencyContact: "",
      })
    }
  }, [isOpen])

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setStep("details")
  }

  const handleNewPatientSubmit = () => {
    // Create a temporary patient object
    const tempPatient: Patient = {
      id: `temp-${Date.now()}`,
      name: newPatientData.name,
      email: newPatientData.email,
      phone: newPatientData.phone,
      dateOfBirth: newPatientData.dateOfBirth,
      gender: newPatientData.gender,
      address: newPatientData.address,
      emergencyContact: newPatientData.emergencyContact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSelectedPatient(tempPatient)
    setStep("details")
  }

  const handleAppointmentSubmit = () => {
    if (!selectedPatient || !appointmentData.time) return

    const appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt"> = {
      patientId: selectedPatient.id,
      patient: selectedPatient,
      date: selectedDate.toISOString().split("T")[0],
      time: appointmentData.time,
      duration: appointmentData.duration,
      type: appointmentData.type,
      status: "Scheduled",
      doctorName: "Dr. Akintoye",
      notes: appointmentData.notes,
      symptoms: appointmentData.symptoms,
    }

    onAppointmentCreated(appointment)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Create Appointment</h2>
              <p className="text-blue-100 text-sm">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === "patient" && (
            <div className="space-y-6">
              {/* Patient Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search patients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* New Patient Button */}
                <button
                  onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                  className="w-full mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  Add New Patient
                </button>

                {/* New Patient Form */}
                {showNewPatientForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                    <h4 className="font-medium text-gray-900">New Patient Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={newPatientData.name}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={newPatientData.email}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, email: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={newPatientData.phone}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        placeholder="Date of Birth"
                        value={newPatientData.dateOfBirth}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={newPatientData.gender}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, gender: e.target.value as any }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Emergency Contact"
                        value={newPatientData.emergencyContact}
                        onChange={(e) => setNewPatientData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={newPatientData.address}
                      onChange={(e) => setNewPatientData((prev) => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleNewPatientSubmit}
                      disabled={!newPatientData.name || !newPatientData.email || !newPatientData.phone}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue with New Patient
                    </button>
                  </div>
                )}

                {/* Existing Patients List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.email} • {patient.phone}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "details" && selectedPatient && (
            <div className="space-y-6">
              {/* Selected Patient Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Patient</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedPatient.name}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.email} • {selectedPatient.phone}
                    </p>
                  </div>
                </div>
                <button onClick={() => setStep("patient")} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  Change Patient
                </button>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Slot *
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setAppointmentData((prev) => ({ ...prev, time }))}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          appointmentData.time === time
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {formatAppointmentTime(time)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <select
                      value={appointmentData.duration}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                    <select
                      value={appointmentData.type}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({ ...prev, type: e.target.value as Appointment["type"] }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Routine Check">Routine Check</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Lab Test">Lab Test</option>
                    </select>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Symptoms (Optional)
                  </label>
                  <textarea
                    value={appointmentData.symptoms}
                    onChange={(e) => setAppointmentData((prev) => ({ ...prev, symptoms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="Describe patient's symptoms..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="Additional notes for this appointment..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setStep("patient")}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAppointmentSubmit}
                  disabled={!appointmentData.time}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
