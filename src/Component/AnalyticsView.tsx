import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Activity,
  PieChart,
  LineChart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"
import { analyticsService } from "../ApiService/AnalyticsService.js"
import type { AnalyticsData } from "../ApiService/AnalyticsService.js"
import { toast } from 'react-toastify'

interface AnalyticsViewProps {
  userRole?: string
  userName?: string
}

export const AnalyticsView = ({ userRole = "doctor", userName = "User" }: AnalyticsViewProps) => {
  const navigate = useNavigate()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [userRole, timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const data = await analyticsService.getAnalyticsData(timeRange)
      setAnalyticsData(data)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
      toast.error("Failed to load analytics data")
      // Set default empty data
      setAnalyticsData({
        overview: {
          total_patients: 0,
          total_appointments: 0,
          completed_appointments: 0,
          pending_diagnostics: 0,
          total_reports: 0,
          average_wait_time: 0
        },
        trends: {
          patient_growth: [],
          appointment_trends: [],
          diagnostic_completion: []
        },
        performance: {
          appointment_completion_rate: 0,
          diagnostic_turnaround_time: 0,
          patient_satisfaction: 0,
          resource_utilization: 0
        },
        demographics: {
          age_distribution: [],
          gender_distribution: [],
          appointment_types: []
        },
        alerts: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalyticsData()
    setIsRefreshing(false)
    toast.success("Analytics data refreshed")
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor": return "Doctor"
      case "nurse": return "Nurse"
      case "pharmacy": return "Pharmacist"
      case "admin": return "Administrator"
      default: return "User"
    }
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
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
            {[...Array(8)].map((_, i) => (
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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights for {getRoleDisplayName(userRole)} - {userName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "quarter" | "year")}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData?.overview.total_patients || 0}</p>
                <p className="text-xs text-green-600 mt-1">↗️ +12% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData?.overview.total_appointments || 0}</p>
                <p className="text-xs text-green-600 mt-1">↗️ +8% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPercentage(analyticsData?.performance.appointment_completion_rate || 0)}
                </p>
                <p className="text-xs text-green-600 mt-1">↗️ +5% from last month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatTime(analyticsData?.overview.average_wait_time || 0)}
                </p>
                <p className="text-xs text-red-600 mt-1">↗️ +2min from last month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-800">Appointment Completion</h4>
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPercentage(analyticsData?.performance.appointment_completion_rate || 0)}
                  </p>
                  <p className="text-sm text-blue-700">Target: 95%</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-green-800">Diagnostic TAT</h4>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {formatTime(analyticsData?.performance.diagnostic_turnaround_time || 0)}
                  </p>
                  <p className="text-sm text-green-700">Target: Less than 24h</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-purple-800">Patient Satisfaction</h4>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    {formatPercentage(analyticsData?.performance.patient_satisfaction || 0)}
                  </p>
                  <p className="text-sm text-purple-700">Target: 90%</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-orange-800">Resource Utilization</h4>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    {formatPercentage(analyticsData?.performance.resource_utilization || 0)}
                  </p>
                  <p className="text-sm text-orange-700">Target: 85%</p>
                </div>
              </div>
            </div>

            {/* Trends Chart Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Trends & Insights</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">Advanced Analytics Chart</h4>
                <p className="text-gray-500 mb-4">
                  Interactive charts showing patient growth, appointment trends, and diagnostic completion rates over time.
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Patient Growth</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Appointments</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Diagnostics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demographics & Alerts */}
          <div>
            {/* Demographics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Patient Demographics</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Age Distribution</span>
                    <PieChart className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {analyticsData?.demographics.age_distribution.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.range}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>18-30</span>
                          <span className="font-medium">35%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>31-50</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>51+</span>
                          <span className="font-medium">20%</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Gender Distribution</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {analyticsData?.demographics.gender_distribution.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.gender}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Female</span>
                          <span className="font-medium">58%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Male</span>
                          <span className="font-medium">42%</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">System Alerts</h3>
              {analyticsData?.alerts && analyticsData.alerts.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.alerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{alert.message}</p>
                        {alert.action_url && (
                          <button
                            onClick={() => navigate(alert.action_url)}
                            className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
                          >
                            Take Action
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">All systems operating normally</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(`/${userRole}/reports`)}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-800">Export Reports</h4>
              <p className="text-sm text-gray-600">Download analytics data</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/patients`)}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <Users className="w-6 h-6 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-800">Patient Insights</h4>
              <p className="text-sm text-gray-600">Detailed patient analytics</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/calendar`)}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <Calendar className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-800">Schedule Analysis</h4>
              <p className="text-sm text-gray-600">Appointment optimization</p>
            </button>

            <button
              onClick={() => navigate(`/${userRole}/diagnostics`)}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
            >
              <Activity className="w-6 h-6 text-orange-600 mb-2" />
              <h4 className="font-medium text-gray-800">Diagnostic Trends</h4>
              <p className="text-sm text-gray-600">Test performance metrics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}