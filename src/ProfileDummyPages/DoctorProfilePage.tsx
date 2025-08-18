import { useLocation } from "react-router-dom"
import ProfilePage from "../Component/ProfilePage"

const DoctorProfilePage = () => {
  const location = useLocation()
  const userName = location.state?.userName || "Dr. Smith"
  const userRole = "doctor"
  const specialty = location.state?.specialty || "Internal Medicine"

  return <ProfilePage userName={userName} userRole={userRole} specialty={specialty} />
}

export default DoctorProfilePage
