"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTag,
  FaStickyNote,
  FaCheck,
  FaClock,
  FaHistory,
} from "react-icons/fa"
import { Calendar, Clock } from "lucide-react"
import { mockAppointments, getAppointmentStatusColor, formatAppointmentTime } from "../lib/appointment-data"
import type { Appointment } from "../types/appointment"
import type { Patient } from "../ApiService/PatientsService"
import { patientService } from "../ApiService/PatientsService"

export const PatientView = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const appointments: Appointment[] = mockAppointments
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true)
        const patientsData = await patientService.getPatients()
        setPatients(patientsData)
        // Also store in localStorage for demo purposes (optional)
        localStorage.setItem("patients", JSON.stringify(patientsData))
      } catch (error) {
        console.error("Error fetching patients:", error)
        // Fallback to localStorage if API fails
        const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
        // Convert date strings to Date objects
        const parsedPatients = storedPatients.map((p: any) => ({
          ...p,
          date_of_birth: new Date(p.date_of_birth)
        }))
        setPatients(parsedPatients)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const handleAddPatientClick = () => {
    navigate("/admin/add-patient")
  }

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter((apt) => apt.patientId === patientId)
  }

  const getPatientUpcomingAppointment = (patientId: string) => {
    const today = new Date().toISOString().split("T")[0]
    const patientAppointments = getPatientAppointments(patientId)
    return patientAppointments
      .filter((apt) => apt.date >= today && (apt.status === "Scheduled" || apt.status === "Confirmed"))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0]
  }

  const getPatientLastAppointment = (patientId: string) => {
    const today = new Date().toISOString().split("T")[0]
    const patientAppointments = getPatientAppointments(patientId)
    return patientAppointments
      .filter((apt) => apt.date < today || apt.status === "Completed")
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))[0]
  }

  const hasUpcomingAppointment = (patientId: string) => {
    return !!getPatientUpcomingAppointment(patientId)
  }

  const needsReschedule = (patientId: string) => {
    const patientAppointments = getPatientAppointments(patientId)
    return patientAppointments.some(
      (apt) => apt.status === "Cancelled" && apt.date >= new Date().toISOString().split("T")[0],
    )
  }

  const handleScheduleAppointment = (patientId: string) => {
    // This would typically open the appointment modal or navigate to scheduling
    console.log(`Schedule appointment for patient ${patientId}`)
    // For now, we'll just show an alert
    alert("Appointment scheduling would open here")
  }

  const handleViewHistory = (patientId: string) => {
    setSelectedPatientId(selectedPatientId === patientId ? null : patientId)
  }

  const calculateAge = (dob: Date) => {
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm)),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
              <p className="text-gray-600">Manage patient records and appointments</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl w-full sm:w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={handleAddPatientClick}
              >
                <FaPlus className="text-sm" />
                Add New Patient
              </button>
            </div>
          </div>
        </div>

        {/* Patient Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUser className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Appointments</p>
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter((p) => hasUpcomingAppointment(p.id?.toString() || `patient-${patients.indexOf(p)}`)).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Reschedule</p>
                <p className="text-2xl font-bold text-orange-600">
                  {patients.filter((p) => needsReschedule(p.id?.toString() || `patient-${patients.indexOf(p)}`)).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Search Results</p>
                <p className="text-2xl font-bold text-indigo-600">{filteredPatients.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaSearch className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Patient Records</h2>
            <p className="text-blue-100 mt-1">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>

          <div className="p-8">
            {filteredPatients.length > 0 ? (
              <div className="grid gap-6">
                {filteredPatients.map((patient, index) => {
                  const patientId = patient.id?.toString() || `patient-${index}`
                  const upcomingAppointment = getPatientUpcomingAppointment(patientId)
                  const lastAppointment = getPatientLastAppointment(patientId)
                  const patientAppointments = getPatientAppointments(patientId)
                  const isExpanded = selectedPatientId === patientId

                  return (
                    <div
                      key={patientId}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Patient Info */}
                        <div className="flex-1 space-y-4">
                          {/* Name and Category */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
                                <FaUser className="text-white text-lg" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {patient.first_name} {patient.last_name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <FaUserTag className="text-gray-400 text-sm" />
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      patient.category === "Emergency"
                                        ? "bg-red-100 text-red-700"
                                        : patient.category === "VIP"
                                          ? "bg-purple-100 text-purple-700"
                                          : patient.category === "OPD"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {patient.category || "General"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Patient Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <FaCalendarAlt className="text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Age & Gender</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {calculateAge(patient.date_of_birth)} years, {patient.gender}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <FaCalendarAlt className="text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatDate(patient.date_of_birth)}
                                </p>
                              </div>
                            </div>

                            {patient.phone && (
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                <FaPhone className="text-green-500" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                                  <p className="text-sm font-semibold text-gray-900">{patient.phone}</p>
                                </div>
                              </div>
                            )}

                            {patient.email && (
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                <FaEnvelope className="text-purple-500" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Email</p>
                                  <p className="text-sm font-semibold text-gray-900 truncate">{patient.email}</p>
                                </div>
                              </div>
                            )}

                            {(patient.address || patient.city) && (
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 md:col-span-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Address</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {patient.address ? `${patient.address}, ` : ""}
                                    {patient.city}
                                    {patient.pincode ? `, ${patient.pincode}` : ""}
                                  </p>
                                </div>
                              </div>
                            )}

                            {patient.remarks && (
                              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                <FaStickyNote className="text-yellow-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Remarks</p>
                                  <p className="text-sm font-semibold text-gray-900">{patient.remarks}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {(upcomingAppointment || lastAppointment) && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <h4 className="text-sm font-semibold text-blue-900 mb-3">Appointment Status</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingAppointment && (
                                  <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <div>
                                      <p className="text-xs text-blue-600 font-medium">Next Appointment</p>
                                      <p className="text-sm font-semibold text-blue-900">
                                        {formatDate(new Date(upcomingAppointment.date))} at{" "}
                                        {formatAppointmentTime(upcomingAppointment.time)}
                                      </p>
                                      <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getAppointmentStatusColor(upcomingAppointment.status)}`}
                                      >
                                        {upcomingAppointment.status}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {lastAppointment && (
                                  <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <div>
                                      <p className="text-xs text-gray-500 font-medium">Last Visit</p>
                                      <p className="text-sm font-semibold text-gray-700">
                                        {formatDate(new Date(lastAppointment.date))}
                                      </p>
                                      <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getAppointmentStatusColor(lastAppointment.status)}`}
                                      >
                                        {lastAppointment.status}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                          {upcomingAppointment ? (
                            <button className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
                              <FaCheck className="w-4 h-4" />
                              Appointment Booked
                            </button>
                          ) : needsReschedule(patientId) ? (
                            <button
                              onClick={() => handleScheduleAppointment(patientId)}
                              className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                            >
                              <FaClock className="w-4 h-4" />
                              Reschedule
                            </button>
                          ) : (
                            <button
                              onClick={() => handleScheduleAppointment(patientId)}
                              className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule
                            </button>
                          )}

                          <button
                            onClick={() => handleViewHistory(patientId)}
                            className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                          >
                            <FaHistory className="w-4 h-4" />
                            {isExpanded ? "Hide" : "History"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && patientAppointments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {patientAppointments
                              .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                              .map((appointment) => (
                                <div key={appointment.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-medium text-gray-900">{appointment.type}</h5>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}
                                        >
                                          {appointment.status}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {formatDate(new Date(appointment.date))} at {formatAppointmentTime(appointment.time)} •{" "}
                                        {appointment.duration}min
                                      </p>
                                    </div>
                                  </div>
                                  {appointment.symptoms && (
                                    <p className="text-sm text-gray-700 mb-1">
                                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                                    </p>
                                  )}
                                  {appointment.diagnosis && (
                                    <p className="text-sm text-gray-700 mb-1">
                                      <span className="font-medium">Diagnosis:</span> {appointment.diagnosis}
                                    </p>
                                  )}
                                  {appointment.notes && (
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Notes:</span> {appointment.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FaUser className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No patients found" : "No patients yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No patients match "${searchTerm}". Try adjusting your search.`
                    : "Get started by adding your first patient record."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddPatientClick}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Add Your First Patient
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}