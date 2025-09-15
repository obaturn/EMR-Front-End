import api from './Api';

export interface SupportRequest {
  id: number;
  user: number;
  user_name: string;
  user_role: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assigned_to?: number;
  assigned_to_name?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportResponse {
  id: number;
  support_request: number;
  responder: number;
  responder_name: string;
  responder_role: string;
  message: string;
  created_at: string;
}

export interface SupportRequestCreate {
  subject: string;
  description: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SupportResponseCreate {
  message: string;
}

export const supportService = {
  // Support Requests CRUD
  getSupportRequests: async (status?: string, priority?: string, category?: string): Promise<SupportRequest[]> => {
    try {
      const params: { status?: string; priority?: string; category?: string } = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (category) params.category = category;

      const response = await api.get('/support/requests/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching support requests:', error);
      throw error;
    }
  },

  getSupportRequest: async (id: number): Promise<SupportRequest> => {
    try {
      const response = await api.get(`/support/requests/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching support request:', error);
      throw error;
    }
  },

  createSupportRequest: async (data: SupportRequestCreate): Promise<SupportRequest> => {
    try {
      const response = await api.post('/support/requests/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating support request:', error);
      throw error;
    }
  },

  updateSupportRequest: async (id: number, data: Partial<SupportRequest>): Promise<SupportRequest> => {
    try {
      const response = await api.put(`/support/requests/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating support request:', error);
      throw error;
    }
  },

  deleteSupportRequest: async (id: number): Promise<void> => {
    try {
      await api.delete(`/support/requests/${id}/`);
    } catch (error) {
      console.error('Error deleting support request:', error);
      throw error;
    }
  },

  // Support Responses
  getSupportResponses: async (supportRequestId: number): Promise<SupportResponse[]> => {
    try {
      const response = await api.get(`/support/requests/${supportRequestId}/responses/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching support responses:', error);
      throw error;
    }
  },

  createSupportResponse: async (supportRequestId: number, data: SupportResponseCreate): Promise<SupportResponse> => {
    try {
      const response = await api.post(`/support/requests/${supportRequestId}/responses/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating support response:', error);
      throw error;
    }
  },
};