"use client"

import { useEffect, useState } from "react"
import { FaPlus, FaSearch, FaNotesMedical, FaCalendarAlt, FaFilter, FaSort } from "react-icons/fa"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { Patient, Diagnostic, DiagnosticCreateData } from "../types/appointment"
import { patientService } from "../ApiService/PatientsService"
import { diagnosticService } from "../ApiService/DiagnosticService"

interface DiagnosticsViewProps {
  userRole?: string
  userName?: string
}

export const DiagnosticsView = ({ userRole = "doctor", userName = "User" }: DiagnosticsViewProps) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "abnormal">("all")
  const [sortBy, setSortBy] = useState<"date" | "patient_name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingDiagnostic, setIsAddingDiagnostic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [diagnosticForm, setDiagnosticForm] = useState<DiagnosticCreateData>({
    patient: 0, // Changed from patient_id to patient
    test_type: "Blood Test",
    result: "",
    date: new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
    notes: "",
    status: "pending"
  })

  const canAddDiagnostic = userRole === "doctor" || userRole === "nurse" || userRole === "admin"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const patientsData = await patientService.getPatients()
        const parsedPatients = patientsData.map((p: any) => ({
          ...p,
          id: Number(p.id),
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : new Date(),
        }))
        console.log('Patients:', parsedPatients.map(p => ({ id: p.id, name: p.name })))
        setPatients(parsedPatients)
        localStorage.setItem("patients", JSON.stringify(parsedPatients))

        const diagnosticsData = await diagnosticService.getDiagnostics()
        console.log('Diagnostics:', diagnosticsData)
        setDiagnostics(diagnosticsData)
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

  const handleDiagnosticFormChange = (field: keyof DiagnosticCreateData, value: string | number) => {
    console.log(`Updating ${field} to ${value}`) // Debug form changes
    setDiagnosticForm(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    console.log('Validating form:', diagnosticForm) // Debug form state
    if (!diagnosticForm.patient || diagnosticForm.patient === 0 || !patients.some(p => p.id === diagnosticForm.patient)) {
      toast.error("Please select a valid patient")
      console.log('Validation failed: Invalid patient:', diagnosticForm.patient)
      return false
    }
    if (!diagnosticForm.test_type.trim()) {
      toast.error("Test type is required")
      console.log('Validation failed: Test type is empty')
      return false
    }
    if (!diagnosticForm.date) {
      toast.error("Date is required")
      console.log('Validation failed: Date is empty')
      return false
    }
    console.log('Form validation passed')
    return true
  }

  const handleDiagnosticSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      console.log('Validation failed, form not submitted:', diagnosticForm)
      return
    }
    setIsSubmitting(true)
    try {
      console.log('Creating diagnostic with form:', diagnosticForm)
      const response = await diagnosticService.createDiagnostic(diagnosticForm)
      console.log('Created diagnostic:', response)
      const updatedDiagnostics = await diagnosticService.getDiagnostics()
      setDiagnostics(updatedDiagnostics)
      setIsAddingDiagnostic(false)
      setDiagnosticForm({
        patient: 0, // Changed from patient_id to patient
        test_type: "Blood Test",
        result: "",
        date: new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
        notes: "",
        status: "pending"
      })
      toast.success("Diagnostic record added successfully!")
    } catch (error: any) {
      console.error("Error creating diagnostic:", error.response?.data || error.message)
      const errorMessage = error.response?.data?.error || "Failed to add diagnostic"
      toast.error(`Failed to add diagnostic: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (
      diagnosticForm.patient !== 0 || 
      diagnosticForm.test_type !== "Blood Test" ||
      diagnosticForm.result ||
      diagnosticForm.notes ||
      diagnosticForm.status !== "pending"
    ) {
      setShowCancelConfirm(true)
    } else {
      setIsAddingDiagnostic(false)
    }
  }

  const confirmCancel = () => {
    setIsAddingDiagnostic(false)
    setShowCancelConfirm(false)
    setDiagnosticForm({
      patient: 0, // Changed from patient_id to patient
      test_type: "Blood Test",
      result: "",
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
      notes: "",
      status: "pending"
    })
  }

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
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
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "completed": return "bg-green-100 text-green-700"
      case "abnormal": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const filteredDiagnostics = diagnostics
    .filter(d => 
      (statusFilter === "all" || d.status === statusFilter) &&
      (d.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       d.test_type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      if (sortBy === "date") {
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      return multiplier * a.patient_name.localeCompare(b.patient_name)
    })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Diagnostics Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and review patient diagnostic records for {userName}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient or test type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              {canAddDiagnostic && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow-md transition-all"
                  onClick={() => setIsAddingDiagnostic(true)}
                >
                  <FaPlus className="text-sm" />
                  Add Diagnostic
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="abnormal">Abnormal</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="patient_name">Sort by Patient Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Diagnostics</p>
              <p className="text-xl font-semibold text-gray-800">{diagnostics.length}</p>
            </div>
            <FaNotesMedical className="text-blue-500 text-2xl" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tests</p>
              <p className="text-xl font-semibold text-yellow-600">{diagnostics.filter(d => d.status === 'pending').length}</p>
            </div>
            <FaCalendarAlt className="text-yellow-500 text-2xl" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tests</p>
              <p className="text-xl font-semibold text-green-600">{diagnostics.filter(d => d.status === 'completed').length}</p>
            </div>
            <FaNotesMedical className="text-green-500 text-2xl" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abnormal Results</p>
              <p className="text-xl font-semibold text-red-600">{diagnostics.filter(d => d.status === 'abnormal').length}</p>
            </div>
            <FaNotesMedical className="text-red-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800">Diagnostic Records</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredDiagnostics.length} of {diagnostics.length} records
            </p>
          </div>
          <div className="p-6">
            {filteredDiagnostics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDiagnostics.map((diagnostic) => (
                  <div
                    key={diagnostic.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FaNotesMedical className="text-blue-500 text-xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{diagnostic.test_type}</h3>
                        <p className="text-sm text-gray-600">Patient: {diagnostic.patient_name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <p className="text-sm text-gray-600">Date: {formatDate(diagnostic.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnostic.status)}`}>
                          {diagnostic.status.charAt(0).toUpperCase() + diagnostic.status.slice(1)}
                        </span>
                      </div>
                      {diagnostic.result && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Result:</p>
                          <p className="line-clamp-2">{diagnostic.result}</p>
                        </div>
                      )}
                      {diagnostic.notes && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Notes:</p>
                          <p className="line-clamp-2">{diagnostic.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaNotesMedical className="text-gray-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {searchTerm || statusFilter !== "all" ? "No diagnostics found" : "No diagnostics yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "No diagnostics match your criteria. Try adjusting your search or filter."
                    : "Get started by adding your first diagnostic record."}
                </p>
                {canAddDiagnostic && !searchTerm && statusFilter === "all" && (
                  <button
                    onClick={() => setIsAddingDiagnostic(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Add Your First Diagnostic
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {isAddingDiagnostic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Diagnostic Record</h2>
              <form onSubmit={handleDiagnosticSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Patient *</label>
                  <select
                    value={diagnosticForm.patient} // Changed from patient_id to patient
                    onChange={(e) => handleDiagnosticFormChange("patient", Number(e.target.value))} // Changed from patient_id to patient
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  >
                    <option value={0} disabled>Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Test Type *</label>
                  <select
                    value={diagnosticForm.test_type}
                    onChange={(e) => handleDiagnosticFormChange("test_type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Lab Test">Lab Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    value={diagnosticForm.date}
                    onChange={(e) => handleDiagnosticFormChange("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Result</label>
                  <textarea
                    value={diagnosticForm.result}
                    onChange={(e) => handleDiagnosticFormChange("result", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={diagnosticForm.notes}
                    onChange={(e) => handleDiagnosticFormChange("notes", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status *</label>
                  <select
                    value={diagnosticForm.status}
                    onChange={(e) => handleDiagnosticFormChange("status", e.target.value as 'pending' | 'completed' | 'abnormal')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="abnormal">Abnormal</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || diagnosticForm.patient === 0} // Changed from patient_id to patient
                    className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm ${isSubmitting || diagnosticForm.patient === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Diagnostic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Discard Changes?</h3>
              <p className="text-sm text-gray-600 mb-6">You have unsaved changes. Are you sure you want to cancel?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
                >
                  Keep Editing
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}