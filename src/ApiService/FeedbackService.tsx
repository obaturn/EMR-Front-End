import api from './Api';

export interface Feedback {
  id: number;
  user: number;
  user_name: string;
  user_role: string;
  subject: string;
  message: string;
  category: string;
  rating: number;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface FeedbackResponse {
  id: number;
  feedback: number;
  responder: number;
  responder_name: string;
  responder_role: string;
  message: string;
  created_at: string;
}

export interface FeedbackCreate {
  subject: string;
  message: string;
  category?: string;
  rating?: number;
}

export interface FeedbackResponseCreate {
  message: string;
}

export const feedbackService = {
  // Feedback CRUD
  getFeedbacks: async (status?: string, category?: string): Promise<Feedback[]> => {
    try {
      const params: { status?: string; category?: string } = {};
      if (status) params.status = status;
      if (category) params.category = category;

      const response = await api.get('/feedback/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  },

  getFeedback: async (id: number): Promise<Feedback> => {
    try {
      const response = await api.get(`/feedback/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  createFeedback: async (data: FeedbackCreate): Promise<Feedback> => {
    try {
      const response = await api.post('/feedback/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },

  updateFeedback: async (id: number, data: Partial<Feedback>): Promise<Feedback> => {
    try {
      const response = await api.put(`/feedback/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  },

  deleteFeedback: async (id: number): Promise<void> => {
    try {
      await api.delete(`/feedback/${id}/`);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  },

  // Feedback Responses
  getFeedbackResponses: async (feedbackId: number): Promise<FeedbackResponse[]> => {
    try {
      const response = await api.get(`/feedback/${feedbackId}/responses/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback responses:', error);
      throw error;
    }
  },

  createFeedbackResponse: async (feedbackId: number, data: FeedbackResponseCreate): Promise<FeedbackResponse> => {
    try {
      const response = await api.post(`/feedback/${feedbackId}/responses/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback response:', error);
      throw error;
    }
  },
};