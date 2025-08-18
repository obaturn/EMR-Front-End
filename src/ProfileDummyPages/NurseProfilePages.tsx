import { useLocation } from "react-router-dom"
import ProfilePage from "../Component/ProfilePage"

const NurseProfilePage = () => {
  const location = useLocation()
  const userName = location.state?.userName || "Nurse Johnson"
  const userRole = "nurse"
  const specialty = location.state?.specialty || "Critical Care"

  return <ProfilePage userName={userName} userRole={userRole} specialty={specialty} />
}

export default NurseProfilePage
