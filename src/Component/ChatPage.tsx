import React from 'react'
import AdminDashboardLayout from './AdminDashboardLayout'

// Simple inline chat component to avoid import issues
const SimpleChat: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Chat</h1>
        <p className="text-gray-600">Chat functionality is being loaded...</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">Chat System</h3>
          <p>Please use the chat button in the dashboard sidebar to start chatting.</p>
        </div>
      </div>
    </div>
  )
}

const ChatPage: React.FC = () => {
  return (
    <AdminDashboardLayout userName="Dr. Akintoye">
      <SimpleChat />
    </AdminDashboardLayout>
  )
}

export default ChatPage