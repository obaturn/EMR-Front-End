import { useLocation } from "react-router-dom"
import { DiagnosticsView } from "./Diagnostic"
import DashboardLayout from "./AdminDashboardLayout"

interface DiagnosticsPageProps {
  userName?: string
  userRole?: string
}

export default function DiagnosticsPage({ userName = "User", userRole = "doctor" }: DiagnosticsPageProps) {
  const location = useLocation()
  // Use location.state if available, otherwise fall back to props
  const effectiveUserName = location.state?.userName || userName
  const effectiveUserRole = location.state?.userRole || userRole

  return (
    <DashboardLayout userName={effectiveUserName} userRole={effectiveUserRole}>
      <DiagnosticsView />
    </DashboardLayout>
  )
}