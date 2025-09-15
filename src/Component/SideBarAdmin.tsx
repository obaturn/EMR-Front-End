import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserInjured,
  FaFileAlt,
  FaUser,
  FaBriefcase,
  FaBoxes,
  FaFlask,
  FaComments,
  FaStethoscope,
  FaLifeRing,
  FaPills,
  FaUserNurse,
  FaHeart,
  FaProjectDiagram,
  FaChartBar,
} from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import type { IconType } from "react-icons"

interface SidebarAdminProps {
  userRole?: string
  onChatClick?: () => void
  unreadMessageCount?: number
}

interface MenuItem {
  to: string
  icon: IconType
  label: string
  isChat?: boolean
}

const SidebarAdmin = ({ userRole = "doctor", onChatClick, unreadMessageCount = 0 }: SidebarAdminProps) => {
  const [isOnline, setIsOnline] = useState(true)

  // Simulate online/offline status (in real app, this would connect to WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% chance of being online
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Base menu items available to all roles
  const baseMenuItems: MenuItem[] = [
    { to: `/${userRole}/dashboard`, icon: FaTachometerAlt, label: "Dashboard", isChat: false },
    { to: `/${userRole}/calendar`, icon: FaCalendarAlt, label: "Calendar", isChat: false },
    { to: `/${userRole}/patients`, icon: FaUserInjured, label: "Patients", isChat: false },
    { to: `/${userRole}/reports`, icon: FaFileAlt, label: "Reports", isChat: false },
    { to: `/${userRole}/profile`, icon: FaUser, label: "Profile", isChat: false },
  ]

  // Workflow menu item
  const workflowMenuItem: MenuItem = {
    to: `/${userRole}/workflow`,
    icon: FaProjectDiagram,
    label: "Workflow",
    isChat: false
  }

  // Analytics menu item
  const analyticsMenuItem: MenuItem = {
    to: `/${userRole}/analytics`,
    icon: FaChartBar,
    label: "Analytics",
    isChat: false
  }

  
  const roleSpecificItems: Record<string, MenuItem[]> = {
    doctor: [
      { to: "/doctor/diagnostics", icon: FaStethoscope, label: "Diagnostics", isChat: false },
      { to: "/doctor/lab", icon: FaFlask, label: "Lab Results", isChat: false },
      { to: "/doctor/workspace", icon: FaBriefcase, label: "Workspace", isChat: false },
      { to: "/doctor/health-promotion", icon: FaLifeRing, label: "Health Promotion", isChat: false },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback", isChat: false },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support", isChat: false },
    ],
    nurse: [
      { to: "/nurse/patient-care", icon: FaUserNurse, label: "Patient Care", isChat: false },
      { to: "/nurse/medications", icon: FaPills, label: "Medications", isChat: false },
      { to: "/nurse/vitals", icon: FaHeart, label: "Vital Signs", isChat: false },
      { to: "/nurse/ward-management", icon: FaBriefcase, label: "Ward Management", isChat: false },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback", isChat: false },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support", isChat: false },
    ],
    pharmacy: [
      { to: "/pharmacy/prescriptions", icon: FaPills, label: "Prescriptions", isChat: false },
      { to: "/pharmacy/inventory", icon: FaBoxes, label: "Inventory", isChat: false },
      { to: "/pharmacy/dispensing", icon: FaFlask, label: "Dispensing", isChat: false },
      { to: "/pharmacy/drug-info", icon: FaFileAlt, label: "Drug Information", isChat: false },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback", isChat: false },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support", isChat: false },
    ],
  }

  // Common items for all roles
  const commonItems: MenuItem[] = [
    { to: `/${userRole}/chat`, icon: FaComments, label: "Chat", isChat: true },
  ]

  // Combine menu items based on role
  const menuItems: MenuItem[] = [
    ...baseMenuItems,
    workflowMenuItem,
    analyticsMenuItem,
    ...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || []),
    ...commonItems,
  ]

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor Portal"
      case "nurse":
        return "Nurse Portal"
      case "pharmacy":
        return "Pharmacy Portal"
      default:
        return "Clinic Portal"
    }
  }

  return (
    <div className="h-screen w-64 bg-white flex flex-col shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">S10</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">Clinic</span>
            <span className="text-xs text-gray-500">{getRoleDisplayName(userRole)}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => (
            item.isChat ? (
              <button
                key={item.to}
                onClick={onChatClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
              >
                <div className="relative">
                  <item.icon className="w-4 h-4" />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {unreadMessageCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                    </div>
                  )}
                </div>
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            )
          ))}
        </div>
      </nav>

    </div>
  )
}

export default SidebarAdmin
