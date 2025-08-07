// src/Component/AdminDashboardPage.tsx
import { useLocation } from "react-router-dom";
import DashboardContent from "./AdminboardContent";
import AdminDashboardLayout from "./AdminDashboardLayout";

const AdminDashboardPage = () => {
  const location = useLocation();
  const doctorName = location.state?.doctorName || "Doctor";

  return (
    <AdminDashboardLayout doctorName={doctorName}>
      <DashboardContent doctorName={doctorName} />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
