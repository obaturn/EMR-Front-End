import React from 'react'
import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa'

interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  senderRole: string
  recipientId?: string
  timestamp: string
  read: boolean
}

interface User {
  userId: string
  userName: string
  userRole: string
}

interface DashboardContentProps {
  userName?: string
  userRole?: string
  specialty?: string
  showChat?: boolean
  onChatToggle?: () => void
  unreadMessageCount?: number
  onUnreadCountsChange?: (counts: {[key: string]: number}) => void
}

// Chat Container Component
const ChatContainer: React.FC<{
  userName: string;
  userRole: string;
  onUnreadCountsChange?: (counts: {[key: string]: number}) => void;
}> = ({ userName, userRole, onUnreadCountsChange }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Generate user ID based on role and name (consistent for same user)
    const generatedUserId = `${userRole}_${userName.toLowerCase().replace(/\s+/g, '_')}`
    console.log('Generated User ID:', generatedUserId)
    setUserId(generatedUserId)
  }, [userName, userRole])

  useEffect(() => {
    if (!userId) return

    // Connect to WebSocket server
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    })

    setSocket(newSocket)

    // Handle connection
    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      setIsConnected(true)

      // Join the chat with user data
      newSocket.emit('join', {
        userId,
        userName,
        userRole
      })
    })

    // Handle disconnection
    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server')
      setIsConnected(false)
    })

    // Handle incoming messages
    newSocket.on('newMessage', (message: Message) => {
      console.log('Received message:', message)
      setMessages(prev => [...prev, message])
    })

    // Handle queued messages
    newSocket.on('queuedMessages', (queuedMessages: Message[]) => {
      console.log('Received queued messages:', queuedMessages)
      setMessages(prev => [...prev, ...queuedMessages])
    })

    // Handle online users
    newSocket.on('onlineUsers', (users: User[]) => {
      console.log('Received online users:', users)
      console.log('Current user ID:', userId)
      const filteredUsers = users.filter(user => user.userId !== userId)
      console.log('Filtered users:', filteredUsers)
      setOnlineUsers(filteredUsers)
    })

    // Handle unread counts
    newSocket.on('unreadCounts', (counts: {[key: string]: number}) => {
      console.log('Received unread counts:', counts)
      setUnreadCounts(counts)
      onUnreadCountsChange?.(counts)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [userId, userName, userRole])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) {
      console.log('Cannot send empty message')
      return
    }

    if (!socket) {
      console.log('Socket not connected')
      return
    }

    if (!selectedRecipient) {
      console.log('No recipient selected')
      return
    }

    if (!isConnected) {
      console.log('Not connected to server')
      return
    }

    const messageData = {
      text: newMessage.trim(),
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      recipientId: selectedRecipient,
      timestamp: new Date().toISOString()
    }

    console.log('Sending message:', messageData)

    try {
      socket.emit('sendMessage', messageData)
      console.log('Message sent successfully')

      // Add message to local state immediately for better UX
      const localMessage: Message = {
        ...messageData,
        id: `local_${Date.now()}`,
        read: false
      }
      setMessages(prev => [...prev, localMessage])

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredMessages = selectedRecipient
    ? messages.filter(msg =>
        (msg.senderId === userId && msg.recipientId === selectedRecipient) ||
        (msg.senderId === selectedRecipient && msg.recipientId === userId)
      )
    : []

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">Team Chat</h3>
          {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0) > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full h-5 px-2 flex items-center justify-center font-medium">
              {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)} unread
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Online Users Sidebar */}
        <div className="w-1/3 border-r border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700">Online Users</h4>
            <button
              onClick={() => {
                if (socket) {
                  console.log('Manually requesting online users...')
                  // Request updated user list from server
                  fetch('http://localhost:3001/api/users/online')
                    .then(res => res.json())
                    .then(users => {
                      console.log('Manual fetch result:', users)
                      const filteredUsers = users.filter((user: User) => user.userId !== userId)
                      setOnlineUsers(filteredUsers)
                    })
                    .catch(err => console.error('Error fetching users:', err))
                }
              }}
              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              title="Refresh online users"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <button
                  key={user.userId}
                  onClick={() => {
                    setSelectedRecipient(user.userId)
                    console.log('Selected user:', user.userName, user.userId)

                    // Mark conversation as read when selected
                    if (socket && unreadCounts[user.userId] > 0) {
                      socket.emit('markConversationAsRead', user.userId)
                      console.log('Marked conversation as read for:', user.userName)
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    selectedRecipient === user.userId
                      ? 'bg-orange-100 border-orange-300 text-orange-800 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FaUserCircle className="w-8 h-8 text-gray-400" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{user.userName}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.userRole}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCounts[user.userId] > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {unreadCounts[user.userId] > 99 ? '99+' : unreadCounts[user.userId]}
                        </div>
                      )}
                      {selectedRecipient === user.userId && (
                        <div className="text-orange-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <FaUserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No other users online</p>
                <p className="text-xs text-gray-400 mt-1">Waiting for team members to join...</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedRecipient ? (
              <>
                {filteredMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <FaUserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === userId
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="text-sm">{message.text}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <FaUserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a user to start chatting</h3>
                <p className="text-sm">Choose someone from the online users list to begin a conversation</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            {!selectedRecipient ? (
              <div className="text-center py-4">
                <div className="text-gray-500 mb-2">
                  <FaUserCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a user from the list above to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {!isConnected && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">
                      🔴 Disconnected from chat server. Messages cannot be sent.
                    </p>
                  </div>
                )}
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:bg-gray-100"
                    disabled={!isConnected}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                    Send
                  </button>
                </form>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Chatting with: {onlineUsers.find(u => u.userId === selectedRecipient)?.userName || 'Unknown'}
                </div>
                <div className="mt-1 text-xs text-gray-400 text-center">
                  User ID: {userId} | Connected: {isConnected ? 'Yes' : 'No'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardContent = ({
  userName = "User",
  userRole = "doctor",
  specialty = "",
  showChat = false,
  onChatToggle,
  unreadMessageCount = 0,
  onUnreadCountsChange
}: DashboardContentProps) => {
  // Get the proper title based on role
  const getRoleTitle = (role: string) => {
    switch (role) {
      case "doctor":
        return "Dr."
      case "nurse":
        return "Nurse"
      case "pharmacy":
        return "Pharmacist"
      default:
        return ""
    }
  }

  const roleTitle = getRoleTitle(userRole)
  const displayName = `${roleTitle} ${userName}`

  return (
    <div className="p-6">
      {/* Greeting Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Good Morning, <span className="text-orange-500">{displayName}</span>
            </h2>
            <p className="text-gray-600">Have a nice day at work</p>
            {specialty && <p className="text-sm text-gray-500 mt-1">{specialty}</p>}
          </div>

          {/* Role-based Illustration */}
          <div className="flex-shrink-0 ml-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Role-based figure */}
              <div className="relative">
                {/* Professional figure */}
                <div className="w-16 h-20 bg-blue-500 rounded-t-full relative">
                  {/* Head */}
                  <div className="w-8 h-8 bg-orange-200 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
                  {/* Role-specific accessory */}
                  {userRole === "doctor" && (
                    <div className="w-1 h-6 bg-gray-600 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                  )}
                  {userRole === "nurse" && (
                    <div className="w-3 h-2 bg-red-500 absolute top-1 left-1/2 transform -translate-x-1/2"></div>
                  )}
                  {userRole === "pharmacy" && (
                    <div className="w-2 h-4 bg-green-500 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                  )}
                </div>
                {/* Medical elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="absolute top-4 -right-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Stats</h3>
          <p className="text-gray-600">
            {userRole === "doctor" && "Patient appointments and consultations"}
            {userRole === "nurse" && "Patient care and ward activities"}
            {userRole === "pharmacy" && "Prescriptions and inventory"}
            {userRole === "patient" && "Your medical appointments and records"}
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-gray-600">
            {userRole === "doctor" && "Recent patient consultations"}
            {userRole === "nurse" && "Recent patient care activities"}
            {userRole === "pharmacy" && "Recent prescription fills"}
            {userRole === "patient" && "Recent medical activities"}
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          <p className="text-gray-600">
            {userRole === "doctor" && "Appointment reminders and alerts"}
            {userRole === "nurse" && "Patient care notifications"}
            {userRole === "pharmacy" && "Inventory and prescription alerts"}
            {userRole === "patient" && "Medical reminders and updates"}
          </p>
        </div>
      </div>

      {/* Chat Container - Shows when chat button is clicked */}
      {showChat && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Team Chat</h2>
            <button
              onClick={onChatToggle}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close Chat
            </button>
          </div>
          <ChatContainer
            userName={userName}
            userRole={userRole}
            onUnreadCountsChange={onUnreadCountsChange}
          />
        </div>
      )}

    </div>
  )
}

export default DashboardContent
