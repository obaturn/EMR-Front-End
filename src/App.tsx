import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Start from "./Component/Start"
import CreateAccount from "./Component/CreateAccount"
import Login from "./Component/Login"
import ForgotPassword from "./Component/ForgotPassoword"
import ResetPassword from "./Component/ResetPassword"
import DashboardPage from "./Component/AdminDashBoardPage"
import { CalenderPage } from "./Component/CalenderPage"
import { AddPatientView } from "./Component/AddPatientView"
import AddPatient from "./Component/AddPatient"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard routes for all roles */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/doctor/dashboard" element={<DashboardPage />} />
        <Route path="/nurse/dashboard" element={<DashboardPage />} />
        <Route path="/pharmacy/dashboard" element={<DashboardPage />} />
        <Route path="/admin/patients" element={<AddPatientView />} />
       <Route path="/doctor/patients" element={<AddPatientView />} />
        <Route path="/nurse/patients" element={<AddPatientView />} />
        <Route path="/pharmacy/patients" element={<AddPatientView />} />
        <Route path = "/admin/add-patient" element={<AddPatient />}/>

        {/* Calendar routes for all roles */}
        <Route path="/admin/calendar" element={<CalenderPage />} />
        <Route path="/doctor/calendar" element={<CalenderPage />} />
        <Route path="/nurse/calendar" element={<CalenderPage />} />
        <Route path="/pharmacy/calendar" element={<CalenderPage />} />

        {/* Add more role-specific routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
