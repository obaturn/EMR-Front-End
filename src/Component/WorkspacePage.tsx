import { useLocation } from "react-router-dom"
import { WorkspaceView } from "./WorkspaceView"
import DashboardLayout from "./AdminDashboardLayout"

interface WorkspacePageProps {
  userName?: string
  userRole?: string
}

export default function WorkspacePage({ userName = "User", userRole = "doctor" }: WorkspacePageProps) {
  const location = useLocation()
  // Use location.state if available, otherwise fall back to props
  const effectiveUserName = location.state?.userName || userName
  const effectiveUserRole = location.state?.userRole || userRole

  return (
    <DashboardLayout userName={effectiveUserName} userRole={effectiveUserRole}>
      <WorkspaceView userRole={effectiveUserRole} userName={effectiveUserName} />
    </DashboardLayout>
  )
}