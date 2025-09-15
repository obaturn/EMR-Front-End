import { useLocation } from "react-router-dom"
import { WorkflowView } from "./WorkflowView"
import DashboardLayout from "./AdminDashboardLayout"

interface WorkflowPageProps {
  userName?: string
  userRole?: string
}

export default function WorkflowPage({ userName = "User", userRole = "doctor" }: WorkflowPageProps) {
  const location = useLocation()
  // Use location.state if available, otherwise fall back to props
  const effectiveUserName = location.state?.userName || userName
  const effectiveUserRole = location.state?.userRole || userRole

  return (
    <DashboardLayout userName={effectiveUserName} userRole={effectiveUserRole}>
      <WorkflowView userRole={effectiveUserRole} userName={effectiveUserName} />
    </DashboardLayout>
  )
}