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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { Appointment, Patient, AppointmentCreateData } from "../types/appointment"
import { patientService } from "../ApiService/PatientsService"
import { appointmentService } from "../ApiService/AppointmentService"

export const PatientView = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScheduling, setIsScheduling] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [appointmentForm, setAppointmentForm] = useState<AppointmentCreateData>({
    patient_id: 0,
    date: new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
    time: "09:00",
    duration: 30,
    type: "Consultation",
    status: "Scheduled",
    symptoms: "",
    notes: "",
    diagnosis: "",
  })
  // Track patients marked as having an appointment via checkbox
  const [hasAppointmentMap, setHasAppointmentMap] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    // Load hasAppointmentMap from localStorage first
    const storedHasAppointmentMap = JSON.parse(localStorage.getItem("hasAppointmentMap") || "{}")
    setHasAppointmentMap(storedHasAppointmentMap)
    console.log('Loaded hasAppointmentMap from localStorage:', storedHasAppointmentMap)

    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch patients
        const patientsData = await patientService.getPatients()
        const parsedPatients = patientsData.map((p: any) => ({
          ...p,
          id: Number(p.id),
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : new Date(),
        }))
        console.log('Patients:', parsedPatients.map(p => ({ id: p.id, name: p.name })))
        setPatients(parsedPatients)
        localStorage.setItem("patients", JSON.stringify(parsedPatients))

        // Fetch appointments
        const appointmentsData = await appointmentService.getAppointments()
        console.log('Initial appointments:', appointmentsData.map(a => ({ id: a.id, patientId: a.patientId, status: a.status, date: a.date })))
        setAppointments(appointmentsData)

        // Update hasAppointmentMap based on fetched appointments
        const updatedHasAppointmentMap = { ...storedHasAppointmentMap }
        parsedPatients.forEach(patient => {
          const hasUpcoming = appointmentsData.some(
            (apt: Appointment) =>
              apt.patientId === patient.id &&
              apt.date >= new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }) &&
              ['scheduled', 'confirmed'].includes(apt.status.toLowerCase())
          )
          if (hasUpcoming) {
            updatedHasAppointmentMap[patient.id] = true
          }
        })
        setHasAppointmentMap(updatedHasAppointmentMap)
        localStorage.setItem("hasAppointmentMap", JSON.stringify(updatedHasAppointmentMap))
        console.log('Updated hasAppointmentMap after fetch:', updatedHasAppointmentMap)

        // Fetch available slots for the default date
        const slots = await appointmentService.getAvailableSlots(appointmentForm.date)
        console.log('Available slots:', slots.available_slots)
        setAvailableSlots(slots.available_slots)
      } catch (error) {
        console.error("Error fetching data:", error)
        const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
        setPatients(storedPatients.map((p: any) => ({
          ...p,
          id: Number(p.id),
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : new Date(),
        })))
        toast.error("Failed to fetch data. Using cached patients.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update localStorage when hasAppointmentMap changes
  useEffect(() => {
    localStorage.setItem("hasAppointmentMap", JSON.stringify(hasAppointmentMap))
    console.log('Saved hasAppointmentMap to localStorage:', hasAppointmentMap)
  }, [hasAppointmentMap])

  const handleAddPatientClick = () => {
    navigate("/admin/add-patient")
  }

  const handleScheduleAppointment = (patientId: number) => {
    console.log("Scheduling modal rendered for patient:", patientId)
    setAppointmentForm({
      ...appointmentForm,
      patient_id: patientId,
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
      time: availableSlots[0] || "09:00",
    })
    setIsScheduling(true)
  }

  const handleAppointmentFormChange = (field: keyof AppointmentCreateData, value: string | number) => {
    setAppointmentForm(prev => ({ ...prev, [field]: value }))
    if (field === "date") {
      appointmentService.getAvailableSlots(value as string)
        .then(slots => {
          console.log('Available slots for date', value, ':', slots.available_slots)
          setAvailableSlots(slots.available_slots)
          setAppointmentForm(prev => ({
            ...prev,
            time: slots.available_slots[0] || "09:00",
          }))
        })
        .catch(error => {
          console.error("Error fetching available slots:", error)
          toast.error("Failed to fetch available slots.")
        })
    }
  }

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('Creating appointment with form:', appointmentForm)
      await appointmentService.createAppointment(appointmentForm)
      const updatedAppointments = await appointmentService.getAppointments()
      console.log('Updated appointments:', updatedAppointments.map(a => ({ id: a.id, patientId: a.patientId, status: a.status, date: a.date })))
      setAppointments(updatedAppointments)
      setHasAppointmentMap(prev => ({
        ...prev,
        [appointmentForm.patient_id]: true,
      }))
      setIsScheduling(false)
      toast.success("Appointment scheduled successfully!")
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast.error("Failed to schedule appointment. Check if the time slot is available.")
    }
  }

  const handleHasAppointmentChange = (patientId: number, checked: boolean) => {
    setHasAppointmentMap(prev => ({
      ...prev,
      [patientId]: checked,
    }))
    console.log(`Patient ${patientId} marked as ${checked ? 'having' : 'not having'} an appointment`)
  }

  const getPatientAppointments = (patientId: number) => {
    const patientAppointments = appointments.filter((apt) => apt.patientId === patientId)
    console.log(`Appointments for patient ${patientId}:`, patientAppointments)
    return patientAppointments
  }

  const getPatientUpcomingAppointment = (patientId: number) => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
    const patientAppointments = getPatientAppointments(patientId)
    const upcoming = patientAppointments
      .filter((apt) => apt.date >= today && ['scheduled', 'confirmed'].includes(apt.status.toLowerCase()))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0]
    console.log(`Upcoming for patient ${patientId}:`, upcoming)
    return upcoming
  }

  const getPatientLastAppointment = (patientId: number) => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
    const patientAppointments = getPatientAppointments(patientId)
    return patientAppointments
      .filter((apt) => apt.date < today || apt.status.toLowerCase() === "completed")
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(b.time))[0]
  }

  const hasUpcomingAppointment = (patientId: number) => {
    // Use checkbox state if set, otherwise fall back to appointment data
    if (hasAppointmentMap[patientId] !== undefined) {
      return hasAppointmentMap[patientId]
    }
    return !!getPatientUpcomingAppointment(patientId)
  }

  const needsReschedule = (patientId: number) => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
    const patientAppointments = getPatientAppointments(patientId)
    const needs = patientAppointments.some(
      (apt) => apt.status.toLowerCase() === 'cancelled' && apt.date >= today
    )
    console.log(`Needs reschedule for patient ${patientId}:`, needs)
    return needs
  }

  const handleViewHistory = (patientId: number) => {
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date: ${date}`)
      return 'Invalid Date'
    }
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled": return "bg-blue-100 text-blue-700"
      case "confirmed": return "bg-green-100 text-green-700"
      case "in progress": return "bg-yellow-100 text-yellow-700"
      case "completed": return "bg-gray-100 text-gray-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm))
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
      <ToastContainer position="top-right" autoClose={5000} />
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
                  {patients.filter((p) => hasUpcomingAppointment(p.id)).length}
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
                  {patients.filter((p) => needsReschedule(p.id)).length}
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
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
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
                          {/* Checkbox for marking appointment */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={hasUpcomingAppointment(patient.id)}
                              onChange={(e) => handleHasAppointmentChange(patient.id, e.target.checked)}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">Has Upcoming Appointment</label>
                          </div>
                        </div>

                        {/* Patient Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <FaCalendarAlt className="text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Age & Gender</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {patient.age || calculateAge(patient.dateOfBirth!)} years, {patient.gender || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <FaCalendarAlt className="text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(patient.dateOfBirth!)}
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
                          {patient.emergencyContact && (
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                              <FaPhone className="text-orange-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Emergency Contact</p>
                                <p className="text-sm font-semibold text-gray-900">{patient.emergencyContact}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {(getPatientUpcomingAppointment(patient.id) || getPatientLastAppointment(patient.id)) && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3">Appointment Status</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {getPatientUpcomingAppointment(patient.id) && (
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-blue-600 font-medium">Next Appointment</p>
                                    <p className="text-sm font-semibold text-blue-900">
                                      {formatDate(getPatientUpcomingAppointment(patient.id)!.date)} at{" "}
                                      {getPatientUpcomingAppointment(patient.id)!.time}
                                    </p>
                                    <span
                                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(getPatientUpcomingAppointment(patient.id)!.status)}`}
                                    >
                                      {getPatientUpcomingAppointment(patient.id)!.status}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {getPatientLastAppointment(patient.id) && (
                                <div className="flex items-center gap-3">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Last Visit</p>
                                    <p className="text-sm font-semibold text-gray-700">
                                      {formatDate(getPatientLastAppointment(patient.id)!.date)}
                                    </p>
                                    <span
                                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(getPatientLastAppointment(patient.id)!.status)}`}
                                    >
                                      {getPatientLastAppointment(patient.id)!.status}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                        {hasUpcomingAppointment(patient.id) ? (
                          <button className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2">
                            <FaCheck className="w-4 h-4" />
                            Appointment Booked
                          </button>
                        ) : needsReschedule(patient.id) ? (
                          <button
                            onClick={() => handleScheduleAppointment(patient.id)}
                            className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                          >
                            <FaClock className="w-4 h-4" />
                            Reschedule
                          </button>
                        ) : (
                          <button
                            onClick={() => handleScheduleAppointment(patient.id)}
                            className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            Schedule
                          </button>
                        )}
                        <button
                          onClick={() => handleViewHistory(patient.id)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                        >
                          <FaHistory className="w-4 h-4" />
                          {selectedPatientId === patient.id ? "Hide" : "History"}
                        </button>
                        <button
                          onClick={() => navigate(`/doctor/ehr/${patient.id}`)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                        >
                          <FaUser className="w-4 h-4" />
                          EHR
                        </button>
                      </div>
                    </div>

                    {selectedPatientId === patient.id && getPatientAppointments(patient.id).length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {getPatientAppointments(patient.id)
                            .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                            .map((appointment) => (
                              <div key={appointment.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-medium text-gray-900">{appointment.type}</h5>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                                      >
                                        {appointment.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(appointment.date)} at {appointment.time} • {appointment.duration}min
                                    </p>
                                    <p className="text-sm text-gray-600">Doctor: {appointment.doctorName}</p>
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
                ))}
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

        {/* Scheduling Modal */}
        {isScheduling && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Appointment</h2>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => handleAppointmentFormChange("date", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <select
                    value={appointmentForm.time}
                    onChange={(e) => handleAppointmentFormChange("time", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))
                    ) : (
                      <option value="">No available slots</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={appointmentForm.duration}
                    onChange={(e) => handleAppointmentFormChange("duration", Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="120"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={appointmentForm.type}
                    onChange={(e) => handleAppointmentFormChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Check">Routine Check</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Lab Test">Lab Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Symptoms</label>
                  <textarea
                    value={appointmentForm.symptoms}
                    onChange={(e) => handleAppointmentFormChange("symptoms", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => handleAppointmentFormChange("notes", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Cancel button clicked")
                      setIsScheduling(false)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    style={{ display: 'block', visibility: 'visible', zIndex: 10001 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                    style={{ display: 'block', visibility: 'visible', zIndex: 10001 }}
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}