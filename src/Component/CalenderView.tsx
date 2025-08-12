"use client"

import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlus, FaUserPlus } from 'react-icons/fa'

type CalendarValue = Date

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
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

  const days = getDaysInMonth(currentDate)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex space-x-3">
          <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors">
            <FaPlus className="w-4 h-4" />
            Create
          </button>
          <button className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-md shadow-sm hover:bg-orange-200 border border-orange-200 transition-colors">
            <FaUserPlus className="w-4 h-4" />
            Invite
          </button>
        </div>
      </div>

  
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">
          <span className="inline-block w-4 h-4 bg-orange-500 rounded mr-2"></span>
          Invited Patients
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-gray-600">No patients invited yet.</p>
        </div>
      </div>

      
      <div className="bg-white shadow-sm rounded-lg mb-6 border border-gray-200">
        <div className="p-6">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FaChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
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
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => date && setSelectedDate(date)}
                className={`
                  p-2 text-sm rounded-md transition-colors min-h-[40px]
                  ${!date ? 'invisible' : ''}
                  ${isToday(date) ? 'bg-orange-500 text-white font-semibold' : ''}
                  ${isSelected(date) && !isToday(date) ? 'bg-orange-100 text-orange-600' : ''}
                  ${!isToday(date) && !isSelected(date) ? 'hover:bg-gray-100 text-gray-700' : ''}
                `}
                disabled={!date}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[
          { label: 'Scheduled', count: 0, color: 'bg-orange-100 text-orange-600 border-orange-200' },
          { label: 'Cancelled', count: 0, color: 'bg-red-100 text-red-600 border-red-200' },
          { label: 'Checked-in', count: 0, color: 'bg-green-100 text-green-600 border-green-200' },
          { label: 'Checked-out', count: 0, color: 'bg-blue-100 text-blue-600 border-blue-200' },
          { label: 'Digital HPI', count: 0, color: 'bg-purple-100 text-purple-600 border-purple-200' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} border rounded-lg p-3 text-center shadow-sm`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-lg font-semibold">{count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarView
