import api from "./Api"

export interface AnalyticsData {
  overview: {
    total_patients: number
    total_appointments: number
    completed_appointments: number
    pending_diagnostics: number
    total_reports: number
    average_wait_time: number
  }
  trends: {
    patient_growth: Array<{
      date: string
      count: number
    }>
    appointment_trends: Array<{
      date: string
      count: number
    }>
    diagnostic_completion: Array<{
      date: string
      count: number
    }>
  }
  performance: {
    appointment_completion_rate: number
    diagnostic_turnaround_time: number
    patient_satisfaction: number
    resource_utilization: number
  }
  demographics: {
    age_distribution: Array<{
      range: string
      percentage: number
    }>
    gender_distribution: Array<{
      gender: string
      percentage: number
    }>
    appointment_types: Array<{
      type: string
      count: number
    }>
  }
  alerts: Array<{
    id: string
    type: 'warning' | 'info' | 'success'
    message: string
    action_url?: string
  }>
}

export const analyticsService = {
  async getAnalyticsData(timeRange: "week" | "month" | "quarter" | "year" = "month"): Promise<AnalyticsData> {
    const response = await api.get(`/analytics/dashboard/?period=${timeRange}`)
    return response.data
  },

  async getPatientAnalytics(): Promise<any> {
    const response = await api.get('/analytics/patients/')
    return response.data
  },

  async getAppointmentAnalytics(): Promise<any> {
    const response = await api.get('/analytics/appointments/')
    return response.data
  },

  async getDiagnosticAnalytics(): Promise<any> {
    const response = await api.get('/analytics/diagnostics/')
    return response.data
  },

  async exportAnalyticsReport(format: "pdf" | "excel" | "csv" = "pdf"): Promise<Blob> {
    const response = await api.get(`/analytics/export/?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  }
}