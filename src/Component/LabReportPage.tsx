import LabReport from "./LabResult";
import AdminDashboardLayout from "./AdminDashboardLayout";

export const LabReportPage = () => {
  return (
    <AdminDashboardLayout userName="Dr. Akintoye">
      <LabReport />
    </AdminDashboardLayout>
  );
}