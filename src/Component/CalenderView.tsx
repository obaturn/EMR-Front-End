"use client"

import { useState } from "react"
import { FaChevronLeft, FaChevronRight, FaPlus, FaUserPlus, FaClock, FaEnvelope } from "react-icons/fa"
import AppointmentModal from "./AppointmentModal"
import InvitePatientModal from "./InvitedPatients"
import { mockAppointments, getAppointmentStatusColor, mockInvitations } from "../lib/appointment-data"
import type { Appointment, InvitationStatus } from "../types/appointment"

type CalendarValue = Date

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [invitations, setInvitations] = useState<InvitationStatus[]>(mockInvitations)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date | null) => {
    if (!date) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const getDateAppointments = (date: Date | null) => {
    if (!date) return []
    const dateStr = date.toISOString().split("T")[0]
    return appointments.filter((apt) => apt.date === dateStr)
  }

  const hasAppointments = (date: Date | null) => {
    return getDateAppointments(date).length > 0
  }

  const getAppointmentStatusIndicators = (date: Date | null) => {
    const dayAppointments = getDateAppointments(date)
    if (dayAppointments.length === 0) return null

    const statusCounts = dayAppointments.reduce(
      (acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 px-1">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`w-1.5 h-1.5 rounded-full ${
              status === "Scheduled"
                ? "bg-blue-500"
                : status === "Confirmed"
                  ? "bg-green-500"
                  : status === "In Progress"
                    ? "bg-yellow-500"
                    : status === "Completed"
                      ? "bg-gray-500"
                      : status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-orange-500"
            }`}
            title={`${count} ${status}`}
          />
        ))}
      </div>
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAppointmentCreated = (newAppointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] New appointment created:", appointment)
    console.log("[v0] Patient details:", appointment.patient.name, appointment.patient.email)
    console.log("[v0] Appointment date/time:", appointment.date, appointment.time)
    console.log("[v0] Total appointments before adding:", appointments.length)

    setAppointments((prev) => {
      const updated = [...prev, appointment]
      console.log("[v0] Total appointments after adding:", updated.length)
      console.log(
        "[v0] All appointments:",
        updated.map((apt) => ({
          patient: apt.patient.name,
          date: apt.date,
          time: apt.time,
          status: apt.status,
        })),
      )
      return updated
    })

    alert(
      `✅ Appointment scheduled successfully!\n\nPatient: ${appointment.patient.name}\nDate: ${new Date(appointment.date).toLocaleDateString()}\nTime: ${appointment.time}\n\nNote: This appointment is stored temporarily. Add a database integration to persist appointments permanently.`,
    )
  }

  const handleInvitationSent = (newInvitation: Omit<InvitationStatus, "id" | "createdAt">) => {
    const invitation: InvitationStatus = {
      ...newInvitation,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setInvitations((prev) => [...prev, invitation])
  }

  const handleCreateClick = () => {
    setIsAppointmentModalOpen(true)
  }

  const handleInviteClick = () => {
    setIsInviteModalOpen(true)
  }

  const getInvitationStatusColor = (status: InvitationStatus["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Declined":
        return "bg-red-100 text-red-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatInvitationDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const days = getDaysInMonth(currentDate)
  const stats = {
    scheduled: appointments.filter((apt) => apt.status === "Scheduled").length,
    cancelled: appointments.filter((apt) => apt.status === "Cancelled").length,
    checkedIn: appointments.filter((apt) => apt.status === "Confirmed").length,
    checkedOut: appointments.filter((apt) => apt.status === "Completed").length,
    digitalHPI: appointments.filter((apt) => apt.status === "In Progress").length,
  }
  const selectedDateAppointments = getDateAppointments(selectedDate)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Create
          </button>
          <button
            onClick={handleInviteClick}
            className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-md shadow-sm hover:bg-orange-200 border border-orange-200 transition-colors"
          >
            <FaUserPlus className="w-4 h-4" />
            Invite
          </button>
          <button
            onClick={() => {
              console.log("[v0] Current appointments:", appointments)
              console.log("[v0] Selected date:", selectedDate.toISOString().split("T")[0])
              console.log("[v0] Appointments for selected date:", getDateAppointments(selectedDate))
              alert(
                `Debug Info:\n\nTotal Appointments: ${appointments.length}\nSelected Date: ${selectedDate.toLocaleDateString()}\nAppointments Today: ${getDateAppointments(selectedDate).length}\n\nCheck browser console for detailed logs.`,
              )
            }}
            className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-md shadow-sm hover:bg-blue-200 border border-blue-200 transition-colors"
          >
            Debug ({appointments.length})
          </button>
        </div>
      </div>

      {appointments.length > mockAppointments.length && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Temporary Storage:</strong> You have {appointments.length - mockAppointments.length} new
            appointment(s) stored in memory. These will be lost when you refresh the page. Set up a database integration
            to persist appointments permanently.
          </p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">
          <span className="inline-block w-4 h-4 bg-orange-500 rounded mr-2"></span>
          Invited Patients ({invitations.length})
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          {invitations.length > 0 ? (
            <div className="space-y-3">
              {invitations.slice(0, 3).map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <FaEnvelope className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{invitation.patient.name}</h4>
                      <p className="text-xs text-gray-600">
                        Invited {formatInvitationDate(invitation.invitedDate)} •{invitation.preferredDates.length} date
                        {invitation.preferredDates.length !== 1 ? "s" : ""} suggested
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getInvitationStatusColor(invitation.status)}`}
                    >
                      {invitation.status}
                    </span>
                    <FaClock className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              ))}
              {invitations.length > 3 && (
                <p className="text-xs text-gray-600 text-center pt-2">+{invitations.length - 3} more invitations</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No patients invited yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FaChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FaChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const dayAppointments = getDateAppointments(date)
                  return (
                    <button
                      key={index}
                      onClick={() => date && handleDateClick(date)}
                      className={`
                        p-2 text-sm rounded-md transition-colors min-h-[50px] relative flex flex-col items-center justify-center
                        ${!date ? "invisible" : ""}
                        ${isToday(date) ? "bg-orange-500 text-white font-semibold" : ""}
                        ${isSelected(date) && !isToday(date) ? "bg-orange-100 text-orange-600 ring-2 ring-orange-300" : ""}
                        ${!isToday(date) && !isSelected(date) ? "hover:bg-gray-100 text-gray-700" : ""}
                        ${hasAppointments(date) && !isToday(date) && !isSelected(date) ? "bg-blue-50 border border-blue-200" : ""}
                      `}
                      disabled={!date}
                    >
                      <span className="relative z-10">{date?.getDate()}</span>
                      {dayAppointments.length > 0 && (
                        <span
                          className={`text-xs mt-1 px-1 rounded ${
                            isToday(date)
                              ? "bg-white bg-opacity-20 text-white"
                              : isSelected(date)
                                ? "bg-orange-200 text-orange-800"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {dayAppointments.length}
                        </span>
                      )}
                      {getAppointmentStatusIndicators(date)}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Appointment Status:</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Scheduled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">In Progress</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{appointment.patient.name}</h4>
                            <p className="text-xs text-gray-600">
                              {formatTime(appointment.time)} • {appointment.duration}min
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Type:</span> {appointment.type}
                          </p>
                          {appointment.symptoms && (
                            <p className="text-xs text-gray-700">
                              <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                            </p>
                          )}
                          {appointment.notes && (
                            <p className="text-xs text-gray-700">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <FaPlus className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">No appointments scheduled</p>
                  <button
                    onClick={handleCreateClick}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Schedule Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[
          { label: "Scheduled", count: stats.scheduled, color: "bg-orange-100 text-orange-600 border-orange-200" },
          { label: "Cancelled", count: stats.cancelled, color: "bg-red-100 text-red-600 border-red-200" },
          { label: "Checked-in", count: stats.checkedIn, color: "bg-green-100 text-green-600 border-green-200" },
          { label: "Checked-out", count: stats.checkedOut, color: "bg-blue-100 text-blue-600 border-blue-200" },
          { label: "Digital HPI", count: stats.digitalHPI, color: "bg-purple-100 text-purple-600 border-purple-200" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} border rounded-lg p-3 text-center shadow-sm`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-lg font-semibold">{count}</p>
          </div>
        ))}
      </div>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        selectedDate={selectedDate}
        onAppointmentCreated={handleAppointmentCreated}
      />

      <InvitePatientModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  )
}

export { CalendarView }
export default CalendarView
