import api from './Api'
import type { Diagnostic, DiagnosticCreateData } from '../types/appointment'

export const diagnosticService = {
  getDiagnostics: async (): Promise<Diagnostic[]> => {
    try {
      const response = await api.get('/diagnostics/')
      console.log('Fetched diagnostics:', response.data)
      return response.data || []
    } catch (error: any) {
      console.error('Error fetching diagnostics:', error.response?.data || error.message)
      throw error
    }
  },
  createDiagnostic: async (data: DiagnosticCreateData): Promise<Diagnostic> => {
    try {
      console.log('Creating diagnostic with data:', data)
      const response = await api.post('/diagnostics/', data)
      
      console.log('Created diagnostic:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error creating diagnostic:', error.response?.data || error.message)
      throw error
    }
  }
}