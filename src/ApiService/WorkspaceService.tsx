import api from "./Api"

export interface WorkspaceData {
  today_appointments: Array<{
    id: number
    patient_name: string
    time: string
    status: string
    type: string
  }>
  pending_tasks: Array<{
    id: number
    type: 'diagnostic' | 'lab' | 'appointment'
    title: string
    patient_name: string
    priority: 'high' | 'medium' | 'low'
    due_date?: string
  }>
  recent_activity: Array<{
    id: number
    type: string
    description: string
    timestamp: string
    patient_name?: string
  }>
  patient_stats: {
    total_patients: number
    with_appointments: number
    pending_diagnostics: number
    completed_today: number
  }
  alerts: Array<{
    id: number
    type: 'warning' | 'info' | 'success'
    message: string
    action_url?: string
  }>
}

export const workspaceService = {
  async getDashboardData(): Promise<WorkspaceData> {
    const response = await api.get('/workspace/dashboard/')
    return response.data
  },

  async getTodayAppointments(): Promise<any[]> {
    const response = await api.get('/appointments/today/')
    return response.data
  },

  async getPendingTasks(): Promise<any[]> {
    const response = await api.get('/workspace/pending-tasks/')
    return response.data
  },

  async getRecentActivity(limit: number = 10): Promise<any[]> {
    const response = await api.get(`/workspace/recent-activity/?limit=${limit}`)
    return response.data
  },

  async getPatientStats(): Promise<any> {
    const response = await api.get('/workspace/patient-stats/')
    return response.data
  }
}