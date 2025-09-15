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
import ReportsPage from "./Component/ReportPages"
import ProfilePage from "./Component/ProfilePage"
import DiagnosticsPage from "./Component/DiagnosticsPage"
import LabReport from "./Component/LabResult"
import ChatPage from "./Component/ChatPage"
import WorkflowPage from "./Component/WorkflowPage"
import WorkspacePage from "./Component/WorkspacePage"
import AnalyticsPage from "./Component/AnalyticsPage"
import EHRPage from "./Component/EHRPage"
import HealthPromotionPage from "./Component/HealthPromotionPage"
import FeedbackPage from "./Component/FeedbackPage"
import SupportPage from "./Component/SupportPage"


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
        <Route path="/patient/dashboard" element={<DashboardPage />} />
        <Route path="/admin/patients" element={<AddPatientView />} />
        <Route path="/doctor/patients" element={<AddPatientView />} />
        <Route path="/nurse/patients" element={<AddPatientView />} />
        <Route path="/pharmacy/patients" element={<AddPatientView />} />
        <Route path="/patient/patients" element={<AddPatientView />} />
        <Route path = "/admin/add-patient" element={<AddPatient />}/>

        {/* Calendar routes for all roles */}
        <Route path="/admin/calendar" element={<CalenderPage />} />
        <Route path="/doctor/calendar" element={<CalenderPage />} />
        <Route path="/nurse/calendar" element={<CalenderPage />} />
        <Route path="/pharmacy/calendar" element={<CalenderPage />} />
        <Route path="/patient/calendar" element={<CalenderPage />} />

        {/* Reports routes for all roles */}
        <Route path="/admin/reports" element={<ReportsPage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/reports" element={<ReportsPage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/reports" element={<ReportsPage userRole="nurse" userName="Nurse" />} />
        <Route path="/pharmacy/reports" element={<ReportsPage userRole="pharmacy" userName="Pharmacist" />} />
        <Route path="/patient/reports" element={<ReportsPage userRole="patient" userName="Patient" />} />

        <Route path="/admin/profile" element={<ProfilePage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/profile" element={<ProfilePage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/profile" element={<ProfilePage userRole="nurse" userName="Nurse" />} />
        <Route path="/pharmacy/profile" element={<ProfilePage userRole="pharmacy" userName="Pharmacist" />} />
        <Route path="/patient/profile" element={<ProfilePage userRole="patient" userName="Patient" />} />

        <Route path="/admin/diagnostics" element={<DiagnosticsPage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/diagnostics" element={<DiagnosticsPage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/diagnostics" element={<DiagnosticsPage userRole="nurse" userName="Nurse" />} />

        <Route path="/admin/lab" element={<LabReport userRole="admin" userName="Admin" />} />
        <Route path="/doctor/lab" element={<LabReport userRole="doctor" userName="Dr.Akintoye"/>} />
        <Route path="/nurse/lab" element={<LabReport userRole="nurse" userName="Nurse"/>} />

        {/* Workflow routes for all roles */}
        <Route path="/admin/workflow" element={<WorkflowPage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/workflow" element={<WorkflowPage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/workflow" element={<WorkflowPage userRole="nurse" userName="Nurse" />} />
        <Route path="/pharmacy/workflow" element={<WorkflowPage userRole="pharmacy" userName="Pharmacist" />} />
        <Route path="/patient/workflow" element={<WorkflowPage userRole="patient" userName="Patient" />} />

        {/* Workspace routes for all roles */}
        <Route path="/admin/workspace" element={<WorkspacePage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/workspace" element={<WorkspacePage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/workspace" element={<WorkspacePage userRole="nurse" userName="Nurse" />} />
        <Route path="/pharmacy/workspace" element={<WorkspacePage userRole="pharmacy" userName="Pharmacist" />} />
        <Route path="/patient/workspace" element={<WorkspacePage userRole="patient" userName="Patient" />} />

        {/* Analytics routes for all roles */}
        <Route path="/admin/analytics" element={<AnalyticsPage userRole="admin" userName="Admin" />} />
        <Route path="/doctor/analytics" element={<AnalyticsPage userRole="doctor" userName="Dr. Akintoye" />} />
        <Route path="/nurse/analytics" element={<AnalyticsPage userRole="nurse" userName="Nurse" />} />
        <Route path="/pharmacy/analytics" element={<AnalyticsPage userRole="pharmacy" userName="Pharmacist" />} />
        <Route path="/patient/analytics" element={<AnalyticsPage userRole="patient" userName="Patient" />} />

        {/* EHR routes for all roles */}
        <Route path="/admin/ehr/:patientId" element={<EHRPage userName="Admin" />} />
        <Route path="/doctor/ehr/:patientId" element={<EHRPage userName="Dr. Akintoye" />} />
        <Route path="/nurse/ehr/:patientId" element={<EHRPage userName="Nurse" />} />
        <Route path="/pharmacy/ehr/:patientId" element={<EHRPage userName="Pharmacist" />} />
        <Route path="/patient/ehr/:patientId" element={<EHRPage userName="Patient" />} />

        {/* Health Promotion routes for all roles */}
        <Route path="/admin/health-promotion" element={<HealthPromotionPage userName="Admin" userRole="admin" />} />
        <Route path="/doctor/health-promotion" element={<HealthPromotionPage userName="Dr. Akintoye" userRole="doctor" />} />
        <Route path="/nurse/health-promotion" element={<HealthPromotionPage userName="Nurse" userRole="nurse" />} />
        <Route path="/pharmacy/health-promotion" element={<HealthPromotionPage userName="Pharmacist" userRole="pharmacy" />} />
        <Route path="/patient/health-promotion" element={<HealthPromotionPage userName="Patient" userRole="patient" />} />

        {/* Feedback routes for all roles */}
        <Route path="/admin/feedback" element={<FeedbackPage userName="Admin" userRole="admin" />} />
        <Route path="/doctor/feedback" element={<FeedbackPage userName="Dr. Akintoye" userRole="doctor" />} />
        <Route path="/nurse/feedback" element={<FeedbackPage userName="Nurse" userRole="nurse" />} />
        <Route path="/pharmacy/feedback" element={<FeedbackPage userName="Pharmacist" userRole="pharmacy" />} />
        <Route path="/patient/feedback" element={<FeedbackPage userName="Patient" userRole="patient" />} />

        {/* Support routes for all roles */}
        <Route path="/admin/support" element={<SupportPage userName="Admin" userRole="admin" />} />
        <Route path="/doctor/support" element={<SupportPage userName="Dr. Akintoye" userRole="doctor" />} />
        <Route path="/nurse/support" element={<SupportPage userName="Nurse" userRole="nurse" />} />
        <Route path="/pharmacy/support" element={<SupportPage userName="Pharmacist" userRole="pharmacy" />} />
        <Route path="/patient/support" element={<SupportPage userName="Patient" userRole="patient" />} />

        {/* Chat routes for all roles */}
        <Route path="/admin/chat" element={<ChatPage />} />
        <Route path="/doctor/chat" element={<ChatPage />} />
        <Route path="/nurse/chat" element={<ChatPage />} />
        <Route path="/pharmacy/chat" element={<ChatPage />} />
        <Route path="/patient/chat" element={<ChatPage />} />
        {/* Add more role-specific routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
