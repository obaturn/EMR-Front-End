"use client";

import { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaComments,
  FaLifeRing,
  FaPlus,
  FaSearch,
  FaFilter,
  FaStar,
  FaBullhorn,
  FaLightbulb,
  FaTimes,
  FaPaperPlane,
  FaEye,
  FaThumbsUp,
} from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { healthPromotionService, type HealthCampaign, type EducationalResource } from "../ApiService/HealthPromotionService";
import { feedbackService, type Feedback } from "../ApiService/FeedbackService";
import { supportService, type SupportRequest } from "../ApiService/SupportService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface HealthPromotionPageProps {
  userRole?: string;
  userName?: string;
}


const HealthPromotionPage = ({ userName = "Dr. Akintoye" }: HealthPromotionPageProps) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'resources' | 'feedback' | 'support'>('campaigns');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // State for API data
  const [campaigns, setCampaigns] = useState<HealthCampaign[]>([]);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);

  // Form states
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
    category: "General",
    rating: 5
  });

  const [supportForm, setSupportForm] = useState({
    subject: "",
    description: "",
    category: "General",
    priority: "medium" as 'low' | 'medium' | 'high' | 'urgent'
  });

  const categories = ["all", "Prevention", "Awareness", "Mental Health", "Cardiovascular", "Nutrition", "General"];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [campaignsData, resourcesData, feedbacksData, supportData] = await Promise.all([
        healthPromotionService.getCampaigns(),
        healthPromotionService.getResources(),
        feedbackService.getFeedbacks(),
        supportService.getSupportRequests()
      ]);

      setCampaigns(campaignsData);
      setResources(resourcesData);
      setFeedbacks(feedbacksData);
      setSupportRequests(supportData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feedbackService.createFeedback({
        subject: feedbackForm.subject,
        message: feedbackForm.message,
        category: feedbackForm.category,
        rating: feedbackForm.rating
      });
      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      setFeedbackForm({ subject: "", message: "", category: "General", rating: 5 });
      fetchAllData(); // Refresh data
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supportService.createSupportRequest({
        subject: supportForm.subject,
        description: supportForm.description,
        category: supportForm.category,
        priority: supportForm.priority
      });
      toast.success("Support request submitted successfully!");
      setShowSupportModal(false);
      setSupportForm({ subject: "", description: "", category: "General", priority: "medium" });
      fetchAllData(); // Refresh data
    } catch (error) {
      toast.error("Failed to submit support request");
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    (selectedCategory === "all" || campaign.category === selectedCategory) &&
    (campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredResources = resources.filter(resource =>
    (selectedCategory === "all" || resource.category === selectedCategory) &&
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Promotion & Support</h1>
          <p className="text-gray-600">Promote wellness, provide education, and support our healthcare community</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'campaigns', label: 'Health Campaigns', icon: FaBullhorn },
              { id: 'resources', label: 'Educational Resources', icon: FaBookOpen },
              { id: 'feedback', label: 'Feedback & Reviews', icon: FaComments },
              { id: 'support', label: 'Support Center', icon: FaLifeRing }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            {(activeTab === 'feedback' || activeTab === 'support') && (
              <button
                onClick={() => activeTab === 'feedback' ? setShowFeedbackModal(true) : setShowSupportModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 font-medium"
              >
                <FaPlus className="w-4 h-4" />
                {activeTab === 'feedback' ? 'Give Feedback' : 'Request Support'}
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Content based on active tab */}
        {!loading && activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-2">{campaign.title}</h3>
                    <p className="text-blue-100 text-sm">{campaign.target_audience}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{campaign.category}</span>
                    <span>{campaign.participants} participants</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    resource.type === 'video' ? 'bg-red-100 text-red-600' :
                    resource.type === 'article' ? 'bg-blue-100 text-blue-600' :
                    resource.type === 'infographic' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {resource.type === 'video' && <FaBookOpen className="w-6 h-6" />}
                    {resource.type === 'article' && <FaBookOpen className="w-6 h-6" />}
                    {resource.type === 'infographic' && <FaLightbulb className="w-6 h-6" />}
                    {resource.type === 'guide' && <FaBookOpen className="w-6 h-6" />}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(resource.category)}`}>
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {resource.author_name}</span>
                  <span>{resource.read_time} min read</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaEye className="w-4 h-4" />
                      {resource.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaThumbsUp className="w-4 h-4" />
                      {resource.likes}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedResource(resource);
                      setShowResourceModal(true);
                    }}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm font-medium"
                  >
                    View Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'feedback' && (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {feedback.user_name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.user_name}</h3>
                      <p className="text-sm text-gray-500">{feedback.user_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feedback.subject}</h4>
                <p className="text-gray-600 mb-4">{feedback.message}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{feedback.category}</span>
                  <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'support' && (
          <div className="space-y-6">
            {supportRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {request.user_name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.user_name}</h3>
                      <p className="text-sm text-gray-500">{request.user_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{request.subject}</h4>
                <p className="text-gray-600 mb-4">{request.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{request.category}</span>
                  <span>{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
                {request.assigned_to_name && (
                  <div className="mt-2 text-sm text-gray-600">
                    Assigned to: {request.assigned_to_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Your Feedback</h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="Programs">Programs</option>
                    <option value="Resources">Resources</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className="text-2xl"
                      >
                        <FaStar className={star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaPaperPlane className="inline mr-2" />
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Request Support</h3>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="Technical">Technical</option>
                    <option value="Planning">Planning</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={supportForm.description}
                    onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FaPaperPlane className="inline mr-2" />
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resource Modal */}
        {showResourceModal && selectedResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedResource.title}</h3>
                <button
                  onClick={() => {
                    setShowResourceModal(false);
                    setSelectedResource(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>By {selectedResource.author_name}</span>
                  <span>{selectedResource.read_time} min read</span>
                  <span>{new Date(selectedResource.publish_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedResource.category)}`}>
                    {selectedResource.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedResource.type)}`}>
                    {selectedResource.type}
                  </span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{selectedResource.description}</p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <p className="text-gray-600">
                    This is a placeholder for the full content of the {selectedResource.type}.
                    In a real application, this would contain the complete article, video embed, or infographic.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaEye className="w-4 h-4" />
                    {selectedResource.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaThumbsUp className="w-4 h-4" />
                    {selectedResource.likes}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                    <FaThumbsUp className="inline mr-2" />
                    Like
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminDashboardLayout>
  );
};

export default HealthPromotionPage;