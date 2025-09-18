import SidebarAdmin from "./SideBarAdmin"
import TopBarAdmin from "./TopBarAdmin"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  userName?: string
  userRole?: string
  specialty?: string
  unreadMessageCount?: number
}

const DashboardLayout = ({
  children,
  userName = "User",
  userRole = "doctor",
  specialty = "",
  unreadMessageCount = 0,
}: DashboardLayoutProps) => {


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarAdmin
        userRole={userRole}
        unreadMessageCount={unreadMessageCount}
      />


      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBarAdmin userName={userName} userRole={userRole} specialty={specialty} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>

    </div>
  )
}

export default DashboardLayout
