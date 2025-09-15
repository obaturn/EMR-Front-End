"use client";

import { useState, useEffect } from "react";
import {
  FaLifeRing,
  FaPlus,
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaPaperPlane,
  FaCalendarAlt,
  FaComment,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supportService } from "../ApiService/SupportService";
import type { SupportRequest } from "../ApiService/SupportService";

interface SupportPageProps {
  userRole?: string;
  userName?: string;
}


const SupportPage = ({ userName = "Dr. Akintoye" }: SupportPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const data = await supportService.getSupportRequests();
      setSupportRequests(data);
    } catch (error) {
      console.error('Error fetching support requests:', error);
      toast.error('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  // Form states
  const [supportForm, setSupportForm] = useState({
    subject: "",
    description: "",
    category: "General",
    priority: "medium" as 'low' | 'medium' | 'high' | 'urgent'
  });

  const [responseForm, setResponseForm] = useState({
    message: ""
  });

  const categories = ["all", "Technical", "Planning", "Training", "General"];
  const statuses = ["all", "open", "in-progress", "resolved", "closed"];
  const priorities = ["all", "low", "medium", "high", "urgent"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <FaExclamationTriangle className="w-4 h-4" />;
      case 'high': return <FaArrowUp className="w-4 h-4" />;
      case 'medium': return <FaMinus className="w-4 h-4" />;
      case 'low': return <FaArrowDown className="w-4 h-4" />;
      default: return <FaMinus className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <FaClock className="w-4 h-4" />;
      case 'in-progress': return <FaClock className="w-4 h-4" />;
      case 'resolved': return <FaCheckCircle className="w-4 h-4" />;
      case 'closed': return <FaTimes className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
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
      fetchSupportRequests(); // Refresh data
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error("Failed to submit support request");
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      // In real app, this would make an API call
      console.log('Submitting response:', responseForm);
      toast.success("Response submitted successfully!");
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseForm({ message: "" });
    } catch (error) {
      toast.error("Failed to submit response");
    }
  };

  const filteredRequests = supportRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const getSupportStats = () => {
    const total = supportRequests.length;
    const open = supportRequests.filter(r => r.status === 'open').length;
    const inProgress = supportRequests.filter(r => r.status === 'in-progress').length;
    const resolved = supportRequests.filter(r => r.status === 'resolved').length;
    const urgent = supportRequests.filter(r => r.priority === 'urgent').length;

    return { total, open, inProgress, resolved, urgent };
  };

  const stats = getSupportStats();

  if (loading) {
    return (
      <AdminDashboardLayout userName={userName}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading support requests...</span>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help and support for healthcare system issues</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaLifeRing className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaClock className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClock className="text-orange-600 text-xl" />
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
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaExclamationTriangle className="text-red-600 text-xl" />
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
                placeholder="Search support requests by subject, description, or user..."
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
              <div className="flex items-center gap-2">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === "all" ? "All Priority" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowSupportModal(true)}
                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-700 flex items-center gap-2 font-medium"
              >
                <FaPlus className="w-4 h-4" />
                Request Support
              </button>
            </div>
          </div>
        </div>

        {/* Support Requests List */}
        <div className="space-y-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {request.user_name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.user_name}</h3>
                      <p className="text-sm text-gray-500">{request.user_role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {getPriorityIcon(request.priority)}
                      {request.priority}
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{request.subject}</h4>
                  <p className="text-gray-600 mb-3">{request.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.category)}`}>
                      {request.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="w-4 h-4" />
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>


                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowResponseModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center gap-2"
                  >
                    <FaComment className="w-4 h-4" />
                    Respond
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FaLifeRing className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No support requests found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" || selectedPriority !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No support requests have been submitted yet."}
              </p>
              <button
                onClick={() => setShowSupportModal(true)}
                className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-700 font-medium"
              >
                Submit First Request
              </button>
            </div>
          )}
        </div>

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

        {/* Response Modal */}
        {showResponseModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Respond to Support Request</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.subject}</h4>
                <p className="text-gray-600 text-sm">{selectedRequest.description}</p>
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
                      setSelectedRequest(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default SupportPage;