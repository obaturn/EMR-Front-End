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
  FaMapMarkerAlt, 
  FaLifeRing 
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const SidebarAdmin = () => {
  const menuItems = [
    { to: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { to: "/admin/calendar", icon: FaCalendarAlt, label: "Calendar" },
    { to: "/admin/patients", icon: FaUserInjured, label: "Patients" },
    { to: "/admin/reports", icon: FaFileAlt, label: "Reports" },
    { to: "/admin/profile", icon: FaUser, label: "Profile" },
    { to: "/admin/workspace", icon: FaBriefcase, label: "Workspace" },
    { to: "/admin/fave-office", icon: FaMapMarkerAlt, label: "Fave Office" },
    { to: "/admin/inventory", icon: FaBoxes, label: "Inventory" },
    { to: "/admin/lab", icon: FaFlask, label: "Lab" },
    { to: "/admin/feedbacks", icon: FaComments, label: "Feedbacks" },
    { to: "/admin/diagnostics", icon: FaStethoscope, label: "Diagnostics" },
    { to: "/admin/health-promotion", icon: FaLifeRing, label: "Health Promotion" },
    { to: "/admin/markers", icon: FaMapMarkerAlt, label: "Markers" },
    { to: "/admin/support", icon: FaLifeRing, label: "Support" },
  ];

  return (
    <div className="h-screen w-64 bg-white flex flex-col shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">S10</span>
          </div>
          <span className="font-semibold text-gray-800">Clinic</span>
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
  );
};

export default SidebarAdmin;
