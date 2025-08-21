"use client"
import { useState, useEffect } from "react"
import { X, Mail, Calendar, User, Search, Plus } from "lucide-react"
import api from "../ApiService/Api"
import type { Patient, InvitationStatus } from "../types/appointment"

interface InvitePatientModalProps {
  isOpen: boolean
  onClose: () => void
  onInvitationSent: (invitation: Omit<InvitationStatus, "id" | "createdAt">) => void
}

export default function InvitePatientModal({ isOpen, onClose, onInvitationSent }: InvitePatientModalProps) {
  const [selectedPatients, setSelectedPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [preferredDates, setPreferredDates] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setLoadingPatients(true)
      api
        .get("/patients/", { params: { search: searchTerm.trim() } })
        .then((res) => {
          console.log("Fetched patients:", res.data)
          setPatients(res.data)
          setLoadingPatients(false)
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.detail || err.message || "Failed to load patients"
          setError(errorMsg)
          setLoadingPatients(false)
          console.error("Error fetching patients:", err)
        })
    } else {
      setSelectedPatients([])
      setSearchTerm("")
      setPreferredDates([])
      setMessage("")
      setPatients([])
      setError(null)
      setDateError(null)
    }
  }, [isOpen, searchTerm])

  const normalizePhone = (str: string) => str.replace(/\D/g, "")

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.name?.toLowerCase() || "").includes(searchTerm.trim().toLowerCase()) ||
      (patient.email?.toLowerCase() || "").includes(searchTerm.trim().toLowerCase()) ||
      (patient.phone ? normalizePhone(patient.phone) : "").includes(normalizePhone(searchTerm.trim()))
  )

  const handlePatientToggle = (patient: Patient) => {
    setSelectedPatients((prev) => {
      const isSelected = prev.some((p) => p.id === patient.id)
      if (isSelected) {
        return prev.filter((p) => p.id !== patient.id)
      } else {
        return [...prev, patient]
      }
    })
    setError(null)
  }

  const handleDateAdd = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const dateStr = nextWeek.toISOString().split("T")[0]

    if (!preferredDates.includes(dateStr)) {
      setPreferredDates((prev) => [...prev, dateStr])
      setDateError(null)
    }
  }

  const handleDateChange = (index: number, newDate: string) => {
    if (!newDate) {
      setDateError("Please select a valid date")
      return
    }
    const selectedDate = new Date(newDate)
    const minDate = new Date(getMinDate())
    if (isNaN(selectedDate.getTime())) {
      setDateError("Invalid date format. Please select a valid date")
      return
    }
    if (selectedDate < minDate) {
      setDateError("Selected date cannot be in the past")
      return
    }
    setPreferredDates((prev) => {
      const updated = [...prev]
      updated[index] = newDate
      return updated
    })
    setDateError(null)
  }

  const handleDateRemove = (index: number) => {
    setPreferredDates((prev) => prev.filter((_, i) => i !== index))
    setDateError(null)
  }

  const handleSendInvitations = () => {
    if (selectedPatients.length === 0) {
      setError("Please select at least one patient")
      return
    }
    if (preferredDates.length === 0) {
      setDateError("Please add at least one preferred date")
      return
    }
    const invalidDates = preferredDates.filter((date) => !date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime()))
    if (invalidDates.length > 0) {
      setDateError("All preferred dates must be valid (YYYY-MM-DD)")
      return
    }

    console.log("Preparing to send invitations for patients:", selectedPatients.map((p) => p.id))
    console.log("Preferred dates:", preferredDates)

    selectedPatients.forEach((patient) => {
      const invitation: Omit<InvitationStatus, "id" | "createdAt"> = {
        patientId: patient.id,
        patient,
        invitedDate: new Date().toISOString(),
        preferredDates: [...preferredDates],
        status: "Pending",
        invitedBy: "Current User",
      }
      console.log("Sending invitation for patient:", patient.id, JSON.stringify(invitation, null, 2))
      onInvitationSent(invitation)
    })

    onClose()
  }

  const getMinDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    return today.toISOString().split("T")[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Invite Patients</h2>
              <p className="text-orange-100 text-sm">Send appointment booking invitations</p>
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
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patients to Invite</h3>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {error && !dateError && (
                <p className="text-red-600 text-sm mb-2">{error}</p>
              )}

              {selectedPatients.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-orange-800 mb-2">
                    Selected Patients ({selectedPatients.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatients.map((patient) => (
                      <span
                        key={patient.id}
                        className="inline-flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs"
                      >
                        {patient.name}
                        <button
                          onClick={() => handlePatientToggle(patient)}
                          className="hover:bg-orange-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {loadingPatients ? (
                  <p className="p-3 text-center text-gray-600">Loading patients...</p>
                ) : error && dateError === null ? (
                  <p className="p-3 text-center text-red-600">Error: {error}</p>
                ) : filteredPatients.length === 0 ? (
                  <p className="p-3 text-center text-gray-600">No patients found</p>
                ) : (
                  filteredPatients.map((patient) => {
                    const isSelected = selectedPatients.some((p) => p.id === patient.id)
                    return (
                      <button
                        key={patient.id}
                        onClick={() => handlePatientToggle(patient)}
                        className={`w-full p-3 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-orange-50 border-orange-200" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300"
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{patient.name}</h4>
                            <p className="text-sm text-gray-600">
                              {patient.email || "No email"} • {patient.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Appointment Dates</h3>
              {dateError && (
                <p className="text-red-600 text-sm mb-2">{dateError}</p>
              )}
              <p className="text-sm text-gray-600 mb-2">Select one or more future dates for the appointment</p>
              <div className="space-y-3">
                {preferredDates.map((date, index) => (
                  <div key={`${date}-${index}`} className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      min={getMinDate()}
                      required
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button onClick={() => handleDateRemove(index)} className="text-red-500 hover:text-red-700 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleDateAdd}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Preferred Date
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation Message (Optional)</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={4}
                placeholder="Add a personal message to your invitation..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvitations}
                disabled={selectedPatients.length === 0 || preferredDates.length === 0}
                title={selectedPatients.length === 0 || preferredDates.length === 0 ? "Select at least one patient and one date" : ""}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send Invitations ({selectedPatients.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}