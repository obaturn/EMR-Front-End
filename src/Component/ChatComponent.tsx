import React, { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

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

interface ChatComponentProps {
  userId: string
  userName: string
  userRole: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, userName, userRole }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<string>('')
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mark messages as read when conversation is opened
  useEffect(() => {
    console.log(`🔍 useEffect triggered - selectedRecipient: ${selectedRecipient}, socket: ${socket ? 'connected' : 'null'}`)
    if (selectedRecipient && socket) {
      // Find unread messages in this conversation
      const unreadMessagesInConversation = messages.filter(msg =>
        msg.recipientId === userId &&
        msg.senderId === selectedRecipient &&
        !msg.read
      )

      console.log(`📝 Found ${unreadMessagesInConversation.length} unread messages for conversation with ${selectedRecipient}`)
      console.log('All messages:', messages.map(msg => ({ id: msg.id, senderId: msg.senderId, recipientId: msg.recipientId, read: msg.read, text: msg.text })))

      if (unreadMessagesInConversation.length > 0) {
        // Mark conversation as read
        console.log(`🔄 Marking ${unreadMessagesInConversation.length} messages as read for conversation with ${selectedRecipient}`)
        console.log('Unread messages:', unreadMessagesInConversation.map(msg => ({ id: msg.id, text: msg.text })))
        socket.emit('markConversationAsRead', selectedRecipient)
      } else {
        console.log(`ℹ️ No unread messages found for conversation with ${selectedRecipient}`)
      }
    } else {
      console.log(`❌ Conditions not met - selectedRecipient: ${selectedRecipient}, socket: ${socket ? 'connected' : 'null'}`)
    }
  }, [selectedRecipient, socket, userId, messages])

  useEffect(() => {
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
    newSocket.on('onlineUsers', (users: any[]) => {
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

    // Handle unread counts update
    newSocket.on('unreadCounts', (counts: {[key: string]: number}) => {
      console.log('📨 Received unread counts:', counts)
      console.log('Current unread counts before update:', unreadCounts)
      setUnreadCounts(counts)
      console.log('Updated unread counts:', counts)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [userId, userName, userRole])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !selectedRecipient) return

    const messageData = {
      text: newMessage,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      recipientId: selectedRecipient,
      timestamp: new Date().toISOString()
    }

    console.log('Sending message:', messageData)
    socket.emit('sendMessage', messageData)
    setNewMessage('')
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
        <h3 className="font-semibold text-gray-800">Team Chat</h3>
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
          <h4 className="font-medium text-gray-700 mb-3">Online Users</h4>
          <div className="space-y-2">
            {onlineUsers.map((user) => {
              const unreadCount = unreadCounts[user.userId] || 0
              return (
                <button
                  key={user.userId}
                  onClick={() => {
                    console.log(`👆 Clicking on user: ${user.userName} (${user.userId})`)
                    console.log(`📊 Current unread counts:`, unreadCounts)
                    console.log(`🔢 Unread count for ${user.userId}:`, unreadCount)
                    setSelectedRecipient(user.userId)
                  }}
                  className={`w-full text-left p-2 rounded relative ${
                    selectedRecipient === user.userId
                      ? 'bg-orange-100 text-orange-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm">{user.userName}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.userRole}</div>
                  {unreadCount > 0 && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </button>
              )
            })}
            {onlineUsers.length === 0 && (
              <p className="text-sm text-gray-500">No users online</p>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedRecipient ? (
            <>
              <div className="flex-1 p-3 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
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
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <p>Select a user to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatComponent