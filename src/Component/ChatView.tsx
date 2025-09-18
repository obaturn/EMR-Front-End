import React, { useState, useEffect, useRef } from 'react'
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

const ChatView: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('User')
  const [userRole, setUserRole] = useState<string>('doctor')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Get user data from localStorage or generate a default
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUserId(userData.id || `user_${Date.now()}`)
      setUserName(userData.name || 'User')
      setUserRole(userData.role || 'doctor')
    } else {
      // Try to get from URL params or use defaults
      const urlParams = new URLSearchParams(window.location.search)
      const role = urlParams.get('role') || 'doctor'
      const name = urlParams.get('name') || 'Dr. Akintoye'

      const defaultUserId = `${role}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
      setUserId(defaultUserId)
      setUserName(name)
      setUserRole(role)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    // Connect to WebSocket server
    const newSocket = io('https://chat-emr.onrender.com', {
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
      setOnlineUsers(users.filter(user => user.userId !== userId))
    })

    // Handle message read confirmation
    newSocket.on('messageRead', (messageId: string) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      )
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Online Users Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Online Users</h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {onlineUsers.map((user) => (
                <button
                  key={user.userId}
                  onClick={() => setSelectedRecipient(user.userId)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    selectedRecipient === user.userId
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 text-orange-800 shadow-md'
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{user.userName}</div>
                      <div className="text-xs text-gray-500 capitalize flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {user.userRole}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {onlineUsers.length === 0 && (
                <div className="text-center py-8">
                  <FaUserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No users online</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedRecipient && (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {onlineUsers.find(u => u.userId === selectedRecipient)?.userName.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedRecipient
                      ? onlineUsers.find(u => u.userId === selectedRecipient)?.userName || 'User'
                      : 'Team Chat'
                    }
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isConnected ? 'Active now' : 'Disconnected'}
                    {selectedRecipient && (
                      <span className="text-xs text-gray-500">
                        • {onlineUsers.find(u => u.userId === selectedRecipient)?.userRole || ''}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedRecipient ? (
                <>
                  {filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4">
                        <FaUserCircle className="w-8 h-8 text-orange-400" />
                      </div>
                      <h4 className="text-lg font-medium mb-2 text-gray-700">No messages yet</h4>
                      <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-end gap-2 ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.senderId !== userId && (
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-orange-600">
                                {message.senderName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              message.senderId === userId
                                ? 'bg-orange-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                            }`}
                          >
                            <div className="text-sm leading-relaxed">{message.text}</div>
                            <div className={`text-xs mt-2 flex items-center gap-1 ${
                              message.senderId === userId ? 'text-orange-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {message.senderId === userId && (
                                <span className="ml-1">
                                  {message.read ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                          {message.senderId === userId && (
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-white">
                                {userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
                    <FaUserCircle className="w-10 h-10 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Start a conversation</h3>
                  <p className="text-sm max-w-sm">Select a healthcare professional from the online users list to begin chatting securely</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedRecipient && (
              <div className="p-4 border-t border-gray-200">
                {!isConnected && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">
                      🔴 Disconnected from chat server. Messages cannot be sent.
                    </p>
                  </div>
                )}
                <form onSubmit={sendMessage} className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:bg-gray-100 transition-all"
                      disabled={!isConnected}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      onClick={() => {/* Add emoji picker logic */}}
                    >
                      😊
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  User ID: {userId} | Connected: {isConnected ? 'Yes' : 'No'}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ChatView