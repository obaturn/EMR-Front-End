import { useLocation } from "react-router-dom"
import { AnalyticsView } from "./AnalyticsView"
import DashboardLayout from "./AdminDashboardLayout"

interface AnalyticsPageProps {
  userName?: string
  userRole?: string
}

export default function AnalyticsPage({ userName = "User", userRole = "doctor" }: AnalyticsPageProps) {
  const location = useLocation()
  // Use location.state if available, otherwise fall back to props
  const effectiveUserName = location.state?.userName || userName
  const effectiveUserRole = location.state?.userRole || userRole

  return (
    <DashboardLayout userName={effectiveUserName} userRole={effectiveUserRole}>
      <AnalyticsView userRole={effectiveUserRole} userName={effectiveUserName} />
    </DashboardLayout>
  )
}