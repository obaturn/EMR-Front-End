import api from './Api';

export interface GeneratedReport {
  id: number;
  name: string;
  generatedDate: string;
  generatedBy: string;
  format: string;
}

export interface PatientData {
  id: number;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string;
  category: string;
  created_at: string;
}

export interface ReportData {
  report_name: string;
  generated_date: string;
  generated_by: string;
  format: string;
  patients: PatientData[];
}

export interface GenerateReportData {
  name: string;
  date_range_start?: string;
  date_range_end?: string;
  department?: string;
  format: 'pdf' | 'excel' | 'csv';
  include_demographics?: boolean;
  include_statistics?: boolean;
  include_detailed_records?: boolean;
  category?: string;
}

export const reportService = {
  getReports: async (category?: string): Promise<GeneratedReport[]> => {
    try {
      const response = await api.get('/reports/', {
        params: category ? { category } : {},
      });
      return response.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        generatedDate: r.generated_date.split('T')[0],
        generatedBy: r.generated_by,
        format: r.format,
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  generateReport: async (reportData: GenerateReportData): Promise<GeneratedReport> => {
    try {
      const response = await api.post('/reports/generate/', reportData);
      return {
        id: response.data.id,
        name: response.data.name,
        generatedDate: response.data.generated_date.split('T')[0],
        generatedBy: response.data.generated_by,
        format: response.data.format,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  viewReport: async (id: number, fileName: string): Promise<void> => {
    try {
      const response = await api.get(`/reports/${id}/view/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  getReportData: async (id: number): Promise<ReportData> => {
    try {
      const response = await api.get(`/reports/${id}/data/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      throw error;
    }
  },

  exportAllReports: async (): Promise<void> => {
    try {
      const response = await api.get('/reports/export-all/', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `reports_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting all reports:', error);
      throw error;
    }
  },
};