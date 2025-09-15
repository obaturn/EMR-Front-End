"use client";

import { useState, useEffect } from "react";
import {
  FaComments,
  FaPlus,
  FaSearch,
  FaFilter,
  FaStar,
  FaTimes,
  FaPaperPlane,
  FaReply,
  FaEye,
  FaThumbsUp,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { feedbackService } from "../ApiService/FeedbackService";
import type { Feedback } from "../ApiService/FeedbackService";

interface FeedbackPageProps {
  userRole?: string;
  userName?: string;
}


const FeedbackPage = ({ userName = "Dr. Akintoye" }: FeedbackPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  // Form states
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
    category: "General",
    rating: 5
  });

  const [responseForm, setResponseForm] = useState({
    message: ""
  });

  const categories = ["all", "Programs", "Resources", "Support", "General"];
  const statuses = ["all", "pending", "reviewed", "resolved"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'reviewed': return <FaEye className="w-4 h-4" />;
      case 'resolved': return <FaCheckCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
      fetchFeedbacks(); // Refresh data
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback");
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    try {
      // In real app, this would make an API call
      console.log('Submitting response:', responseForm);
      toast.success("Response submitted successfully!");
      setShowResponseModal(false);
      setSelectedFeedback(null);
      setResponseForm({ message: "" });
    } catch (error) {
      toast.error("Failed to submit response");
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || feedback.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || feedback.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFeedbackStats = () => {
    const total = feedbacks.length;
    const pending = feedbacks.filter(f => f.status === 'pending').length;
    const reviewed = feedbacks.filter(f => f.status === 'reviewed').length;
    const resolved = feedbacks.filter(f => f.status === 'resolved').length;
    const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / total;

    return { total, pending, reviewed, resolved, avgRating: avgRating.toFixed(1) };
  };

  const stats = getFeedbackStats();

  if (loading) {
    return (
      <AdminDashboardLayout userName={userName}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading feedback...</span>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Reviews</h1>
          <p className="text-gray-600">Collect and manage feedback from healthcare professionals and patients</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaComments className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaEye className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgRating}⭐</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaStar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback by subject, message, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
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
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Give Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {feedback.user_name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feedback.user_name}</h3>
                      <p className="text-sm text-gray-500">{feedback.user_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                      {getStatusIcon(feedback.status)}
                      {feedback.status}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{feedback.subject}</h4>
                  <p className="text-gray-600 mb-3">{feedback.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(feedback.category)}`}>
                      {feedback.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="w-4 h-4" />
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>


                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setShowResponseModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center gap-2"
                  >
                    <FaReply className="w-4 h-4" />
                    Respond
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm font-medium flex items-center gap-2">
                    <FaThumbsUp className="w-4 h-4" />
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FaComments className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No feedback has been submitted yet."}
              </p>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium"
              >
                Submit First Feedback
              </button>
            </div>
          )}
        </div>

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

        {/* Response Modal */}
        {showResponseModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Respond to Feedback</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedFeedback.subject}</h4>
                <p className="text-gray-600 text-sm">{selectedFeedback.message}</p>
              </div>
              <form onSubmit={handleResponseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
                  <textarea
                    value={responseForm.message}
                    onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={4}
                    placeholder="Type your response here..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResponseModal(false);
                      setSelectedFeedback(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaPaperPlane className="inline mr-2" />
                    Send Response
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminDashboardLayout>
  );
};

export default FeedbackPage;