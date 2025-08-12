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
} from "react-icons/fa"
import { NavLink } from "react-router-dom"

interface SidebarAdminProps {
  userRole?: string
}

const SidebarAdmin = ({ userRole = "doctor" }: SidebarAdminProps) => {
  // Base menu items available to all roles
  const baseMenuItems = [
    { to: `/${userRole}/dashboard`, icon: FaTachometerAlt, label: "Dashboard" },
    { to: `/${userRole}/calendar`, icon: FaCalendarAlt, label: "Calendar" },
    { to: `/${userRole}/patients`, icon: FaUserInjured, label: "Patients" },
    { to: `/${userRole}/reports`, icon: FaFileAlt, label: "Reports" },
    { to: `/${userRole}/profile`, icon: FaUser, label: "Profile" },
  ]

  
  const roleSpecificItems = {
    doctor: [
      { to: "/doctor/diagnostics", icon: FaStethoscope, label: "Diagnostics" },
      { to: "/doctor/lab", icon: FaFlask, label: "Lab Results" },
      { to: "/doctor/workspace", icon: FaBriefcase, label: "Workspace" },
      { to: "/doctor/health-promotion", icon: FaLifeRing, label: "Health Promotion" },
    ],
    nurse: [
      { to: "/nurse/patient-care", icon: FaUserNurse, label: "Patient Care" },
      { to: "/nurse/medications", icon: FaPills, label: "Medications" },
      { to: "/nurse/vitals", icon: FaHeart, label: "Vital Signs" },
      { to: "/nurse/ward-management", icon: FaBriefcase, label: "Ward Management" },
    ],
    pharmacy: [
      { to: "/pharmacy/prescriptions", icon: FaPills, label: "Prescriptions" },
      { to: "/pharmacy/inventory", icon: FaBoxes, label: "Inventory" },
      { to: "/pharmacy/dispensing", icon: FaFlask, label: "Dispensing" },
      { to: "/pharmacy/drug-info", icon: FaFileAlt, label: "Drug Information" },
    ],
  }

  // Common items for all roles
  const commonItems = [
    { to: `/${userRole}/feedbacks`, icon: FaComments, label: "Feedbacks" },
    { to: `/${userRole}/support`, icon: FaLifeRing, label: "Support" },
  ]

  // Combine menu items based on role
  const menuItems = [
    ...baseMenuItems,
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
          ))}
        </div>
      </nav>
    </div>
  )
}

export default SidebarAdmin
