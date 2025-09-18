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

const SidebarAdmin = ({ userRole = "doctor", unreadMessageCount = 0 }: SidebarAdminProps) => {
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
    { to: `/${userRole}/dashboard`, icon: FaTachometerAlt, label: "Dashboard" },
    { to: `/${userRole}/calendar`, icon: FaCalendarAlt, label: "Calendar" },
    { to: `/${userRole}/patients`, icon: FaUserInjured, label: "Patients" },
    { to: `/${userRole}/reports`, icon: FaFileAlt, label: "Reports" },
    { to: `/${userRole}/profile`, icon: FaUser, label: "Profile" },
  ]

  // Workflow menu item
  const workflowMenuItem: MenuItem = {
    to: `/${userRole}/workflow`,
    icon: FaProjectDiagram,
    label: "Workflow"
  }

  // Analytics menu item
  const analyticsMenuItem: MenuItem = {
    to: `/${userRole}/analytics`,
    icon: FaChartBar,
    label: "Analytics"
  }


  const roleSpecificItems: Record<string, MenuItem[]> = {
    doctor: [
      { to: "/doctor/diagnostics", icon: FaStethoscope, label: "Diagnostics" },
      { to: "/doctor/lab", icon: FaFlask, label: "Lab Results" },
      { to: "/doctor/workspace", icon: FaBriefcase, label: "Workspace" },
      { to: "/doctor/health-promotion", icon: FaLifeRing, label: "Health Promotion" },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback" },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support" },
    ],
    nurse: [
      { to: "/nurse/patient-care", icon: FaUserNurse, label: "Patient Care" },
      { to: "/nurse/medications", icon: FaPills, label: "Medications" },
      { to: "/nurse/vitals", icon: FaHeart, label: "Vital Signs" },
      { to: "/nurse/ward-management", icon: FaBriefcase, label: "Ward Management" },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback" },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support" },
    ],
    pharmacy: [
      { to: "/pharmacy/prescriptions", icon: FaPills, label: "Prescriptions" },
      { to: "/pharmacy/inventory", icon: FaBoxes, label: "Inventory" },
      { to: "/pharmacy/dispensing", icon: FaFlask, label: "Dispensing" },
      { to: "/pharmacy/drug-info", icon: FaFileAlt, label: "Drug Information" },
      { to: `/${userRole}/feedback`, icon: FaComments, label: "Feedback" },
      { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support" },
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
    <div className="h-screen w-64 bg-gradient-to-b from-orange-50 to-white flex flex-col shadow-lg border-r border-orange-200">
      <div className="p-6 border-b border-orange-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">OBT</span>
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
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              <div className="relative">
                <item.icon className="w-4 h-4" />
                {item.isChat && (
                  <>
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {unreadMessageCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                      </div>
                    )}
                  </>
                )}
              </div>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}

export default SidebarAdmin