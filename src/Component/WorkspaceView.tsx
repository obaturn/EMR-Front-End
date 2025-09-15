import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, FileText, Calendar, Users, BarChart3, Clock, CheckCircle, Activity } from "lucide-react"
import { workspaceService } from "../ApiService/WorkspaceService"
import type { WorkspaceData } from "../ApiService/WorkspaceService"
import { toast } from 'react-toastify'

interface WorkspaceViewProps {
  userRole?: string
  userName?: string
}

export const WorkspaceView = ({ userRole = "doctor", userName = "User" }: WorkspaceViewProps) => {
  const navigate = useNavigate()
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setIsLoading(true)
        const data = await workspaceService.getDashboardData()
        setWorkspaceData(data)
      } catch (error) {
        console.error("Failed to fetch workspace data:", error)
        toast.error("Failed to load workspace data")
        // Set default empty data
        setWorkspaceData({
          today_appointments: [],
          pending_tasks: [],
          recent_activity: [],
          patient_stats: {
            total_patients: 0,
            with_appointments: 0,
            pending_diagnostics: 0,
            completed_today: 0
          },
          alerts: []
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaceData()
  }, [userRole])

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor": return "Doctor"
      case "nurse": return "Nurse"
      case "pharmacy": return "Pharmacist"
      case "admin": return "Administrator"
      default: return "User"
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500 bg-red-50"
      case "medium": return "border-yellow-500 bg-yellow-50"
      case "low": return "border-green-500 bg-green-50"
      default: return "border-gray-500 bg-gray-50"
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Medical Workspace</h1>
              <p className="text-gray-600 mt-1">Personal workspace for {getRoleDisplayName(userRole)} - {userName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{workspaceData?.today_appointments.length || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{workspaceData?.pending_tasks.length || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-green-600">{workspaceData?.patient_stats.total_patients || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-purple-600">{workspaceData?.patient_stats.completed_today || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h3>
              {workspaceData?.today_appointments.length ? (
                <div className="space-y-3">
                  {workspaceData.today_appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.patient_name}</h4>
                          <p className="text-sm text-gray-600">{appointment.time} • {appointment.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Tasks</h3>
              {workspaceData?.pending_tasks.length ? (
                <div className="space-y-3">
                  {workspaceData.pending_tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}>
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-600">{task.patient_name}</p>
                      {task.due_date && (
                        <p className="text-xs text-gray-500 mt-1">Due: {task.due_date}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">All tasks completed!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {workspaceData?.recent_activity.length ? (
            <div className="space-y-3">
              {workspaceData.recent_activity.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(`/${userRole}/patients`)}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-800">View Patients</h4>
              <p className="text-sm text-gray-600">Manage patient records</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/calendar`)}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-800">Schedule Appointment</h4>
              <p className="text-sm text-gray-600">Book new appointments</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/diagnostics`)}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-800">View Diagnostics</h4>
              <p className="text-sm text-gray-600">Check test results</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/reports`)}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
            >
              <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
              <h4 className="font-medium text-gray-800">Generate Reports</h4>
              <p className="text-sm text-gray-600">Create analytics reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}