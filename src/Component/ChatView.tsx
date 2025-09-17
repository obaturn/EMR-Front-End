"use client"

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

const ChatView = () => {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Chat</h1>
        <p className="text-gray-600">Communicate with your team members in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Online Users Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Online Users</h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {onlineUsers.map((user) => (
                <button
                  key={user.userId}
                  onClick={() => setSelectedRecipient(user.userId)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRecipient === user.userId
                      ? 'bg-orange-50 border-orange-200 text-orange-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{user.userName}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.userRole}</div>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedRecipient
                    ? `Chat with ${onlineUsers.find(u => u.userId === selectedRecipient)?.userName || 'User'}`
                    : 'Team Chat'
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            {/* Messages Area */}
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
                  User ID: {userId} | Connected: {isConnected ? 'Yes' : 'No'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatView