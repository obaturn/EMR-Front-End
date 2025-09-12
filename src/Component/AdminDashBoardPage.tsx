import { useLocation } from "react-router-dom"
import { useState } from "react"
import DashboardContent from "./AdminboardContent"
import DashboardLayout from "./AdminDashboardLayout"

const DashboardPage = () => {
  const location = useLocation()
  const userName = location.state?.userName || "User"
  const userRole = location.state?.userRole || "doctor"
  const specialty = location.state?.specialty || ""

  const [showChat, setShowChat] = useState(true)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  const handleChatClick = () => {
    setShowChat(!showChat)
  }

  const handleUnreadCountsChange = (counts: {[key: string]: number}) => {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
    setUnreadMessageCount(total)
  }

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      specialty={specialty}
      onChatClick={handleChatClick}
      unreadMessageCount={unreadMessageCount}
    >
      <DashboardContent
        userName={userName}
        userRole={userRole}
        specialty={specialty}
        showChat={showChat}
        onChatToggle={() => setShowChat(false)}
        onUnreadCountsChange={handleUnreadCountsChange}
      />
    </DashboardLayout>
  )
}

export default DashboardPage
