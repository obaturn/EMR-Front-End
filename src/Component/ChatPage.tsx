import  { useState, useEffect } from "react";
import {
  FaComments,
  FaUsers,
  FaPaperPlane,
  FaClock,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import AdminDashboardLayout from "./AdminDashboardLayout";
import ChatView from "./ChatView";
import {  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ChatPageProps {
  userRole?: string;
  userName?: string;
}

const ChatPage = ({ userName = "Dr. Akintoye" }: ChatPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const categories = ["all", "Doctors", "Nurses", "Pharmacists", "Admins"];

  // Mock data for statistics - in real app, this would come from chat service
  useEffect(() => {
    // Simulate getting chat statistics
    const mockStats = {
      onlineUsers: 5,
      totalMessages: 127,
      unreadMessages: 3,
    };

    setOnlineUsersCount(mockStats.onlineUsers);
    setTotalMessages(mockStats.totalMessages);
    setUnreadMessages(mockStats.unreadMessages);
  }, []);

  const stats = {
    onlineUsers: onlineUsersCount,
    totalMessages,
    unreadMessages,
    activeConversations: 2,
  };

  return (
    <AdminDashboardLayout userName={userName}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Chat</h1>
          <p className="text-gray-600">Communicate with your healthcare team members in real-time</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.onlineUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalMessages}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaPaperPlane className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unreadMessages}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClock className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeConversations}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaComments className="text-purple-600 text-xl" />
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
                placeholder="Search conversations or users..."
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
                      {category === "all" ? "All Roles" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <ChatView />
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminDashboardLayout>
  );
};

export default ChatPage;