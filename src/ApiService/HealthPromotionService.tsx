import api from './Api';

export interface HealthCampaign {
  id: number;
  title: string;
  description: string;
  category: string;
  target_audience: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'upcoming' | 'completed';
  participants: number;
  image_url?: string;
  created_by_name: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface EducationalResource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'infographic' | 'guide';
  content?: string;
  video_url?: string;
  file?: string;
  file_url?: string;
  author_name: string;
  author: number;
  publish_date: string;
  read_time: number;
  views: number;
  likes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthPromotionStats {
  campaigns: {
    total: number;
    active: number;
  };
  resources: {
    total: number;
  };
  feedback: {
    total: number;
    resolved: number;
    average_rating: number;
  };
  support: {
    total: number;
    resolved: number;
  };
}

export const healthPromotionService = {
  // Health Campaigns
  getCampaigns: async (status?: string, category?: string): Promise<HealthCampaign[]> => {
    try {
      const params: { status?: string; category?: string } = {};
      if (status) params.status = status;
      if (category) params.category = category;

      const response = await api.get('/health-promotion/campaigns/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  getCampaign: async (id: number): Promise<HealthCampaign> => {
    try {
      const response = await api.get(`/health-promotion/campaigns/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  createCampaign: async (data: Omit<HealthCampaign, 'id' | 'created_by_name' | 'created_by' | 'created_at' | 'updated_at'>): Promise<HealthCampaign> => {
    try {
      const response = await api.post('/health-promotion/campaigns/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  updateCampaign: async (id: number, data: Partial<HealthCampaign>): Promise<HealthCampaign> => {
    try {
      const response = await api.put(`/health-promotion/campaigns/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  deleteCampaign: async (id: number): Promise<void> => {
    try {
      await api.delete(`/health-promotion/campaigns/${id}/`);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // Educational Resources
  getResources: async (category?: string, type?: string): Promise<EducationalResource[]> => {
    try {
      const params: { category?: string; type?: string } = {};
      if (category) params.category = category;
      if (type) params.type = type;

      const response = await api.get('/health-promotion/resources/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  getResource: async (id: number): Promise<EducationalResource> => {
    try {
      const response = await api.get(`/health-promotion/resources/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  createResource: async (data: Omit<EducationalResource, 'id' | 'author_name' | 'author' | 'created_at' | 'updated_at' | 'file_url'>): Promise<EducationalResource> => {
    try {
      const response = await api.post('/health-promotion/resources/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  updateResource: async (id: number, data: Partial<EducationalResource>): Promise<EducationalResource> => {
    try {
      const response = await api.put(`/health-promotion/resources/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  deleteResource: async (id: number): Promise<void> => {
    try {
      await api.delete(`/health-promotion/resources/${id}/`);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Statistics
  getStats: async (): Promise<HealthPromotionStats> => {
    try {
      const response = await api.get('/health-promotion/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};