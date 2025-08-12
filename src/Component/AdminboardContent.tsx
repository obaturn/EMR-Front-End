interface DashboardContentProps {
  userName?: string
  userRole?: string
  specialty?: string
}

const DashboardContent = ({ userName = "User", userRole = "doctor", specialty = "" }: DashboardContentProps) => {
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
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-gray-600">
            {userRole === "doctor" && "Recent patient consultations"}
            {userRole === "nurse" && "Recent patient care activities"}
            {userRole === "pharmacy" && "Recent prescription fills"}
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          <p className="text-gray-600">
            {userRole === "doctor" && "Appointment reminders and alerts"}
            {userRole === "nurse" && "Patient care notifications"}
            {userRole === "pharmacy" && "Inventory and prescription alerts"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
