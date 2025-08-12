interface TopBarAdminProps {
  userName?: string
  userRole?: string
  specialty?: string
}

const TopBarAdmin = ({ userName = "User", userRole = "doctor", specialty = "" }: TopBarAdminProps) => {
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{displayName}</p>
            {specialty && <p className="text-xs text-gray-500">{specialty}</p>}
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{userName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBarAdmin
