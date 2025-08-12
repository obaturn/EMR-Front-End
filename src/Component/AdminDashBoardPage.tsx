import { useLocation } from "react-router-dom"
import DashboardContent from "./AdminboardContent"
import DashboardLayout from "./AdminDashboardLayout"

const DashboardPage = () => {
  const location = useLocation()
  const userName = location.state?.userName || "User"
  const userRole = location.state?.userRole || "doctor"
  const specialty = location.state?.specialty || ""

  return (
    <DashboardLayout userName={userName} userRole={userRole} specialty={specialty}>
      <DashboardContent userName={userName} userRole={userRole} specialty={specialty} />
    </DashboardLayout>
  )
}

export default DashboardPage
