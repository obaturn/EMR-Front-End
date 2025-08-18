import { useLocation } from "react-router-dom"
import ProfilePage from "../Component/ProfilePage"

const PharmacyProfilePage = () => {
  const location = useLocation()
  const userName = location.state?.userName || "Pharmacist Davis"
  const userRole = "pharmacy"
  const specialty = location.state?.specialty || "Clinical Pharmacy"

  return <ProfilePage userName={userName} userRole={userRole} specialty={specialty} />
}

export default PharmacyProfilePage
